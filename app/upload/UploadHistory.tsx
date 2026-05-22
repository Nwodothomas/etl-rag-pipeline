import Loader from "@/components/Loader";
import FileCard from "@/components/FileCard";
import type { KnowledgeAsset } from "@/lib/types";

type UploadHistoryProps = {
  assets: KnowledgeAsset[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void | Promise<void>;
};

export default function UploadHistory({
  assets,
  isLoading,
  error,
  onRefresh,
}: UploadHistoryProps) {
  return (
    <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">
            Upload history
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            This panel now reads from the upload API and reflects newly
            completed uploads as they come back from the server.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            void onRefresh();
          }}
          className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-slate-400 hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="mt-6">
          <Loader label="Loading upload history..." />
        </div>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
        >
          <p className="font-semibold">Upload history is unavailable.</p>
          <p className="mt-2">{error}</p>
        </div>
      ) : null}

      {!isLoading && !error && assets.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
          No uploaded assets were returned by the API yet. Uploading a file will
          place it here as soon as the server responds successfully.
        </div>
      ) : null}

      {!isLoading && !error && assets.length > 0 ? (
        <div className="mt-6 space-y-4">
          {assets.map((asset) => (
            <FileCard key={asset.id} asset={asset} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
