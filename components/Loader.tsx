export default function Loader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-sky-600" />
      <span>{label}</span>
    </div>
  );
}
