import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: join(__dirname, 'database', 'vetcare_dev.db')
    },
    useNullAsDefault: true,
    // No migrations directory - using direct SQL files
    // migrations: {
    //   directory: join(__dirname, 'database', 'migrations')
    // },
    // seeds: {
    //   directory: join(__dirname, 'database', 'seeds')
    // },
    pool: {
      afterCreate: (conn, cb) => {
        // Disable WAL mode, use default DELETE mode (single file)
        conn.run('PRAGMA journal_mode = DELETE', () => {
          conn.run('PRAGMA foreign_keys = ON', cb);
        });
      }
    },
    migrations: {
      directory: join(__dirname, 'database', 'migrations'),
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: join(__dirname, 'database', 'seeds')
    },
    pool: {
      afterCreate: (conn, cb) => {
        // Enable foreign key constraints in SQLite
        conn.run('PRAGMA foreign_keys = ON', cb);
      }
    }
  },

  test: {
    client: 'sqlite3',
    connection: {
      filename: join(__dirname, 'database', 'vetcare_test.db')
    },
    useNullAsDefault: true,
    migrations: {
      directory: join(__dirname, 'database', 'migrations'),
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: join(__dirname, 'database', 'seeds')
    },
    pool: {
      afterCreate: (conn, cb) => {
        conn.run('PRAGMA foreign_keys = ON', cb);
      }
    }
  },

  production: {
    client: 'sqlite3',
    connection: {
      filename: process.env.DATABASE_URL || join(__dirname, 'database', 'vetcare_prod.db')
    },
    useNullAsDefault: true,
    migrations: {
      directory: join(__dirname, 'database', 'migrations'),
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: join(__dirname, 'database', 'seeds')
    },
    pool: {
      min: 2,
      max: 10,
      afterCreate: (conn, cb) => {
        conn.run('PRAGMA foreign_keys = ON', cb);
      }
    }
  }
};

export default config;