/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('appointments', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('clinic_id').notNullable();
    table.uuid('pet_id').notNullable();
    table.uuid('client_id').notNullable();
    table.uuid('veterinarian_id').notNullable();
    table.datetime('scheduled_start').notNullable();
    table.datetime('scheduled_end').notNullable();
    table.datetime('actual_start').nullable();
    table.datetime('actual_end').nullable();
    table.string('appointment_type', 100).notNullable(); // checkup, surgery, consultation, etc.
    table.enum('status', ['scheduled', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show']).defaultTo('scheduled');
    table.text('reason').nullable();
    table.text('notes').nullable();
    table.enum('priority', ['low', 'normal', 'high', 'emergency']).defaultTo('normal');
    table.decimal('estimated_duration', 4, 2).nullable(); // hours
    table.decimal('estimated_cost', 10, 2).nullable();
    table.string('cancellation_reason', 255).nullable();
    table.datetime('cancelled_at').nullable();
    table.uuid('cancelled_by').nullable();
    table.boolean('reminder_sent').defaultTo(false);
    table.datetime('reminder_sent_at').nullable();
    table.json('recurring_config').nullable(); // For recurring appointments
    table.uuid('parent_appointment_id').nullable(); // For recurring series
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('clinic_id').references('id').inTable('clinics').onDelete('CASCADE');
    table.foreign('pet_id').references('id').inTable('pets').onDelete('CASCADE');
    table.foreign('client_id').references('id').inTable('clients').onDelete('CASCADE');
    table.foreign('veterinarian_id').references('id').inTable('users').onDelete('RESTRICT');
    table.foreign('cancelled_by').references('id').inTable('users').onDelete('SET NULL');
    table.foreign('parent_appointment_id').references('id').inTable('appointments').onDelete('CASCADE');
    
    // Indexes
    table.index('clinic_id');
    table.index('pet_id');
    table.index('client_id');
    table.index('veterinarian_id');
    table.index('scheduled_start');
    table.index('scheduled_end');
    table.index('status');
    table.index('appointment_type');
    table.index('priority');
    table.index('created_at');
    
    // Composite indexes for scheduling queries
    table.index(['clinic_id', 'scheduled_start']);
    table.index(['veterinarian_id', 'scheduled_start']);
    table.index(['clinic_id', 'status']);
    table.index(['scheduled_start', 'scheduled_end']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('appointments');
};
