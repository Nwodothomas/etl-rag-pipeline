import type { PipelineStatus } from "@/lib/types";

const statusStyles: Record<PipelineStatus, string> = {
  pending: "bg-slate-100 text-slate-700",
  uploaded: "bg-sky-100 text-sky-700",
  queued: "bg-amber-100 text-amber-700",
  processing: "bg-violet-100 text-violet-700",
  completed: "bg-emerald-100 text-emerald-700",
  failed: "bg-rose-100 text-rose-700",
};

export default function StatusBadge({ status }: { status: PipelineStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
