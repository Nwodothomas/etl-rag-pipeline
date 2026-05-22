export type UploadSourceType = "file" | "url";

export type AssetType =
  | "pdf"
  | "doc"
  | "docx"
  | "xls"
  | "xlsx"
  | "txt"
  | "video"
  | "url"
  | "other";

export type PipelineStatus =
  | "pending"
  | "uploaded"
  | "queued"
  | "processing"
  | "completed"
  | "failed";

export interface KnowledgeAsset {
  id: string;
  name: string;
  assetType: AssetType;
  sourceType: UploadSourceType;
  status: PipelineStatus;
  uploadedAt: string;
  sizeBytes?: number;
  bucketPath?: string;
  sourceUrl?: string;
  errorMessage?: string;
}

export interface UploadRequest {
  sourceType: UploadSourceType;
  fileName?: string;
  sourceUrl?: string;
}

export interface UploadResponse {
  asset: KnowledgeAsset;
  message: string;
}

export interface IngestionJob {
  id: string;
  assetId: string;
  assetName: string;
  status: PipelineStatus;
  startedAt?: string;
  completedAt?: string;
  message: string;
}

export interface IngestionRequest {
  assetId: string;
}

export interface IngestionResponse {
  job: IngestionJob;
  message: string;
}

export interface ApiErrorResponse {
  error: string;
  details?: string;
}
