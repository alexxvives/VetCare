/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('clients', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('clinic_id').notNullable();
    table.string('first_name', 100).notNullable();
    table.string('last_name', 100).notNullable();
    table.string('email', 255).nullable();
    table.string('phone', 20).nullable();
    table.string('address', 500).nullable();
    table.string('city', 100).nullable();
    table.string('state', 50).nullable();
    table.string('zip_code', 20).nullable();
    table.string('country', 50).defaultTo('US');
    table.date('date_of_birth').nullable();
    table.enum('status', ['active', 'inactive']).defaultTo('active');
    table.text('notes').nullable();
    table.json('emergency_contact').nullable();
    table.json('communication_preferences').nullable();
    table.boolean('marketing_consent').defaultTo(false);
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('clinic_id').references('id').inTable('clinics').onDelete('CASCADE');
    
    // Indexes
    table.index('clinic_id');
    table.index(['first_name', 'last_name']);
    table.index('email');
    table.index('phone');
    table.index('status');
    table.index('created_at');
    
    // Composite index for multi-tenant queries
    table.index(['clinic_id', 'status']);
    table.index(['clinic_id', 'last_name']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('clients');
};
