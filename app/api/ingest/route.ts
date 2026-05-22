import { NextResponse } from "next/server";

import {
  createIngestionJob,
  getIngestionJobByAssetId,
  listIngestionJobs,
} from "@/lib/ingestionStore";
import type {
  ApiErrorResponse,
  IngestionHistoryResponse,
  IngestionRequest,
  IngestionResponse,
} from "@/lib/types";

export const runtime = "nodejs";

function jsonError(status: number, error: string, details?: string) {
  const body: ApiErrorResponse = { error, details };
  return NextResponse.json(body, { status });
}

function validateIngestionPayload(payload: Partial<IngestionRequest>) {
  if (!payload.assetId) {
    return "An asset id is required.";
  }

  if (!payload.assetName) {
    return "An asset name is required.";
  }

  if (!payload.assetType) {
    return "An asset type is required.";
  }

  if (!payload.sourceType) {
    return "A source type is required.";
  }

  return null;
}

export async function GET() {
  const body: IngestionHistoryResponse = {
    jobs: listIngestionJobs(),
    message: "Ingestion jobs loaded from the ingestion API.",
  };

  return NextResponse.json(body);
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<IngestionRequest>;
    const validationError = validateIngestionPayload(payload);

    if (validationError) {
      return jsonError(400, "Invalid ingestion request.", validationError);
    }

    const existingJob = getIngestionJobByAssetId(payload.assetId!);
    if (existingJob && ["processing", "queued"].includes(existingJob.status)) {
      const body: IngestionResponse = {
        job: existingJob,
        message: "Asset is already in the ingestion pipeline.",
      };

      return NextResponse.json(body, { status: 200 });
    }

    const { job } = createIngestionJob(payload as IngestionRequest);
    const body: IngestionResponse = {
      job,
      message:
        "Ingestion job created. This is the contract boundary where rag-backend will later be called.",
    };

    return NextResponse.json(body, { status: 201 });
  } catch (error) {
    const details =
      error instanceof Error ? error.message : "Unexpected ingestion error.";

    return jsonError(500, "Ingestion request failed.", details);
  }
}
