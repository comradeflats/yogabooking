import { NextResponse } from "next/server";
import { getAvailableTimeSlots } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const timeSlots = await getAvailableTimeSlots();
    return NextResponse.json(timeSlots);
  } catch (error) {
    console.error("Error fetching time slots:", error);
    return NextResponse.json(
      { error: "Failed to fetch available time slots" },
      { status: 500 }
    );
  }
}
