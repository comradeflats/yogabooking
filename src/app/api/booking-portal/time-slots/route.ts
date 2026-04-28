import { NextRequest, NextResponse } from "next/server";
import { getAllTimeSlots, createTimeSlot } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const timeSlots = await getAllTimeSlots();
    return NextResponse.json(timeSlots);
  } catch (error) {
    console.error("Error fetching time slots:", error);
    return NextResponse.json(
      { error: "Failed to fetch time slots" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const timeSlot = await createTimeSlot(body);

    return NextResponse.json(timeSlot, { status: 201 });
  } catch (error) {
    console.error("Error creating time slot:", error);
    return NextResponse.json(
      { error: "Failed to create time slot" },
      { status: 500 }
    );
  }
}
