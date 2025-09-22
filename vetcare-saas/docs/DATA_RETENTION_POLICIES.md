# Data Retention Policies

## HIPAA Compliance Requirements

### Medical Records Retention (7 Years)
```sql
-- Medical records must be retained for 7 years after last visit
-- or 7 years after pet reaches age of majority (varies by state)

-- Calculate retention cutoff date
SET @retention_cutoff = DATE_SUB(CURDATE(), INTERVAL 7 YEAR);

-- Identify records eligible for archival
SELECT 
  mr.id,
  mr.visit_date,
  p.name as pet_name,
  DATEDIFF(CURDATE(), mr.visit_date) as days_old
FROM medical_records mr
JOIN pets p ON mr.pet_id = p.id
WHERE mr.visit_date < @retention_cutoff
  AND mr.id NOT IN (
    -- Keep if pet has recent records
    SELECT DISTINCT mr2.id 
    FROM medical_records mr2 
    WHERE mr2.pet_id = mr.pet_id 
      AND mr2.visit_date >= @retention_cutoff
  );
```

### Audit Log Retention (7 Years)
```sql
-- HIPAA requires audit logs for 7 years
CREATE EVENT audit_log_cleanup
ON SCHEDULE EVERY 1 MONTH
STARTS CONCAT(CURDATE() + INTERVAL 1 MONTH, ' 02:00:00')
DO
BEGIN
  DELETE FROM audit_logs 
  WHERE created_at < DATE_SUB(CURDATE(), INTERVAL 7 YEAR);
END;
```

## Operational Data Retention

### Session and Token Data
```sql
-- Clean expired sessions (30 days)
DELETE FROM user_sessions 
WHERE last_activity < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Clean expired password reset tokens (24 hours)
UPDATE users 
SET password_reset_token = NULL, 
    password_reset_expires = NULL
WHERE password_reset_expires < NOW();

-- Clean expired JWT blacklist (7 days after expiry)
DELETE FROM jwt_blacklist 
WHERE expires_at < DATE_SUB(NOW(), INTERVAL 7 DAY);
```

### Appointment Data
```sql
-- Archive completed appointments older than 3 years
-- but keep for reference and reporting
UPDATE appointments 
SET archived = TRUE 
WHERE status = 'completed' 
  AND start_time < DATE_SUB(CURDATE(), INTERVAL 3 YEAR);
```

### Cache and Temporary Data
```sql
-- Clean temporary file uploads (7 days)
DELETE FROM temp_uploads 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 7 DAY);

-- Clean notification queue (30 days)
DELETE FROM notification_queue 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)
  AND status IN ('sent', 'failed');
```

## Automated Cleanup Procedures

### Daily Cleanup Job
```sql
DELIMITER $$

CREATE EVENT daily_cleanup
ON SCHEDULE EVERY 1 DAY
STARTS CONCAT(CURDATE() + INTERVAL 1 DAY, ' 02:00:00')
DO
BEGIN
  -- Clean expired sessions
  DELETE FROM user_sessions 
  WHERE last_activity < DATE_SUB(NOW(), INTERVAL 30 DAY);
  
  -- Clean expired tokens
  UPDATE users 
  SET password_reset_token = NULL, 
      password_reset_expires = NULL
  WHERE password_reset_expires < NOW();
  
  -- Clean temporary uploads
  DELETE FROM temp_uploads 
  WHERE created_at < DATE_SUB(NOW(), INTERVAL 7 DAY);
  
  -- Clean old notification queue
  DELETE FROM notification_queue 
  WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)
    AND status IN ('sent', 'failed');
    
  -- Update statistics
  INSERT INTO cleanup_stats (run_date, records_cleaned) 
  VALUES (CURDATE(), ROW_COUNT());
END$$

DELIMITER ;
```

### Weekly Cleanup Job
```sql
DELIMITER $$

CREATE EVENT weekly_cleanup
ON SCHEDULE EVERY 1 WEEK
STARTS '2024-01-01 03:00:00'
DO
BEGIN
  -- Archive old appointments
  UPDATE appointments 
  SET archived = TRUE 
  WHERE status IN ('completed', 'cancelled', 'no_show')
    AND start_time < DATE_SUB(CURDATE(), INTERVAL 1 YEAR);
  
  -- Clean old reminder logs
  DELETE FROM appointment_reminders 
  WHERE created_at < DATE_SUB(NOW(), INTERVAL 6 MONTH)
    AND status IN ('sent', 'failed');
  
  -- Optimize tables
  OPTIMIZE TABLE appointments, medical_records, audit_logs;
END$$

DELIMITER ;
```

