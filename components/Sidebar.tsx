import Link from "next/link";

const links = [
  { href: "/", label: "Overview" },
  { href: "/upload", label: "Upload" },
  { href: "/ingest", label: "Ingest" },
];

export default function Sidebar() {
  return (
    <aside className="w-full rounded-3xl border border-black/10 bg-white p-4 shadow-sm lg:sticky lg:top-6 lg:w-72 lg:self-start">
      <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Workspace
      </p>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">
        The sidebar is intentionally simple in Stage 1. Active navigation and
        operator shortcuts can be layered in later without changing the route
        structure.
      </div>
    </aside>
  );
}
