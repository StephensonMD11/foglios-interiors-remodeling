"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";

const links = [
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/testimonials", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";
  const hideChrome =
    pathname?.startsWith("/admin") || pathname?.startsWith("/p/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const solid = !isHome || scrolled || open;

  if (hideChrome) return null;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "bg-[color:var(--sea-deep)]/95 text-[color:var(--cream)] backdrop-blur-md"
          : "bg-transparent text-white"
      }`}
    >
      <div className="container-wide flex items-center justify-between gap-4 py-4 md:py-5">
        <Link href="/" className="group min-w-0">
          <span className="font-display block text-[1.35rem] leading-none tracking-tight md:text-[1.55rem]">
            {siteConfig.shortName}
          </span>
          <span className="mt-1 block text-[0.65rem] font-medium uppercase tracking-[0.22em] text-[color:var(--oak)] opacity-90">
            Interiors & Remodeling
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[0.78rem] font-medium uppercase tracking-[0.14em] transition-opacity hover:opacity-100 ${
                pathname === link.href ? "opacity-100" : "opacity-70"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/estimate" className="btn btn-primary !py-3 !px-4">
            Free estimate
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center border border-white/30 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span className="flex w-5 flex-col gap-1.5">
            <span
              className={`h-px w-full bg-current transition ${open ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span
              className={`h-px w-full bg-current transition ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`h-px w-full bg-current transition ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-[color:var(--sea-deep)] px-5 py-6 lg:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm uppercase tracking-[0.16em]"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/estimate" className="btn btn-primary mt-2 w-full">
              Free estimate
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