### Monthly Compliance Review
```sql
DELIMITER $$

CREATE EVENT monthly_compliance_check
ON SCHEDULE EVERY 1 MONTH
STARTS '2024-01-01 01:00:00'
DO
BEGIN
  -- Create compliance report
  INSERT INTO compliance_reports (
    report_date,
    total_medical_records,
    records_over_7_years,
    audit_logs_count,
    audit_logs_over_7_years
  )
  SELECT 
    CURDATE(),
    COUNT(*) as total_medical_records,
    SUM(CASE WHEN visit_date < DATE_SUB(CURDATE(), INTERVAL 7 YEAR) THEN 1 ELSE 0 END) as records_over_7_years,
    (SELECT COUNT(*) FROM audit_logs) as audit_logs_count,
    (SELECT COUNT(*) FROM audit_logs WHERE created_at < DATE_SUB(CURDATE(), INTERVAL 7 YEAR)) as audit_logs_over_7_years
  FROM medical_records;
END$$

DELIMITER ;
```

## Data Archival Strategy

### Medical Records Archive Table
```sql
-- Create archive table with same structure
CREATE TABLE medical_records_archive LIKE medical_records;

-- Add archive metadata
ALTER TABLE medical_records_archive 
ADD COLUMN archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN archive_reason VARCHAR(255);

-- Archive procedure
DELIMITER $$

CREATE PROCEDURE archive_medical_records()
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE record_id VARCHAR(36);
  DECLARE archive_cursor CURSOR FOR
    SELECT mr.id 
    FROM medical_records mr
    JOIN pets p ON mr.pet_id = p.id
    WHERE mr.visit_date < DATE_SUB(CURDATE(), INTERVAL 7 YEAR)
      AND p.is_deceased = TRUE
      AND p.deceased_date < DATE_SUB(CURDATE(), INTERVAL 7 YEAR);
  
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
  
  OPEN archive_cursor;
  
  archive_loop: LOOP
    FETCH archive_cursor INTO record_id;
    IF done THEN
      LEAVE archive_loop;
    END IF;
    
    -- Move to archive
    INSERT INTO medical_records_archive 
    SELECT *, NOW(), 'HIPAA 7-year retention' 
    FROM medical_records 
    WHERE id = record_id;
    
    -- Archive related diagnoses
    INSERT INTO diagnoses_archive 
    SELECT *, NOW(), 'HIPAA 7-year retention'
    FROM diagnoses 
    WHERE medical_record_id = record_id;
    
    -- Delete from active tables
    DELETE FROM diagnoses WHERE medical_record_id = record_id;
    DELETE FROM medical_records WHERE id = record_id;
  END LOOP;
  
  CLOSE archive_cursor;
END$$

DELIMITER ;
```

### Audit Log Archive
```sql
-- Create audit log archive for compliance
CREATE TABLE audit_logs_archive (
  id VARCHAR(36),
  clinic_id VARCHAR(36),
  user_id VARCHAR(36),
  entity_type VARCHAR(100),
  entity_id VARCHAR(36),
  action ENUM('create', 'read', 'update', 'delete', 'login', 'logout'),
  old_values JSON,
  new_values JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  session_id VARCHAR(100),
  created_at TIMESTAMP,
  archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_audit_archive_clinic_date (clinic_id, created_at DESC),
  INDEX idx_audit_archive_user (user_id),
  INDEX idx_audit_archive_entity (entity_type, entity_id)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## Data Purging Rules

### Hard Delete Criteria
```sql
-- Only hard delete non-medical data after archive period
DELETE FROM user_sessions 
WHERE last_activity < DATE_SUB(NOW(), INTERVAL 1 YEAR);

DELETE FROM notification_logs 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 2 YEAR);

DELETE FROM system_logs 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR)
  AND log_level NOT IN ('ERROR', 'CRITICAL');
