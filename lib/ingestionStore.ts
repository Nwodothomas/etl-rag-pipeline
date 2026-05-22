import type { IngestionJob, IngestionRequest } from "@/lib/types";

const ingestionJobs: IngestionJob[] = [];
const completionTimers = new Map<string, ReturnType<typeof setTimeout>>();

function buildCompletionMessage(request: IngestionRequest) {
  if (request.sourceType === "url") {
    return "URL source fetched and prepared for downstream chunking.";
  }

  if (request.assetType === "video") {
    return "Video asset registered for transcript extraction and embedding.";
  }

  return "Asset handed off for parsing and chunk preparation.";
}

export function listIngestionJobs() {
  return [...ingestionJobs].sort((left, right) => {
    const rightTime = new Date(right.startedAt ?? right.completedAt ?? 0).getTime();
    const leftTime = new Date(left.startedAt ?? left.completedAt ?? 0).getTime();

    return rightTime - leftTime;
  });
}

export function getIngestionJobByAssetId(assetId: string) {
  return ingestionJobs.find((job) => job.assetId === assetId);
}

export function createIngestionJob(request: IngestionRequest) {
  const existingJob = getIngestionJobByAssetId(request.assetId);

  if (existingJob && ["processing", "queued"].includes(existingJob.status)) {
    return {
      job: existingJob,
      created: false,
    };
  }

  const job: IngestionJob = {
    id: crypto.randomUUID(),
    assetId: request.assetId,
    assetName: request.assetName,
    assetType: request.assetType,
    sourceType: request.sourceType,
    bucketPath: request.bucketPath,
    sourceUrl: request.sourceUrl,
    status: "processing",
    startedAt: new Date().toISOString(),
    message: "Asset accepted by the ingestion API and queued for backend handoff.",
  };

  ingestionJobs.unshift(job);

  const existingTimer = completionTimers.get(job.id);
  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  const timer = setTimeout(() => {
    const target = ingestionJobs.find((currentJob) => currentJob.id === job.id);
    if (!target) {
      return;
    }

    target.status = "completed";
    target.completedAt = new Date().toISOString();
    target.message = buildCompletionMessage(request);
    completionTimers.delete(job.id);
  }, 1800);

  completionTimers.set(job.id, timer);

  return {
    job,
    created: true,
  };
}
