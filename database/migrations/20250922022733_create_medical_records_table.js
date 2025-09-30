/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('medical_records', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('clinic_id').notNullable();
    table.uuid('pet_id').notNullable();
    table.uuid('veterinarian_id').notNullable();
    table.datetime('visit_date').notNullable();
    table.string('visit_type', 100).notNullable(); // checkup, emergency, surgery, etc.
    table.text('chief_complaint').nullable();
    
    // SOAP Notes (encrypted)
    table.text('subjective_encrypted').nullable(); // What owner reports
    table.text('objective_encrypted').nullable(); // What vet observes
    table.text('assessment_encrypted').nullable(); // Diagnosis
    table.text('plan_encrypted').nullable(); // Treatment plan
    
    // Vitals
    table.decimal('temperature', 4, 1).nullable(); // Fahrenheit
    table.integer('heart_rate').nullable(); // BPM
    table.integer('respiratory_rate').nullable(); // BPM
    table.decimal('weight', 5, 2).nullable(); // pounds
    table.string('body_condition_score', 10).nullable(); // 1-9 scale
    
    // Diagnosis codes
    table.json('diagnosis_codes').nullable(); // Array of ICD codes
    table.json('treatments_performed').nullable();
    table.json('medications_prescribed').nullable();
    table.json('follow_up_instructions').nullable();
    
    table.decimal('total_cost', 10, 2).nullable();
    table.enum('status', ['draft', 'completed', 'reviewed']).defaultTo('draft');
    table.text('notes').nullable();
    table.json('attachments').nullable(); // File URLs
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('clinic_id').references('id').inTable('clinics').onDelete('CASCADE');
    table.foreign('pet_id').references('id').inTable('pets').onDelete('CASCADE');
    table.foreign('veterinarian_id').references('id').inTable('users').onDelete('RESTRICT');
    
    // Indexes
    table.index('clinic_id');
    table.index('pet_id');
    table.index('veterinarian_id');
    table.index('visit_date');
    table.index('visit_type');
    table.index('status');
    table.index('created_at');
    
    // Composite indexes for multi-tenant queries
    table.index(['clinic_id', 'visit_date']);
    table.index(['pet_id', 'visit_date']);
    table.index(['clinic_id', 'status']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('medical_records');
};
