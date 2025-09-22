/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('vaccinations', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('clinic_id').notNullable();
    table.uuid('pet_id').notNullable();
    table.uuid('medical_record_id').nullable(); // Link to visit if given during appointment
    table.uuid('administered_by').notNullable(); // User ID
    table.string('vaccine_name', 255).notNullable();
    table.string('vaccine_type', 100).notNullable(); // DHPP, Rabies, FVRCP, etc.
    table.string('manufacturer', 255).nullable();
    table.string('lot_number', 100).nullable();
    table.string('serial_number', 100).nullable();
    table.date('administered_date').notNullable();
    table.date('expiration_date').nullable();
    table.date('next_due_date').nullable();
    table.string('site_of_injection', 100).nullable(); // Left rear leg, etc.
    table.text('notes').nullable();
    table.json('adverse_reactions').nullable();
    table.boolean('certificate_generated').defaultTo(false);
    table.string('certificate_url', 500).nullable();
    table.enum('status', ['given', 'overdue', 'scheduled']).defaultTo('given');
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('clinic_id').references('id').inTable('clinics').onDelete('CASCADE');
    table.foreign('pet_id').references('id').inTable('pets').onDelete('CASCADE');
    table.foreign('medical_record_id').references('id').inTable('medical_records').onDelete('SET NULL');
    table.foreign('administered_by').references('id').inTable('users').onDelete('RESTRICT');
    
    // Indexes
    table.index('clinic_id');
    table.index('pet_id');
    table.index('medical_record_id');
    table.index('administered_by');
    table.index('vaccine_type');
    table.index('administered_date');
    table.index('next_due_date');
    table.index('status');
    table.index('created_at');
    
    // Composite indexes for vaccination tracking
    table.index(['clinic_id', 'next_due_date']);
    table.index(['pet_id', 'vaccine_type']);
    table.index(['clinic_id', 'status']);
    table.index(['pet_id', 'administered_date']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('vaccinations');
};
