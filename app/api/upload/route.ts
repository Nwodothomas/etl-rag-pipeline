import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Upload API is not implemented yet.",
      details: "Stage 3 will connect this route to Supabase storage.",
    },
    { status: 501 }
  );
}
