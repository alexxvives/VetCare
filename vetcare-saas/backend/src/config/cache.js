/**
 * Simple In-Memory Cache for VetCare SaaS
 * Replaces Redis for MVP development
 * Note: For production, consider upgrading to Redis or similar
 */

class SimpleCache {
  constructor() {
    this.cache = new Map();
    this.expirations = new Map();
    
    // Clean up expired keys every 5 minutes
    setInterval(() => {
      this.cleanupExpired();
    }, 5 * 60 * 1000);
  }

  /**
   * Set a value with optional expiration (in seconds)
   */
  async set(key, value, expirationSeconds = null) {
    try {
      this.cache.set(key, value);
      
      if (expirationSeconds) {
        const expirationTime = Date.now() + (expirationSeconds * 1000);
        this.expirations.set(key, expirationTime);
      } else {
        this.expirations.delete(key);
      }
      
      return 'OK';
    } catch (error) {
      console.error('Cache set error:', error);
      throw error;
    }
  }

  /**
   * Get a value from cache
   */
  async get(key) {
    try {
      // Check if key has expired
      if (this.expirations.has(key)) {
        const expirationTime = this.expirations.get(key);
        if (Date.now() > expirationTime) {
          this.cache.delete(key);
          this.expirations.delete(key);
          return null;
        }
      }

      return this.cache.get(key) || null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Delete a key from cache
   */
  async del(key) {
    try {
      const existed = this.cache.has(key);
      this.cache.delete(key);
      this.expirations.delete(key);
      return existed ? 1 : 0;
    } catch (error) {
      console.error('Cache delete error:', error);
      return 0;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key) {
    try {
      return this.cache.has(key) ? 1 : 0;
    } catch (error) {
      console.error('Cache exists error:', error);
      return 0;
    }
  }

  /**
   * Set expiration for existing key
   */
  async expire(key, seconds) {
    try {
      if (this.cache.has(key)) {
        const expirationTime = Date.now() + (seconds * 1000);
        this.expirations.set(key, expirationTime);
        return 1;
      }
      return 0;
    } catch (error) {
      console.error('Cache expire error:', error);
      return 0;
    }
  }

  /**
   * Clear all cache
   */
  async flushall() {
    try {
      this.cache.clear();
      this.expirations.clear();
      return 'OK';
    } catch (error) {
      console.error('Cache flush error:', error);
      throw error;
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      keys: this.cache.size,
      expired_keys: Array.from(this.expirations.entries()).filter(([key, exp]) => Date.now() > exp).length,
      memory_usage: `${JSON.stringify(Array.from(this.cache.entries())).length} bytes (approximate)`
    };
  }

  /**
   * Clean up expired keys
   */
  cleanupExpired() {
    const now = Date.now();
    for (const [key, expirationTime] of this.expirations.entries()) {
      if (now > expirationTime) {
        this.cache.delete(key);
        this.expirations.delete(key);
      }
    }
  }

  /**
   * Simulate Redis ping
   */
  async ping() {
    return 'PONG';
  }
}

// Create singleton instance
const cache = new SimpleCache();

// Test cache connection
const testConnection = async () => {
  try {
    await cache.set('test_key', 'test_value', 1);
    const value = await cache.get('test_key');
    
    if (value === 'test_value') {
      console.log('✅ In-memory cache initialized successfully');
      await cache.del('test_key');
      return true;
    } else {
      throw new Error('Cache test failed');
    }
  } catch (error) {
    console.error('❌ Cache initialization failed:', error.message);
    return false;
  }
};

// Cache key helpers for consistent naming
const getCacheKey = {
  user: (id) => `user:${id}`,
  session: (id) => `session:${id}`,
  appointment: (id) => `appointment:${id}`,
  clinic: (id) => `clinic:${id}`,
  rate_limit: (identifier) => `rate_limit:${identifier}`,
  auth_attempts: (identifier) => `auth_attempts:${identifier}`
};

// Cache expiration times (in seconds)
const CACHE_TTL = {
  user: 15 * 60,        // 15 minutes
  session: 30 * 60,     // 30 minutes
  appointment: 5 * 60,  // 5 minutes
  clinic: 60 * 60,      // 1 hour
  rate_limit: 60,       // 1 minute
  auth_attempts: 15 * 60 // 15 minutes
};

// For compatibility with existing Redis code
const redis = cache;
const testRedisConnection = testConnection;

export {
  cache,
  redis,
  testConnection,
  testRedisConnection,
  getCacheKey,
  CACHE_TTL
};