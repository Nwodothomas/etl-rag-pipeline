import IngestionLogs from "@/app/ingest/IngestionLogs";

export default function IngestPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-black/10 bg-white px-6 py-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
          Ingestion Workspace
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          Track how uploaded assets move into the RAG knowledge base.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          In Stage 1, this route establishes the ingestion monitoring view and
          the shared job model. Real backend orchestration will be added when we
          integrate with the ingestion API.
        </p>
      </div>

      <IngestionLogs />
    </section>
  );
}
