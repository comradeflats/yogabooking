import { NextRequest, NextResponse } from "next/server";
import { deleteTimeSlot } from "@/lib/db/queries";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid time slot ID" },
        { status: 400 }
      );
    }

    await deleteTimeSlot(id);

    return NextResponse.json(
      { message: "Time slot deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting time slot:", error);
    return NextResponse.json(
      { error: "Failed to delete time slot" },
      { status: 500 }
    );
  }
}
