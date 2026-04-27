import { NextRequest, NextResponse } from "next/server";
import { createBooking, incrementTimeSlotBookings, getTimeSlotById } from "@/lib/db/queries";
import { bookingFormSchema } from "@/lib/validations/booking";
import { sendTelegramNotification } from "@/lib/notifications/telegram";
import { sendBookingConfirmation } from "@/lib/notifications/email";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = bookingFormSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid booking data", details: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    // For fixed bookings, check if the time slot is still available
    if (data.booking_type === "fixed" && data.time_slot_id) {
      const timeSlot = await getTimeSlotById(data.time_slot_id);

      if (!timeSlot) {
        return NextResponse.json(
          { error: "Time slot not found" },
          { status: 404 }
        );
      }

      if (!timeSlot.is_available) {
        return NextResponse.json(
          { error: "This time slot is no longer available" },
          { status: 409 }
        );
      }

      if (timeSlot.current_bookings >= timeSlot.max_bookings) {
        return NextResponse.json(
          { error: "This time slot is fully booked" },
          { status: 409 }
        );
      }
    }

    // Create the booking
    const booking = await createBooking(data);

    // Get time slot for notifications
    let timeSlot = null;
    if (data.booking_type === "fixed" && data.time_slot_id) {
      timeSlot = await getTimeSlotById(data.time_slot_id);
      await incrementTimeSlotBookings(data.time_slot_id);
    }

    // Trigger notifications asynchronously (don't wait for them)
    sendTelegramNotification(booking, timeSlot).catch((error) => {
      console.error("Telegram notification failed:", error);
    });

    sendBookingConfirmation(booking, timeSlot).catch((error) => {
      console.error("Email confirmation failed:", error);
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
