import FileCard from "@/components/FileCard";
import type { KnowledgeAsset } from "@/lib/types";

const uploadHistory: KnowledgeAsset[] = [
  {
    id: "asset-001",
    name: "architecture-overview.pdf",
    assetType: "pdf",
    sourceType: "file",
    status: "uploaded",
    uploadedAt: "2026-05-22T09:00:00.000Z",
    sizeBytes: 246000,
    bucketPath: "knowledge-base/architecture-overview.pdf",
  },
  {
    id: "asset-002",
    name: "roadmap-notes.txt",
    assetType: "txt",
    sourceType: "file",
    status: "queued",
    uploadedAt: "2026-05-22T09:08:00.000Z",
    sizeBytes: 1800,
    bucketPath: "knowledge-base/roadmap-notes.txt",
  },
  {
    id: "asset-003",
    name: "https://docs.example.com/start-here",
    assetType: "url",
    sourceType: "url",
    status: "failed",
    uploadedAt: "2026-05-22T09:10:00.000Z",
    sourceUrl: "https://docs.example.com/start-here",
    errorMessage: "Source validation was not implemented in Stage 1.",
  },
];

export default function UploadHistory() {
  return (
    <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">
            Upload history
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Placeholder data shows the state model we will use once uploads are
            returned from the API.
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
          Stage 1
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {uploadHistory.map((asset) => (
          <FileCard key={asset.id} asset={asset} />
        ))}
      </div>
    </section>
  );
}
