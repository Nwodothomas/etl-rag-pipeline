import type { AssetType, KnowledgeAsset } from "@/lib/types";

type StorageListItem = {
  id?: string | null;
  name: string;
  created_at?: string | null;
  updated_at?: string | null;
  metadata?: {
    size?: number;
    mimetype?: string;
  } | null;
};

function inferAssetTypeFromName(name: string): AssetType {
  const extension = name.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "pdf":
      return "pdf";
    case "doc":
      return "doc";
    case "docx":
      return "docx";
    case "xls":
      return "xls";
    case "xlsx":
      return "xlsx";
    case "txt":
      return "txt";
    case "mp4":
    case "mov":
    case "avi":
    case "webm":
    case "mkv":
      return "video";
    default:
      return "other";
  }
}

export function mapStorageObjectToAsset(
  bucketName: string,
  prefix: string,
  item: StorageListItem
): KnowledgeAsset {
  const cleanPrefix = prefix.replace(/^\/+|\/+$/g, "");
  const bucketPath = cleanPrefix ? `${cleanPrefix}/${item.name}` : item.name;
  const uploadedAt = item.created_at ?? item.updated_at ?? new Date().toISOString();

  return {
    id: item.id ?? `${bucketName}:${bucketPath}`,
    name: item.name,
    assetType: inferAssetTypeFromName(item.name),
    sourceType: "file",
    status: "uploaded",
    uploadedAt,
    sizeBytes: item.metadata?.size,
    mimeType: item.metadata?.mimetype,
    bucketName,
    bucketPath,
  };
}
