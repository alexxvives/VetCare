import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const config = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: join(projectRoot, 'database', 'vetcare_dev.db')
    },
    useNullAsDefault: true,
    migrations: {
      directory: join(projectRoot, 'database', 'migrations'),
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: join(projectRoot, 'database', 'seeds')
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
      filename: join(projectRoot, 'database', 'vetcare_test.db')
    },
    useNullAsDefault: true,
    migrations: {
      directory: join(projectRoot, 'database', 'migrations'),
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: join(projectRoot, 'database', 'seeds')
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
      filename: process.env.DATABASE_URL || join(projectRoot, 'database', 'vetcare_prod.db')
    },
    useNullAsDefault: true,
    migrations: {
      directory: join(projectRoot, 'database', 'migrations'),
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: join(projectRoot, 'database', 'seeds')
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