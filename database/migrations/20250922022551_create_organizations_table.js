/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('organizations', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('name', 255).notNullable();
    table.text('description').nullable();
    table.string('address', 500).nullable();
    table.string('phone', 20).nullable();
    table.string('email', 255).nullable();
    table.string('website', 255).nullable();
    table.enum('status', ['active', 'inactive', 'suspended']).defaultTo('active');
    table.json('settings').nullable();
    table.timestamps(true, true);
    
    // Indexes
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
  return knex.schema.dropTableIfExists('organizations');
};
