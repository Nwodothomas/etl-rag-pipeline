import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-black/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-6">
        <div>
          <Link href="/" className="text-lg font-semibold tracking-tight text-slate-950">
            ETL RAG Pipeline
          </Link>
          <p className="text-sm text-slate-500">
            Developer workspace for upload and ingestion operations
          </p>
        </div>
        <div className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
          Foundation Stage
        </div>
      </div>
    </header>
  );
}
