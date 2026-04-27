import { getDb } from "./client";
import { CreateBookingData, TimeSlot, Booking, ClassType } from "@/types/booking";
import { addDays, format } from "date-fns";

/**
 * Get available time slots for the next 30 days
 */
export async function getAvailableTimeSlots(): Promise<TimeSlot[]> {
  const sql = getDb();
  const today = format(new Date(), "yyyy-MM-dd");
  const endDate = format(addDays(new Date(), 30), "yyyy-MM-dd");

  const result = await sql`
    SELECT
      ts.*,
      json_build_object(
        'id', ct.id,
        'name', ct.name,
        'description', ct.description,
        'color', ct.color,
        'duration_minutes', ct.duration_minutes,
        'is_active', ct.is_active,
        'created_at', ct.created_at,
        'updated_at', ct.updated_at
      ) as class_type
    FROM time_slots ts
    LEFT JOIN class_types ct ON ts.class_type_id = ct.id
    WHERE ts.date >= ${today}
      AND ts.date <= ${endDate}
      AND ts.is_available = true
      AND ts.current_bookings < ts.max_bookings
    ORDER BY ts.date ASC, ts.start_time ASC
  `;

  return result as TimeSlot[];
}

/**
 * Get a specific time slot by ID
 */
export async function getTimeSlotById(id: number): Promise<TimeSlot | null> {
  const sql = getDb();
  const result = await sql`
    SELECT
      ts.*,
      json_build_object(
        'id', ct.id,
        'name', ct.name,
        'description', ct.description,
        'color', ct.color,
        'duration_minutes', ct.duration_minutes,
        'is_active', ct.is_active,
        'created_at', ct.created_at,
        'updated_at', ct.updated_at
      ) as class_type
    FROM time_slots ts
    LEFT JOIN class_types ct ON ts.class_type_id = ct.id
    WHERE ts.id = ${id}
  `;

  return result.length > 0 ? (result[0] as TimeSlot) : null;
}

/**
 * Create a new booking
 */
export async function createBooking(data: CreateBookingData): Promise<Booking> {
  const sql = getDb();

  const result = await sql`
    INSERT INTO bookings (
      booking_type,
      time_slot_id,
      requested_date,
      requested_time,
      name,
      email,
      phone,
      instagram_handle,
      telegram_handle,
      notes
    ) VALUES (
      ${data.booking_type},
      ${data.time_slot_id ?? null},
      ${data.requested_date ?? null},
      ${data.requested_time ?? null},
      ${data.name},
      ${data.email},
      ${data.phone ?? null},
      ${data.instagram_handle ?? null},
      ${data.telegram_handle ?? null},
      ${data.notes ?? null}
    )
    RETURNING *
  `;

  return result[0] as Booking;
}

/**
 * Increment the booking count for a time slot
 */
export async function incrementTimeSlotBookings(timeSlotId: number): Promise<void> {
  const sql = getDb();

  await sql`
    UPDATE time_slots
    SET current_bookings = current_bookings + 1
    WHERE id = ${timeSlotId}
  `;
}

/**
 * Mark telegram notification as sent for a booking
 */
export async function markTelegramNotificationSent(bookingId: number): Promise<void> {
  const sql = getDb();

  await sql`
    UPDATE bookings
    SET telegram_notification_sent = true
    WHERE id = ${bookingId}
  `;
}

/**
 * Get a booking by ID
 */
export async function getBookingById(id: number): Promise<Booking | null> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM bookings WHERE id = ${id}
  `;

  return result.length > 0 ? (result[0] as Booking) : null;
}

/**
 * Get all active class types
 */
export async function getAllClassTypes(): Promise<ClassType[]> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM class_types
    WHERE is_active = true
    ORDER BY name ASC
  `;

  return result as ClassType[];
}

/**
 * Get a specific class type by ID
 */
