import StatusBadge from "@/components/StatusBadge";
import type { IngestionJob } from "@/lib/types";

const ingestionJobs: IngestionJob[] = [
  {
    id: "job-001",
    assetId: "asset-001",
    assetName: "architecture-overview.pdf",
    status: "completed",
    startedAt: "2026-05-22T09:02:00.000Z",
    completedAt: "2026-05-22T09:05:00.000Z",
    message: "Document parsed and ready for chunking.",
  },
  {
    id: "job-002",
    assetId: "asset-002",
    assetName: "roadmap-notes.txt",
    status: "processing",
    startedAt: "2026-05-22T09:09:00.000Z",
    message: "Normalizing text content before embedding.",
  },
  {
    id: "job-003",
    assetId: "asset-003",
    assetName: "https://docs.example.com/start-here",
    status: "failed",
    startedAt: "2026-05-22T09:11:00.000Z",
    completedAt: "2026-05-22T09:12:00.000Z",
    message: "URL ingestion is not wired to the backend yet.",
  },
];

function formatDate(value?: string) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function IngestionLogs() {
  return (
    <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">
            Ingestion logs
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            These seeded jobs demonstrate the job states and audit details the
            UI will expose once ingestion is connected to the backend.
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
          Stage 1
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {ingestionJobs.map((job) => (
          <article
            key={job.id}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="font-semibold text-slate-950">{job.assetName}</h3>
                <p className="mt-1 text-sm text-slate-500">Job ID: {job.id}</p>
              </div>
              <StatusBadge status={job.status} />
            </div>
            <dl className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
              <div>
                <dt className="font-medium text-slate-800">Started</dt>
                <dd className="mt-1">{formatDate(job.startedAt)}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-800">Completed</dt>
                <dd className="mt-1">{formatDate(job.completedAt)}</dd>
              </div>
              <div className="md:col-span-2">
                <dt className="font-medium text-slate-800">Message</dt>
                <dd className="mt-1">{job.message}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
