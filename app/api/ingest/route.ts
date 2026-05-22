import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Ingestion API is not implemented yet.",
      details: "Stage 5 will connect this route to the backend ingestion flow.",
    },
    { status: 501 }
  );
}
