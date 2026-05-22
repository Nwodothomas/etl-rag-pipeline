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
            Upload, storage, and ingestion workspace
          </p>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 md:inline-flex">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Pipeline Console
        </div>
      </div>
    </header>
  );
}
