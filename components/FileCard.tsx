import StatusBadge from "@/components/StatusBadge";
import type { KnowledgeAsset } from "@/lib/types";

function formatBytes(value?: number) {
  if (!value) {
    return "Unknown size";
  }

  if (value < 1024) {
    return `${value} B`;
  }

  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileCard({ asset }: { asset: KnowledgeAsset }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-semibold break-all text-slate-950">{asset.name}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {asset.assetType.toUpperCase()} • {asset.sourceType} source
          </p>
        </div>
        <StatusBadge status={asset.status} />
      </div>

      <dl className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
        <div>
          <dt className="font-medium text-slate-800">Uploaded</dt>
          <dd className="mt-1">{new Date(asset.uploadedAt).toLocaleString()}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-800">Size</dt>
          <dd className="mt-1">{formatBytes(asset.sizeBytes)}</dd>
        </div>
        <div className="md:col-span-2">
          <dt className="font-medium text-slate-800">Storage path</dt>
          <dd className="mt-1 break-all">
            {asset.bucketPath ?? asset.sourceUrl ?? "Not assigned yet"}
          </dd>
        </div>
        {asset.errorMessage ? (
          <div className="md:col-span-2">
            <dt className="font-medium text-rose-700">Error</dt>
            <dd className="mt-1 text-rose-700">{asset.errorMessage}</dd>
          </div>
        ) : null}
      </dl>
    </article>
  );
}
