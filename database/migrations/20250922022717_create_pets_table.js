/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('pets', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('clinic_id').notNullable();
    table.uuid('client_id').notNullable();
    table.string('name', 100).notNullable();
    table.string('species', 50).notNullable(); // Dog, Cat, Bird, etc.
    table.string('breed', 100).nullable();
    table.enum('gender', ['male', 'female', 'unknown']).notNullable();
    table.boolean('spayed_neutered').defaultTo(false);
    table.date('date_of_birth').nullable();
    table.decimal('weight', 5, 2).nullable(); // in pounds
    table.string('color', 100).nullable();
    table.string('microchip_number', 50).nullable();
    table.enum('status', ['active', 'deceased', 'transferred']).defaultTo('active');
    table.date('deceased_date').nullable();
    table.text('notes').nullable();
    table.json('allergies').nullable();
    table.json('medical_conditions').nullable();
    table.string('photo_url', 500).nullable();
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('clinic_id').references('id').inTable('clinics').onDelete('CASCADE');
    table.foreign('client_id').references('id').inTable('clients').onDelete('CASCADE');
    
    // Indexes
    table.index('clinic_id');
    table.index('client_id');
    table.index('name');
    table.index('species');
    table.index('microchip_number');
    table.index('status');
    table.index('created_at');
    
    // Composite indexes for multi-tenant queries
    table.index(['clinic_id', 'status']);
    table.index(['clinic_id', 'species']);
    table.index(['client_id', 'status']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('pets');
};
