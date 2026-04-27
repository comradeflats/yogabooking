import { NextRequest, NextResponse } from "next/server";
import { getBookingById, getTimeSlotById } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookingId = parseInt(id, 10);

    if (isNaN(bookingId)) {
      return NextResponse.json(
        { error: "Invalid booking ID" },
        { status: 400 }
      );
    }

    const booking = await getBookingById(bookingId);

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // If this is a fixed booking, include time slot details
    let timeSlot = null;
    if (booking.time_slot_id) {
      timeSlot = await getTimeSlotById(booking.time_slot_id);
    }

    return NextResponse.json({
      ...booking,
      time_slot: timeSlot,
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}