export async function getClassTypeById(id: number): Promise<ClassType | null> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM class_types WHERE id = ${id}
  `;

  return result.length > 0 ? (result[0] as ClassType) : null;
}

// ============================================
// ADMIN QUERIES
// ============================================

/**
 * Get all bookings with optional status filter
 */
export async function getAllBookings(status?: string) {
  const sql = getDb();

  if (status) {
    const result = await sql`
      SELECT
        b.*,
        json_build_object(
          'id', ts.id,
          'date', ts.date,
          'start_time', ts.start_time,
          'duration_minutes', ts.duration_minutes,
          'class_type', json_build_object(
            'id', ct.id,
            'name', ct.name,
            'color', ct.color
          )
        ) as time_slot
      FROM bookings b
      LEFT JOIN time_slots ts ON b.time_slot_id = ts.id
      LEFT JOIN class_types ct ON ts.class_type_id = ct.id
      WHERE b.status = ${status}
      ORDER BY b.created_at DESC
    `;
    return result;
  }

  const result = await sql`
    SELECT
      b.*,
      json_build_object(
        'id', ts.id,
        'date', ts.date,
        'start_time', ts.start_time,
        'duration_minutes', ts.duration_minutes,
        'class_type', json_build_object(
          'id', ct.id,
          'name', ct.name,
          'color', ct.color
        )
      ) as time_slot
    FROM bookings b
    LEFT JOIN time_slots ts ON b.time_slot_id = ts.id
    LEFT JOIN class_types ct ON ts.class_type_id = ct.id
    ORDER BY b.created_at DESC
  `;

  return result;
}

/**
 * Update booking status
 */
export async function updateBookingStatus(id: number, status: string) {
  const sql = getDb();
  const result = await sql`
    UPDATE bookings
    SET status = ${status}
    WHERE id = ${id}
    RETURNING *
  `;

  return result.length > 0 ? result[0] : null;
}

/**
 * Get all time slots (including past ones for admin)
 */
export async function getAllTimeSlots() {
  const sql = getDb();
  const result = await sql`
    SELECT
      ts.*,
      json_build_object(
        'id', ct.id,
        'name', ct.name,
        'color', ct.color,
        'duration_minutes', ct.duration_minutes
      ) as class_type
    FROM time_slots ts
    LEFT JOIN class_types ct ON ts.class_type_id = ct.id
    ORDER BY ts.date DESC, ts.start_time DESC
  `;

  return result;
}

/**
 * Create a new time slot
 */
export async function createTimeSlot(data: {
  date: string;
  start_time: string;
  duration_minutes: number;
  max_bookings: number;
  class_type_id?: number;
  instructor_name?: string;
}) {
  const sql = getDb();
  const result = await sql`
    INSERT INTO time_slots (
      date,
      start_time,
      duration_minutes,
      max_bookings,
      class_type_id,
      instructor_name
    ) VALUES (
      ${data.date},
      ${data.start_time},
      ${data.duration_minutes},
      ${data.max_bookings},
      ${data.class_type_id ?? null},
      ${data.instructor_name ?? null}
    )
    RETURNING *
  `;

  return result[0];
}

/**
 * Update a time slot
 */
export async function updateTimeSlot(id: number, data: {
  date?: string;
  start_time?: string;
  duration_minutes?: number;
  max_bookings?: number;
  is_available?: boolean;
  class_type_id?: number;
  instructor_name?: string;
}) {
  const sql = getDb();

  if (Object.keys(data).length === 0) {
    return null;
  }

  // Fetch current record
  const current = await sql`SELECT * FROM time_slots WHERE id = ${id}`;
  if (current.length === 0) return null;

  // Merge with updates
  const updated = { ...current[0], ...data };

  const result = await sql`
    UPDATE time_slots
    SET
      date = ${updated.date},
      start_time = ${updated.start_time},
      duration_minutes = ${updated.duration_minutes},
      max_bookings = ${updated.max_bookings},
      is_available = ${updated.is_available},
      class_type_id = ${updated.class_type_id},
      instructor_name = ${updated.instructor_name}
    WHERE id = ${id}
    RETURNING *
  `;

  return result.length > 0 ? result[0] : null;
}

/**
 * Delete a time slot
 */
export async function deleteTimeSlot(id: number) {
  const sql = getDb();
  await sql`
    DELETE FROM time_slots WHERE id = ${id}
  `;
}

/**
 * Get all class types (including inactive for admin)
 */
export async function getAllClassTypesAdmin(): Promise<ClassType[]> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM class_types
    ORDER BY name ASC
  `;

  return result as ClassType[];
}

/**
 * Create a new class type
 */
export async function createClassType(data: {
  name: string;
  description?: string;
  color: string;
  duration_minutes: number;
}) {
  const sql = getDb();
  const result = await sql`
    INSERT INTO class_types (name, description, color, duration_minutes)
    VALUES (${data.name}, ${data.description ?? null}, ${data.color}, ${data.duration_minutes})
    RETURNING *
  `;

  return result[0];
}

/**
 * Update a class type
 */
export async function updateClassType(id: number, data: {
  name?: string;
  description?: string;
  color?: string;
  duration_minutes?: number;
  is_active?: boolean;
}) {
  const sql = getDb();

  if (Object.keys(data).length === 0) {
    return null;
  }

  // Fetch current record
  const current = await sql`SELECT * FROM class_types WHERE id = ${id}`;
  if (current.length === 0) return null;

  // Merge with updates
  const updated = { ...current[0], ...data };

  const result = await sql`
    UPDATE class_types
    SET
      name = ${updated.name},
      description = ${updated.description},
      color = ${updated.color},
      duration_minutes = ${updated.duration_minutes},
      is_active = ${updated.is_active}
    WHERE id = ${id}
    RETURNING *
  `;

  return result.length > 0 ? result[0] : null;
}
