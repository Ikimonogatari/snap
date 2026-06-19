"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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
        <div className="flex items-center gap-2">
          <Link
            href="/snap"
            className="inline-flex items-center gap-1.5 rounded-full bg-coral text-paper font-medium px-4 py-2 text-sm hover:bg-coral-deep transition-colors"
          >
            Snap now
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper text-ink-muted hover:text-ink hover:bg-warm transition-colors"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-t border-line bg-cream/95 backdrop-blur-xl"
          >
            <nav className="mx-auto max-w-7xl px-6 py-4 flex flex-col gap-1 text-sm">
              {links.map((l) => {
                const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`px-4 py-2.5 rounded-full transition-colors ${
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
