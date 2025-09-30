/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('audit_logs', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('clinic_id').notNullable();
    table.uuid('user_id').nullable(); // Null for system actions
    table.string('action', 100).notNullable(); // CREATE, READ, UPDATE, DELETE, LOGIN, etc.
    table.string('resource_type', 100).notNullable(); // medical_record, appointment, etc.
    table.uuid('resource_id').nullable(); // ID of the affected resource
    table.json('old_values').nullable(); // Previous values for UPDATE actions
    table.json('new_values').nullable(); // New values for CREATE/UPDATE actions
    table.string('ip_address', 45).nullable(); // IPv4 or IPv6
    table.string('user_agent', 500).nullable();
    table.string('session_id', 255).nullable();
    table.text('details').nullable(); // Additional context
    table.enum('severity', ['low', 'medium', 'high', 'critical']).defaultTo('medium');
    table.boolean('phi_accessed').defaultTo(false); // Was PHI involved?
    table.timestamp('timestamp').notNullable().defaultTo(knex.fn.now());
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('clinic_id').references('id').inTable('clinics').onDelete('CASCADE');
    table.foreign('user_id').references('id').inTable('users').onDelete('SET NULL');
    
    // Indexes for HIPAA compliance and performance
    table.index('clinic_id');
    table.index('user_id');
    table.index('action');
    table.index('resource_type');
    table.index('resource_id');
    table.index('timestamp');
    table.index('severity');
    table.index('phi_accessed');
    table.index('created_at');
    
    // Composite indexes for audit queries
    table.index(['clinic_id', 'timestamp']);
    table.index(['user_id', 'timestamp']);
    table.index(['resource_type', 'resource_id']);
    table.index(['clinic_id', 'phi_accessed']);
    table.index(['clinic_id', 'action', 'timestamp']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('audit_logs');
};
