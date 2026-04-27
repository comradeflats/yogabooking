import { Pool } from "@neondatabase/serverless";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { config } from "dotenv";

// Load .env.local file
config({ path: ".env.local" });

async function runMigration() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    // Check for DATABASE_URL
    if (!process.env.DATABASE_URL) {
      console.error("❌ DATABASE_URL environment variable is not set");
      console.error("Run: vercel env pull .env.local --yes");
      process.exit(1);
    }

    console.log("🔄 Connecting to database...");

    // Step 1: Run base schema
    const schemaPath = join(process.cwd(), "src/lib/db/schema.sql");
    const schema = readFileSync(schemaPath, "utf-8");

    console.log("🔄 Running base schema...");
    await pool.query(schema);
    console.log("✅ Base schema applied");

    // Step 2: Run migrations in order
    const migrationsDir = join(process.cwd(), "src/lib/db/migrations");
    let migrationFiles: string[] = [];

    try {
      migrationFiles = readdirSync(migrationsDir)
        .filter((file) => file.endsWith(".sql"))
        .sort(); // Sort to ensure migrations run in order (001, 002, etc.)
    } catch (err) {
      console.log("ℹ️  No migrations directory found, skipping migrations");
    }

    if (migrationFiles.length > 0) {
      console.log(`🔄 Running ${migrationFiles.length} migration(s)...`);

      for (const file of migrationFiles) {
        const migrationPath = join(migrationsDir, file);
        const migration = readFileSync(migrationPath, "utf-8");

        console.log(`  📄 Running ${file}...`);
        await pool.query(migration);
        console.log(`  ✅ ${file} completed`);
      }
    }

    console.log("✅ All migrations completed successfully!");
    console.log("📊 Database schema is up to date");
  } catch (error) {
    console.error("❌ Migration failed:");
    console.error(error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
