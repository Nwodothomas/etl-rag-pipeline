import Loader from "@/components/Loader";
import StatusBadge from "@/components/StatusBadge";
import type { IngestionJob } from "@/lib/types";

type IngestionLogsProps = {
  jobs: IngestionJob[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void | Promise<void>;
};

function formatDate(value?: string) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function IngestionLogs({
  jobs,
  isLoading,
  error,
  onRefresh,
}: IngestionLogsProps) {
  return (
    <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">
            Ingestion logs
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Live job results from the ingestion API. This is where developers
            can inspect pipeline activity after triggering assets.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            void onRefresh();
          }}
          className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-slate-400 hover:bg-slate-50"
        >
          Refresh logs
        </button>
      </div>

      {isLoading ? (
        <div className="mt-6">
          <Loader label="Loading ingestion jobs..." />
        </div>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
        >
          <p className="font-semibold">Ingestion logs are unavailable.</p>
          <p className="mt-2">{error}</p>
        </div>
      ) : null}

      {!isLoading && !error && jobs.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
          No ingestion jobs have been triggered yet.
        </div>
      ) : null}

      {!isLoading && !error && jobs.length > 0 ? (
        <div className="mt-6 space-y-4">
          {jobs.map((job) => (
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
              <div>
                <dt className="font-medium text-slate-800">Source type</dt>
                <dd className="mt-1">{job.sourceType ?? "Not available"}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-800">Asset type</dt>
                <dd className="mt-1">{job.assetType ?? "Not available"}</dd>
              </div>
              {job.bucketPath ? (
                <div className="md:col-span-2">
                  <dt className="font-medium text-slate-800">Bucket path</dt>
                  <dd className="mt-1 break-all">{job.bucketPath}</dd>
                </div>
              ) : null}
              {job.sourceUrl ? (
                <div className="md:col-span-2">
                  <dt className="font-medium text-slate-800">Source URL</dt>
                  <dd className="mt-1 break-all">{job.sourceUrl}</dd>
                </div>
              ) : null}
              <div className="md:col-span-2">
                <dt className="font-medium text-slate-800">Message</dt>
                <dd className="mt-1">{job.message}</dd>
              </div>
            </dl>
          </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
