import Link from "next/link";

export default function Home() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-black/10 bg-white px-6 py-8 shadow-sm">
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950">
          ETL pipeline UI for uploading and ingesting knowledge assets into a
          RAG workflow.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Manage source uploads, review storage activity, and trigger ingestion
          jobs through a clean operator dashboard built for RAG pipeline work.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/upload"
            className="inline-flex items-center justify-center rounded-full bg-sky-700 px-5 py-3 font-medium text-white transition hover:bg-sky-800"
          >
            Open Upload Workspace
          </Link>
          <Link
            href="/ingest"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Review Ingestion Flow
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">
            Upload sources
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            The UI is being shaped for PDFs, Office documents, spreadsheets,
            text, video, and URL sources.
          </p>
        </article>
        <article className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">
            Storage boundary
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Internal API routes will shield the client from Supabase details and
            later forward ingestion work to the backend service.
          </p>
        </article>
        <article className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">
            Observable pipeline
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Upload history and ingestion logs are part of the product from the
            start so operators can trust what the system is doing.
          </p>
        </article>
      </div>
    </section>
  );
}
