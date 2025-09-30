/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('clinics', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('organization_id').notNullable();
    table.string('name', 255).notNullable();
    table.text('description').nullable();
    table.string('address', 500).nullable();
    table.string('phone', 20).nullable();
    table.string('email', 255).nullable();
    table.string('website', 255).nullable();
    table.enum('status', ['active', 'inactive', 'suspended']).defaultTo('active');
    table.json('settings').nullable();
    table.json('working_hours').nullable();
    table.string('timezone', 50).defaultTo('UTC');
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
    
    // Indexes
    table.index('organization_id');
    table.index('name');
    table.index('status');
    table.index('created_at');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('clinics');
};
