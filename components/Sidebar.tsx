'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Overview" },
  { href: "/upload", label: "Upload" },
  { href: "/ingest", label: "Ingest" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full rounded-3xl border border-black/10 bg-white p-4 shadow-sm lg:sticky lg:top-6 lg:w-72 lg:self-start">
      <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Workspace
      </p>
      <nav className="space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex rounded-2xl px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
