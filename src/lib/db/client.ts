import { neon } from "@neondatabase/serverless";

/**
 * Get database connection
 * Creates a new connection each time - fine for serverless environments
 */
export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  return neon(process.env.DATABASE_URL);
}
