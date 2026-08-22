"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site";

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/p/")) {
    return null;
  }

  return (
    <footer className="bg-[color:var(--sea-deep)] text-[color:var(--cream)]">
      <div className="container-page section !py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-3xl tracking-tight">
              {siteConfig.name}
            </p>
            <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-white/70">
              Bathroom remodeling and flooring for homes across South Jersey —
              continuing a family tradition of careful, honest craftsmanship.
            </p>
          </div>
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--oak)]">
              Explore
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/75">
              <li>
                <Link href="/services" className="hover:text-white">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-white">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/estimate" className="hover:text-white">
                  Free estimate
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--oak)]">
              Service area
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/75">
              {siteConfig.serviceAreaLabel} — including{" "}
              {siteConfig.serviceTowns.slice(0, 6).join(", ")}, and nearby
              towns.
            </p>
            {siteConfig.phone ? (
              <a
                href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
                className="mt-4 block text-sm text-white hover:text-[color:var(--oak)]"
              >
                {siteConfig.phone}
              </a>
            ) : null}
            {(siteConfig.instagram || siteConfig.facebook) && (
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                {siteConfig.instagram ? (
                  <a
                    href={
                      siteConfig.instagram.startsWith("http")
                        ? siteConfig.instagram
                        : `https://instagram.com/${siteConfig.instagram.replace(/^@/, "")}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/75 hover:text-[color:var(--oak)]"
                  >
                    Instagram
                  </a>
                ) : null}
                {siteConfig.facebook ? (
                  <a
                    href={
                      siteConfig.facebook.startsWith("http")
                        ? siteConfig.facebook
                        : `https://facebook.com/${siteConfig.facebook}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/75 hover:text-[color:var(--oak)]"
                  >
                    Facebook
                  </a>
                ) : null}
              </div>
            )}
            <Link
              href="/estimate"
              className="btn btn-primary mt-6 !py-3 !px-4"
            >
              Free estimate
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
