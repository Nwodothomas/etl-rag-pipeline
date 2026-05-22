import type {
  ApiErrorResponse,
  IngestionRequest,
  IngestionResponse,
  UploadHistoryResponse,
  UploadRequest,
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

export async function createUpload(payload: FormData | UploadRequest) {
  const requestInit: RequestInit = {
    method: "POST",
  };

  if (payload instanceof FormData) {
    requestInit.body = payload;
  } else {
    requestInit.headers = {
      "Content-Type": "application/json",
    };
    requestInit.body = JSON.stringify(payload);
  }

  const response = await fetch("/api/upload", requestInit);

  return parseResponse<UploadResponse>(response);
}

export async function fetchUploadHistory() {
  const response = await fetch("/api/upload", {
    method: "GET",
    cache: "no-store",
  });

  return parseResponse<UploadHistoryResponse>(response);
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
