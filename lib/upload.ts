import type {
  AssetType,
  UploadRequest,
  UploadValidationResult,
} from "@/lib/types";

export const MAX_UPLOAD_SIZE_BYTES = 50 * 1024 * 1024;

const extensionToAssetType: Record<string, AssetType> = {
  pdf: "pdf",
  doc: "doc",
  docx: "docx",
  xls: "xls",
  xlsx: "xlsx",
  txt: "txt",
  mp4: "video",
  mov: "video",
  avi: "video",
  webm: "video",
  mkv: "video",
};

export function getAcceptedFileTypes() {
  return [
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".txt",
    ".mp4",
    ".mov",
    ".avi",
    ".webm",
    ".mkv",
  ].join(",");
}

export function inferAssetTypeFromFile(file: File): AssetType {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension && extension in extensionToAssetType) {
    return extensionToAssetType[extension];
  }

  if (file.type.startsWith("video/")) {
    return "video";
  }

  return "other";
}

export function validateFileUpload(file: File | null): UploadValidationResult {
  const errors: string[] = [];

  if (!file) {
    errors.push("Select a file before preparing the upload payload.");
    return { valid: false, errors };
  }

  const assetType = inferAssetTypeFromFile(file);

  if (assetType === "other") {
    errors.push(
      "Unsupported file type. Use PDF, DOC, DOCX, XLS, XLSX, TXT, or supported video files."
    );
  }

  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    errors.push("File size must be 50 MB or less during the UI validation stage.");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const request: UploadRequest = {
    sourceType: "file",
    assetType,
    fileName: file.name,
    sizeBytes: file.size,
    mimeType: file.type || "application/octet-stream",
  };

  return {
    valid: true,
    errors: [],
    request,
  };
}

export function validateUrlUpload(rawUrl: string): UploadValidationResult {
  const errors: string[] = [];
  const trimmedUrl = rawUrl.trim();

  if (!trimmedUrl) {
    errors.push("Enter a URL before preparing the upload payload.");
    return { valid: false, errors };
  }

  try {
    const parsedUrl = new URL(trimmedUrl);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      errors.push("Use an http or https URL.");
    }
  } catch {
    errors.push("Enter a valid URL.");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const request: UploadRequest = {
    sourceType: "url",
    assetType: "url",
    sourceUrl: trimmedUrl,
  };

  return {
    valid: true,
    errors: [],
    request,
  };
}
