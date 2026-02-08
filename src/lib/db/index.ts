import { neon, NeonQueryFunction } from '@neondatabase/serverless';

// Lazy-loaded SQL function - only creates connection when first used
let _sql: NeonQueryFunction<false, false> | null = null;

export function getSql(): NeonQueryFunction<false, false> {
  if (!_sql) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    _sql = neon(connectionString);
  }
  return _sql;
}

// Export sql as a getter that creates connection on first use
// This function is called by query modules
export const sql = getSql;

// Database configuration
export const DB_CONFIG = {
  connectionString: process.env.DATABASE_URL,
};

// Helper function to handle database errors
export function handleDbError(error: unknown): never {
  console.error('Database error:', error);
  throw new Error('Database operation failed');
}

// Helper to check if database is connected
export async function checkConnection(): Promise<boolean> {
  try {
    const sqlFn = getSql();
    await sqlFn`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}
