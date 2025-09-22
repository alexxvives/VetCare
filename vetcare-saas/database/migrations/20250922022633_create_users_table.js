/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('organization_id').notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.string('first_name', 100).notNullable();
    table.string('last_name', 100).notNullable();
    table.string('phone', 20).nullable();
    table.enum('role', ['super_admin', 'organization_admin', 'clinic_admin', 'veterinarian', 'technician', 'receptionist']).notNullable();
    table.enum('status', ['active', 'inactive', 'suspended']).defaultTo('active');
    table.json('permissions').nullable();
    table.json('clinic_access').nullable(); // Array of clinic IDs user has access to
    table.string('mfa_secret', 255).nullable();
    table.boolean('mfa_enabled').defaultTo(false);
    table.json('mfa_backup_codes').nullable();
    table.timestamp('last_login_at').nullable();
    table.string('last_login_ip', 45).nullable();
    table.timestamp('password_changed_at').nullable();
    table.boolean('force_password_change').defaultTo(false);
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
    
    // Indexes
    table.index('organization_id');
    table.index('email');
    table.index('role');
    table.index('status');
    table.index('last_login_at');
    table.index('created_at');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
