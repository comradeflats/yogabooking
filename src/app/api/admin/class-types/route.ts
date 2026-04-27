import { NextRequest, NextResponse } from "next/server";
import { getAllClassTypesAdmin, createClassType } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const classTypes = await getAllClassTypesAdmin();
    return NextResponse.json(classTypes);
  } catch (error) {
    console.error("Error fetching class types:", error);
    return NextResponse.json(
      { error: "Failed to fetch class types" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const classType = await createClassType(body);

    return NextResponse.json(classType, { status: 201 });
  } catch (error) {
    console.error("Error creating class type:", error);
    return NextResponse.json(
      { error: "Failed to create class type" },
      { status: 500 }
    );
  }
}
