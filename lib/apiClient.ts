import type {
  ApiErrorResponse,
  IngestionRequest,
  IngestionResponse,
  UploadResponse,
} from "@/lib/types";

async function parseResponse<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T | ApiErrorResponse;

  if (!response.ok) {
    const error = data as ApiErrorResponse;
    throw new Error(error.details ?? error.error ?? "Request failed");
  }

  return data as T;
}

export async function createUpload(formData: FormData) {
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  return parseResponse<UploadResponse>(response);
}

export async function triggerIngestion(payload: IngestionRequest) {
  const response = await fetch("/api/ingest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<IngestionResponse>(response);
}
