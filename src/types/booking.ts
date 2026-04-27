export type BookingType = "fixed" | "custom";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface ClassType {
  id: number;
  name: string;
  description: string | null;
  color: string;
  duration_minutes: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface TimeSlot {
  id: number;
  date: string;
  start_time: string;
  duration_minutes: number;
  is_available: boolean;
  max_bookings: number;
  current_bookings: number;
  class_type_id: number | null;
  class_type?: ClassType | null;
  instructor_name: string | null;
  instructor_photo_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Booking {
  id: number;
  booking_type: BookingType;
  time_slot_id: number | null;
  requested_date: string | null;
  requested_time: string | null;
  name: string;
  email: string;
  phone: string | null;
  instagram_handle: string | null;
  telegram_handle: string | null;
  notes: string | null;
  status: BookingStatus;
  telegram_notification_sent: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateBookingData {
  booking_type: BookingType;
  time_slot_id?: number;
  requested_date?: string;
  requested_time?: string;
  name: string;
  email: string;
  phone?: string;
  instagram_handle?: string;
  telegram_handle?: string;
  notes?: string;
}
