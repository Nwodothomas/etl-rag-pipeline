'use client';

import { useEffect, useState } from 'react';

import IngestionLogs from '@/app/ingest/IngestionLogs';
import IngestionTriggerPanel from '@/app/ingest/IngestionTriggerPanel';
import {
  fetchIngestionHistory,
  fetchUploadHistory,
  triggerIngestion,
} from '@/lib/apiClient';
import type { IngestionJob, KnowledgeAsset } from '@/lib/types';

export default function IngestionWorkspace() {
  const [assets, setAssets] = useState<KnowledgeAsset[]>([]);
  const [jobs, setJobs] = useState<IngestionJob[]>([]);
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [assetsError, setAssetsError] = useState<string | null>(null);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [activeAssetId, setActiveAssetId] = useState<string | null>(null);

  const loadAssets = async () => {
    setAssetsLoading(true);
    setAssetsError(null);

    try {
      const response = await fetchUploadHistory();
      setAssets(response.assets);
    } catch (error) {
      setAssetsError(
        error instanceof Error ? error.message : 'Uploaded assets could not be loaded.'
      );
    } finally {
      setAssetsLoading(false);
    }
  };

  const loadJobs = async () => {
    setJobsLoading(true);
    setJobsError(null);

    try {
      const response = await fetchIngestionHistory();
      setJobs(response.jobs);
    } catch (error) {
      setJobsError(
        error instanceof Error ? error.message : 'Ingestion jobs could not be loaded.'
      );
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function hydrateAssets() {
      try {
        const response = await fetchUploadHistory();

        if (!cancelled) {
          setAssets(response.assets);
          setAssetsError(null);
        }
      } catch (error) {
        if (!cancelled) {
          setAssetsError(
            error instanceof Error
              ? error.message
              : 'Uploaded assets could not be loaded.'
          );
        }
      } finally {
        if (!cancelled) {
          setAssetsLoading(false);
        }
      }
    }

    void hydrateAssets();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function hydrateJobs() {
      try {
        const response = await fetchIngestionHistory();

        if (!cancelled) {
          setJobs(response.jobs);
          setJobsError(null);
        }
      } catch (error) {
        if (!cancelled) {
          setJobsError(
            error instanceof Error
              ? error.message
              : 'Ingestion jobs could not be loaded.'
          );
        }
      } finally {
        if (!cancelled) {
          setJobsLoading(false);
        }
      }
    }

    void hydrateJobs();

    const intervalId = setInterval(() => {
      void hydrateJobs();
    }, 2500);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  const handleTrigger = async (asset: KnowledgeAsset) => {
    setActiveAssetId(asset.id);

    try {
      const response = await triggerIngestion({
        assetId: asset.id,
        assetName: asset.name,
        assetType: asset.assetType,
        sourceType: asset.sourceType,
        bucketPath: asset.bucketPath,
        sourceUrl: asset.sourceUrl,
      });

      setJobs((currentJobs) => {
        const nextJobs = [
          response.job,
          ...currentJobs.filter((job) => job.id !== response.job.id),
        ];

        return nextJobs.sort((left, right) => {
          const rightTime = new Date(
            right.startedAt ?? right.completedAt ?? 0
          ).getTime();
          const leftTime = new Date(
            left.startedAt ?? left.completedAt ?? 0
          ).getTime();

          return rightTime - leftTime;
        });
      });
      setJobsError(null);
    } catch (error) {
      setJobsError(
        error instanceof Error ? error.message : 'Ingestion trigger failed.'
      );
    } finally {
      setActiveAssetId(null);
      void loadJobs();
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <IngestionTriggerPanel
        assets={assets}
        jobs={jobs}
        isLoading={assetsLoading}
        error={assetsError}
        activeAssetId={activeAssetId}
        onTrigger={handleTrigger}
        onRefreshAssets={loadAssets}
      />
      <IngestionLogs
        jobs={jobs}
        isLoading={jobsLoading}
        error={jobsError}
        onRefresh={loadJobs}
      />
    </div>
  );
}
