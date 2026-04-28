import { NextRequest, NextResponse } from "next/server";
import { updateClassType } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const classTypeId = parseInt(id, 10);

    if (isNaN(classTypeId)) {
      return NextResponse.json(
        { error: "Invalid class type ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const classType = await updateClassType(classTypeId, body);

    if (!classType) {
      return NextResponse.json(
        { error: "Class type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(classType);
  } catch (error) {
    console.error("Error updating class type:", error);
    return NextResponse.json(
      { error: "Failed to update class type" },
      { status: 500 }
    );
  }
}
