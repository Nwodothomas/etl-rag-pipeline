import UploadWorkspace from "@/app/upload/UploadWorkspace";

export default function UploadPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-black/10 bg-white px-6 py-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
          Upload Workspace
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          Prepare files and source links for the knowledge pipeline.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          This stage connects the upload page to real API-facing history so the
          workspace can show what has already reached storage and immediately
          reflect newly uploaded assets.
        </p>
      </div>

      <UploadWorkspace />
    </section>
  );
}
