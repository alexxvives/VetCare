/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('lab_results', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('clinic_id').notNullable();
    table.uuid('pet_id').notNullable();
    table.uuid('medical_record_id').nullable(); // Link to visit
    table.uuid('ordered_by').notNullable(); // User ID who ordered
    table.string('lab_name', 255).nullable(); // External lab name
    table.string('test_name', 255).notNullable();
    table.string('test_type', 100).notNullable(); // CBC, Chemistry, Urinalysis, etc.
    table.string('test_code', 50).nullable(); // Lab-specific test code
    table.date('ordered_date').notNullable();
    table.date('collected_date').nullable();
    table.date('received_date').nullable();
    table.date('completed_date').nullable();
    table.json('results_data').nullable(); // Store test results as JSON
    table.text('interpretation').nullable();
    table.json('reference_ranges').nullable();
    table.json('abnormal_flags').nullable(); // Which values are abnormal
    table.string('result_file_url', 500).nullable(); // PDF or image of results
    table.enum('status', ['ordered', 'collected', 'in_progress', 'completed', 'cancelled']).defaultTo('ordered');
    table.text('notes').nullable();
    table.boolean('critical_result').defaultTo(false);
    table.datetime('critical_notified_at').nullable();
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('clinic_id').references('id').inTable('clinics').onDelete('CASCADE');
    table.foreign('pet_id').references('id').inTable('pets').onDelete('CASCADE');
    table.foreign('medical_record_id').references('id').inTable('medical_records').onDelete('SET NULL');
    table.foreign('ordered_by').references('id').inTable('users').onDelete('RESTRICT');
    
    // Indexes
    table.index('clinic_id');
    table.index('pet_id');
    table.index('medical_record_id');
    table.index('ordered_by');
    table.index('test_type');
    table.index('ordered_date');
    table.index('completed_date');
    table.index('status');
    table.index('critical_result');
    table.index('created_at');
    
    // Composite indexes for lab tracking
    table.index(['clinic_id', 'status']);
    table.index(['pet_id', 'test_type']);
    table.index(['clinic_id', 'completed_date']);
    table.index(['pet_id', 'completed_date']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('lab_results');
};
