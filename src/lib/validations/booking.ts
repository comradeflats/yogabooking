import { z } from "zod";

// Base contact information schema (shared by both booking types)
const contactInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  instagram_handle: z.string().optional(),
  telegram_handle: z.string().optional(),
  notes: z.string().optional(),
});

// Fixed booking schema (requires time_slot_id)
const fixedBookingSchema = contactInfoSchema.extend({
  booking_type: z.literal("fixed"),
  time_slot_id: z.number().int().positive("Please select a time slot"),
});

// Custom booking schema (requires requested_date and requested_time)
const customBookingSchema = contactInfoSchema.extend({
  booking_type: z.literal("custom"),
  requested_date: z.string().min(1, "Please select a date"),
  requested_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
});

// Discriminated union for booking types
export const bookingFormSchema = z.discriminatedUnion("booking_type", [
  fixedBookingSchema,
  customBookingSchema,
]);

export type BookingFormData = z.infer<typeof bookingFormSchema>;
