'use client';

import Loader from '@/components/Loader';
import StatusBadge from '@/components/StatusBadge';
import type { IngestionJob, KnowledgeAsset } from '@/lib/types';

type IngestionTriggerPanelProps = {
  assets: KnowledgeAsset[];
  jobs: IngestionJob[];
  isLoading: boolean;
  error: string | null;
  activeAssetId: string | null;
  onTrigger: (asset: KnowledgeAsset) => void | Promise<void>;
  onRefreshAssets: () => void | Promise<void>;
};

function findLatestJob(jobs: IngestionJob[], assetId: string) {
  return jobs.find((job) => job.assetId === assetId);
}

export default function IngestionTriggerPanel({
  assets,
  jobs,
  isLoading,
  error,
  activeAssetId,
  onTrigger,
  onRefreshAssets,
}: IngestionTriggerPanelProps) {
  return (
    <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">
            Ready for ingestion
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Select from uploaded assets and hand them off to the ingestion API.
            This is the UI seam that will later call `rag-backend`.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            void onRefreshAssets();
          }}
          className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-slate-400 hover:bg-slate-50"
        >
          Refresh assets
        </button>
      </div>

      {isLoading ? (
        <div className="mt-6">
          <Loader label="Loading uploaded assets..." />
        </div>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
        >
          <p className="font-semibold">Available assets could not be loaded.</p>
          <p className="mt-2">{error}</p>
        </div>
      ) : null}

      {!isLoading && !error && assets.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
          No uploaded assets are available yet. Upload a file or register a URL
          before triggering ingestion.
        </div>
      ) : null}

      {!isLoading && !error && assets.length > 0 ? (
        <div className="mt-6 space-y-4">
          {assets.map((asset) => {
            const latestJob = findLatestJob(jobs, asset.id);
            const isSubmitting = activeAssetId === asset.id;
            const isDisabled = isSubmitting || latestJob?.status === 'processing';

            return (
              <article
                key={asset.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h3 className="break-all font-semibold text-slate-950">
                      {asset.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {asset.assetType.toUpperCase()} • {asset.sourceType} source
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      {asset.bucketPath ?? asset.sourceUrl ?? 'No source location available'}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-3 lg:items-end">
                    <StatusBadge status={latestJob?.status ?? asset.status} />
                    <button
                      type="button"
                      disabled={isDisabled}
                      onClick={() => {
                        void onTrigger(asset);
                      }}
                      className="rounded-full bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-amber-300"
                    >
                      {isSubmitting ? 'Triggering...' : 'Trigger ingestion'}
                    </button>
                  </div>
                </div>

                {latestJob ? (
                  <div className="mt-4 rounded-2xl bg-white p-3 text-sm text-slate-600">
                    <p className="font-medium text-slate-800">Latest job message</p>
                    <p className="mt-2">{latestJob.message}</p>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
