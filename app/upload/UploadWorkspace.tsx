'use client';

import { useEffect, useState } from 'react';

import UploadForm from '@/app/upload/UploadForm';
import UploadHistory from '@/app/upload/UploadHistory';
import { fetchUploadHistory } from '@/lib/apiClient';
import type { KnowledgeAsset } from '@/lib/types';

export default function UploadWorkspace() {
  const [assets, setAssets] = useState<KnowledgeAsset[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const loadHistory = async () => {
    setHistoryLoading(true);
    setHistoryError(null);

    try {
      const response = await fetchUploadHistory();
      setAssets(response.assets);
    } catch (error) {
      setHistoryError(
        error instanceof Error
          ? error.message
          : 'Upload history could not be loaded.'
      );
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function hydrateHistory() {
      try {
        const response = await fetchUploadHistory();

        if (!cancelled) {
          setAssets(response.assets);
          setHistoryError(null);
        }
      } catch (error) {
        if (!cancelled) {
          setHistoryError(
            error instanceof Error
              ? error.message
              : 'Upload history could not be loaded.'
          );
        }
      } finally {
        if (!cancelled) {
          setHistoryLoading(false);
        }
      }
    }

    void hydrateHistory();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleUploadComplete = (asset: KnowledgeAsset) => {
    setAssets((currentAssets) => {
      const nextAssets = [
        asset,
        ...currentAssets.filter((currentAsset) => currentAsset.id !== asset.id),
      ];

      return nextAssets.sort(
        (left, right) =>
          new Date(right.uploadedAt).getTime() - new Date(left.uploadedAt).getTime()
      );
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <UploadForm onUploadComplete={handleUploadComplete} />
      <UploadHistory
        assets={assets}
        isLoading={historyLoading}
        error={historyError}
        onRefresh={loadHistory}
      />
    </div>
  );
}
