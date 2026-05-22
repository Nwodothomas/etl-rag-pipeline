import { NextResponse } from "next/server";

import { mapStorageObjectToAsset } from "@/lib/history";
import { getSupabaseServerClient } from "@/lib/supabaseClient";
import type {
  ApiErrorResponse,
  AssetType,
  KnowledgeAsset,
  UploadHistoryResponse,
  UploadRequest,
  UploadResponse,
} from "@/lib/types";

export const runtime = "nodejs";

const DEFAULT_BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET ?? "knowledge-base";
const DEFAULT_HISTORY_PREFIX = process.env.SUPABASE_STORAGE_HISTORY_PREFIX ?? "";

function jsonError(
  status: number,
  error: string,
  details?: string
) {
  const body: ApiErrorResponse = { error, details };
  return NextResponse.json(body, { status });
}

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-");
}

function resolveAssetType(value: FormDataEntryValue | null): AssetType {
  if (typeof value !== "string" || value.length === 0) {
    return "other";
  }

  return value as AssetType;
}

async function handleFileUpload(request: Request) {
  const formData = await request.formData();
  const sourceType = formData.get("sourceType");
  const assetType = resolveAssetType(formData.get("assetType"));
  const file = formData.get("file");

  if (sourceType !== "file") {
    return jsonError(400, "Invalid upload source.", "Expected a file upload request.");
  }

  if (!(file instanceof File)) {
    return jsonError(400, "Missing file.", "Attach a file in the multipart form payload.");
  }

  const objectPath = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${sanitizeFileName(
    file.name
  )}`;
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.storage
    .from(DEFAULT_BUCKET_NAME)
    .upload(objectPath, fileBuffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (error) {
    return jsonError(502, "Supabase upload failed.", error.message);
  }

  const asset: KnowledgeAsset = {
    id: crypto.randomUUID(),
    name: file.name,
    assetType,
    sourceType: "file",
    status: "uploaded",
    uploadedAt: new Date().toISOString(),
    sizeBytes: file.size,
    mimeType: file.type || "application/octet-stream",
    bucketName: DEFAULT_BUCKET_NAME,
    bucketPath: objectPath,
  };
  const body: UploadResponse = {
    asset,
    message: "File uploaded to Supabase storage.",
  };

  return NextResponse.json(body, { status: 201 });
}

async function handleUrlUpload(request: Request) {
  const payload = (await request.json()) as UploadRequest;

  if (payload.sourceType !== "url" || !payload.sourceUrl) {
    return jsonError(400, "Invalid upload source.", "Expected a URL upload request.");
  }

  const asset: KnowledgeAsset = {
    id: crypto.randomUUID(),
    name: payload.sourceUrl,
    assetType: "url",
    sourceType: "url",
    status: "queued",
    uploadedAt: new Date().toISOString(),
    sourceUrl: payload.sourceUrl,
  };
  const body: UploadResponse = {
    asset,
    message: "URL source registered for later ingestion.",
  };

  return NextResponse.json(body, { status: 201 });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("multipart/form-data")) {
      return await handleFileUpload(request);
    }

    if (contentType.includes("application/json")) {
      return await handleUrlUpload(request);
    }

    return jsonError(
      415,
      "Unsupported content type.",
      "Use multipart/form-data for files or application/json for URL sources."
    );
  } catch (error) {
    const details =
      error instanceof Error ? error.message : "Unexpected upload error.";

    return jsonError(500, "Upload request failed.", details);
  }
}

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.storage
      .from(DEFAULT_BUCKET_NAME)
      .list(DEFAULT_HISTORY_PREFIX, {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      return jsonError(502, "Failed to load upload history.", error.message);
    }

    const assets = (data ?? [])
      .filter((item) => item.name && item.name !== ".emptyFolderPlaceholder")
      .map((item) =>
        mapStorageObjectToAsset(DEFAULT_BUCKET_NAME, DEFAULT_HISTORY_PREFIX, item)
      )
      .sort(
        (left, right) =>
          new Date(right.uploadedAt).getTime() - new Date(left.uploadedAt).getTime()
      );

    const body: UploadHistoryResponse = {
      assets,
      message: "Upload history loaded from Supabase storage.",
    };

    return NextResponse.json(body);
  } catch (error) {
    const details =
      error instanceof Error ? error.message : "Unexpected upload history error.";

    return jsonError(500, "Failed to load upload history.", details);
  }
}