```

### Soft Delete Implementation
```sql
-- Add soft delete columns to critical tables
ALTER TABLE medical_records 
ADD COLUMN deleted_at TIMESTAMP NULL,
ADD COLUMN deleted_by VARCHAR(36) NULL,
ADD COLUMN deletion_reason TEXT NULL;

-- Soft delete trigger
DELIMITER $$

CREATE TRIGGER medical_records_soft_delete
BEFORE DELETE ON medical_records
FOR EACH ROW
BEGIN
  -- Prevent hard delete of medical records
  SIGNAL SQLSTATE '45000' 
  SET MESSAGE_TEXT = 'Medical records cannot be hard deleted. Use soft delete.';
END$$

DELIMITER ;

-- Soft delete procedure
DELIMITER $$

CREATE PROCEDURE soft_delete_medical_record(
  IN record_id VARCHAR(36),
  IN deleted_by_user VARCHAR(36),
  IN reason TEXT
)
BEGIN
  UPDATE medical_records 
  SET deleted_at = NOW(),
      deleted_by = deleted_by_user,
      deletion_reason = reason
  WHERE id = record_id;
END$$

DELIMITER ;
```

## Compliance Monitoring

### Retention Compliance View
```sql
CREATE VIEW retention_compliance AS
SELECT 
  'medical_records' as table_name,
  COUNT(*) as total_records,
  SUM(CASE WHEN visit_date < DATE_SUB(CURDATE(), INTERVAL 7 YEAR) THEN 1 ELSE 0 END) as overdue_records,
  MIN(visit_date) as oldest_record,
  MAX(visit_date) as newest_record
FROM medical_records
WHERE deleted_at IS NULL

UNION ALL

SELECT 
  'audit_logs' as table_name,
  COUNT(*) as total_records,
  SUM(CASE WHEN created_at < DATE_SUB(CURDATE(), INTERVAL 7 YEAR) THEN 1 ELSE 0 END) as overdue_records,
  MIN(created_at) as oldest_record,
  MAX(created_at) as newest_record
FROM audit_logs;
```

### Cleanup Statistics Table
```sql
CREATE TABLE cleanup_stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  run_date DATE,
  table_name VARCHAR(100),
  records_cleaned INT,
  records_archived INT,
  execution_time_ms INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Recovery Procedures

### Archive Recovery
```sql
-- Restore from archive if needed
DELIMITER $$

CREATE PROCEDURE restore_from_archive(
  IN record_id VARCHAR(36),
  IN restore_reason TEXT
)
BEGIN
  -- Restore medical record
  INSERT INTO medical_records
  SELECT 
    id, clinic_id, pet_id, veterinarian_id, visit_date,
    chief_complaint, subjective, objective, assessment, plan,
    vitals, temperature, heart_rate, respiratory_rate, weight,
    body_condition_score, visit_type, follow_up_date, is_locked,
    created_at, updated_at
  FROM medical_records_archive 
  WHERE id = record_id;
  
  -- Restore related diagnoses
  INSERT INTO diagnoses
  SELECT 
    id, clinic_id, medical_record_id, diagnosis_code,
    description, is_primary, status, created_at, updated_at
  FROM diagnoses_archive 
  WHERE medical_record_id = record_id;
  
  -- Log restoration
  INSERT INTO audit_logs (
    clinic_id, user_id, entity_type, entity_id, action, new_values
  ) VALUES (
    (SELECT clinic_id FROM medical_records WHERE id = record_id),
    USER(),
    'medical_record',
    record_id,
    'restore',
    JSON_OBJECT('reason', restore_reason)
  );
END$$

DELIMITER ;
```

## Legal and Compliance Notes

1. **HIPAA Requirements**: 7-year minimum retention for medical records
2. **State Regulations**: May require longer retention (check local laws)
3. **Audit Requirements**: All data access must be logged and retained
4. **Right to be Forgotten**: Implement procedure for valid data deletion requests
5. **Data Breach Response**: Maintain ability to identify affected records quickly

## Implementation Checklist

- [ ] Create archive tables for all critical data
- [ ] Implement soft delete for medical records
- [ ] Set up automated cleanup jobs
- [ ] Create compliance monitoring views
- [ ] Test archive and restore procedures
- [ ] Document legal retention requirements by jurisdiction
- [ ] Implement data export for patient requests
- [ ] Set up alerts for retention policy violations