import { Model } from 'objection';
import { v4 as uuidv4 } from 'uuid';

/**
 * BaseModel class for all VetCare models
 * Provides common functionality like UUID generation, timestamps, and soft deletes
 */
class BaseModel extends Model {
  /**
   * Generate UUID before insert
   */
  $beforeInsert() {
    if (!this.id) {
      this.id = uuidv4();
    }
    
    const now = new Date().toISOString();
    this.created_at = now;
    this.updated_at = now;
  }

  /**
   * Update timestamp before update
   */
  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }

  /**
   * Format timestamps and handle JSON fields
   */
  $formatJson(json) {
    json = super.$formatJson(json);
    
    // Convert date strings to proper format
    if (json.created_at) {
      json.created_at = new Date(json.created_at).toISOString();
    }
    
    if (json.updated_at) {
      json.updated_at = new Date(json.updated_at).toISOString();
    }
    
    return json;
  }

  /**
   * Parse JSON fields from database
   */
  $parseJson(json, opt) {
    json = super.$parseJson(json, opt);
    
    // Parse JSON fields that are stored as strings in SQLite
    const jsonFields = this.constructor.jsonAttributes || [];
    jsonFields.forEach(field => {
      if (json[field] && typeof json[field] === 'string') {
        try {
          json[field] = JSON.parse(json[field]);
        } catch (e) {
          // If parsing fails, keep as string
          console.warn(`Failed to parse JSON field ${field}:`, e.message);
        }
      }
    });
    
    return json;
  }

  /**
   * Soft delete functionality
   */
  async softDelete() {
    return await this.$query().patch({
      deleted_at: new Date().toISOString()
    });
  }

  /**
   * Check if record is soft deleted
   */
  get isDeleted() {
    return !!this.deleted_at;
  }

  /**
   * Query modifier to exclude soft deleted records
   */
  static get modifiers() {
    return {
      notDeleted(builder) {
        // Only apply soft delete filter if deleted_at column exists
        // For MVP, we're not using soft deletes
        // builder.whereNull('deleted_at');
      },
      
      onlyDeleted(builder) {
        // Only apply soft delete filter if deleted_at column exists
        // For MVP, we're not using soft deletes
        // builder.whereNotNull('deleted_at');
      }
    };
  }

  /**
   * JSON schema validation (override in child classes)
   */
  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
        deleted_at: { type: ['string', 'null'], format: 'date-time' }
      }
    };
  }

  /**
   * Default ID column
   */
  static get idColumn() {
    return 'id';
  }

  /**
   * Generate a new UUID
   */
  static generateId() {
    return uuidv4();
  }

  /**
   * Find by ID with error handling
   */
  static async findById(id, options = {}) {
    try {
      let query = this.query().findById(id);
      
      // For MVP, we're not using soft deletes
      // if (!options.includeDeleted) {
      //   query = query.modify('notDeleted');
      // }
      
      return await query;
    } catch (error) {
      console.error(`Error finding ${this.name} by ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Create with validation
   */
  static async createWithValidation(data) {
    try {
      const instance = await this.query().insert(data);
      return { success: true, data: instance };
    } catch (error) {
      console.error(`Error creating ${this.name}:`, error);
      return { 
        success: false, 
        error: error.message,
        code: error.code 
      };
    }
  }

  /**
   * Update with validation
   */
  async updateWithValidation(data) {
    try {
      const updated = await this.$query().patch(data);
      return { success: true, data: updated };
    } catch (error) {
      console.error(`Error updating ${this.constructor.name}:`, error);
      return { 
        success: false, 
        error: error.message,
        code: error.code 
      };
    }
  }
}

export default BaseModel;