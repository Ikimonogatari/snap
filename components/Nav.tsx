"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Logo } from "./Logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/snap", label: "Snap it" },
  { href: "/history", label: "My snaps" },
  { href: "/pricing", label: "Pricing" },
  { href: "/architecture", label: "How it works" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-40 border-b border-line bg-cream/80 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo size={26} />
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  active
                    ? "bg-navy text-cream font-medium"
                    : "text-ink-muted hover:text-ink hover:bg-warm"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/snap"
          className="inline-flex items-center gap-1.5 rounded-full bg-coral text-paper font-medium px-4 py-2 text-sm hover:bg-coral-deep transition-colors"
        >
          Snap now
        </Link>
      </div>
    </motion.header>
  );
}
