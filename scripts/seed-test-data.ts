import { Pool } from "@neondatabase/serverless";
import { config } from "dotenv";
import { addDays, format } from "date-fns";

config({ path: ".env.local" });

async function seedTestData() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    console.log("🌱 Seeding test data...");

    // Get class types
    const classTypes = await pool.query(`
      SELECT id, name FROM class_types ORDER BY id
    `);

    console.log(`Found ${classTypes.rows.length} class types`);

    // Create time slots for the next 7 days
    const today = new Date();

    for (let i = 1; i <= 7; i++) {
      const date = format(addDays(today, i), "yyyy-MM-dd");

      // Morning slot - Vinyasa Flow
      await pool.query(`
        INSERT INTO time_slots (date, start_time, duration_minutes, max_bookings, class_type_id, instructor_name)
        VALUES ($1, '09:00', 60, 5, $2, 'Sarah Chen')
        ON CONFLICT (date, start_time) DO NOTHING
      `, [date, classTypes.rows[0].id]);

      // Afternoon slot - Yin Yoga
      await pool.query(`
        INSERT INTO time_slots (date, start_time, duration_minutes, max_bookings, class_type_id, instructor_name)
        VALUES ($1, '14:00', 75, 4, $2, 'Maya Rodriguez')
        ON CONFLICT (date, start_time) DO NOTHING
      `, [date, classTypes.rows[1].id]);

      // Evening slot - Power Yoga (every other day)
      if (i % 2 === 0) {
        await pool.query(`
          INSERT INTO time_slots (date, start_time, duration_minutes, max_bookings, class_type_id, instructor_name)
          VALUES ($1, '18:30', 60, 6, $2, 'David Park')
          ON CONFLICT (date, start_time) DO NOTHING
        `, [date, classTypes.rows[2].id]);
      } else {
        // Hatha Yoga on odd days
        await pool.query(`
          INSERT INTO time_slots (date, start_time, duration_minutes, max_bookings, class_type_id, instructor_name)
          VALUES ($1, '18:30', 60, 5, $2, 'Lisa Anderson')
          ON CONFLICT (date, start_time) DO NOTHING
        `, [date, classTypes.rows[3].id]);
      }

      console.log(`✅ Created time slots for ${date}`);
    }

    console.log("✨ Test data seeded successfully!");
  } catch (error) {
    console.error("❌ Failed to seed test data:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedTestData();
