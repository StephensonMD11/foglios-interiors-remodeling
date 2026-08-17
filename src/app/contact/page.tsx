import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact a South Jersey Remodeling Contractor",
  description:
    "Connect with Foglio's Interiors & Remodeling, or request a free estimate for bathroom remodeling and flooring in South Jersey.",
  alternates: { canonical: "/contact" },
};

function SocialCard({
  label,
  href,
  handle,
  ready,
}: {
  label: string;
  href: string;
  handle: string;
  ready: boolean;
}) {
  if (ready) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group block border border-[color:var(--line)] bg-white p-8 transition hover:border-[color:var(--oak)]"
      >
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--oak)]">
          {label}
        </p>
        <p className="font-display mt-3 text-3xl tracking-tight text-[color:var(--ink)]">
          {handle}
        </p>
        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.12em] text-[color:var(--ink)] group-hover:text-[color:var(--oak)]">
          Visit profile →
        </p>
      </a>
    );
  }

  return (
    <div className="border border-dashed border-[color:var(--line)] bg-[color:var(--paper)] p-8">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--oak)]">
        {label}
      </p>
      <p className="font-display mt-3 text-3xl tracking-tight text-[color:var(--ink)]">
        Coming soon
      </p>
      <p className="mt-4 text-sm text-[color:var(--slate)]">
        Business profile link will appear here once confirmed.
      </p>
    </div>
  );
}

export default function ContactPage() {
  const ig = siteConfig.instagram.trim();
  const fb = siteConfig.facebook.trim();
  const igHref = ig
    ? ig.startsWith("http")
      ? ig
      : `https://instagram.com/${ig.replace(/^@/, "")}`
    : "";
  const fbHref = fb
    ? fb.startsWith("http")
      ? fb
      : `https://facebook.com/${fb}`
    : "";
  const igHandle = ig
    ? ig.startsWith("http")
      ? "Instagram"
      : `@${ig.replace(/^@/, "")}`
    : "Instagram";
  const fbHandle = fb
    ? fb.startsWith("http")
      ? "Facebook"
      : fb
    : "Facebook";

  return (
    <>
      <section className="bg-[color:var(--sea-deep)] pb-16 pt-32 text-white">
        <div className="container-page">
          <p className="section-label !text-[color:var(--oak)]">Contact</p>
          <h1 className="font-display max-w-3xl text-5xl leading-tight tracking-tight md:text-6xl">
            Stay connected.
          </h1>
          <p className="mt-5 max-w-xl text-white/75">
            Follow along for project updates and finished work. Ready for a
            quote? Use Free Estimate — that&apos;s the direct line for new
            projects.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <div className="grid gap-5 md:grid-cols-2">
            <SocialCard
              label="Instagram"
              href={igHref}
              handle={igHandle}
              ready={Boolean(ig)}
            />
            <SocialCard
              label="Facebook"
              href={fbHref}
              handle={fbHandle}
              ready={Boolean(fb)}
            />
          </div>

          <div className="mt-14 grid gap-8 border border-[color:var(--line)] bg-white p-8 md:grid-cols-[1.2fr_auto] md:items-center md:p-10">
            <div>
              <p className="section-label !mb-3">New project</p>
              <h2 className="font-display text-3xl tracking-tight md:text-4xl">
                Need a free estimate?
              </h2>
              <p className="mt-3 max-w-xl text-[color:var(--slate)]">
                Tell us about the bathroom or flooring job — we&apos;ll follow
                up privately. No social account required.
              </p>
            </div>
            <Link href="/estimate" className="btn btn-primary justify-self-start md:justify-self-end">
              Free estimate
            </Link>
          </div>

          {siteConfig.phone ? (
            <p className="mt-10 text-center text-[color:var(--slate)]">
              Or call{" "}
              <a
                href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
                className="font-semibold text-[color:var(--ink)] hover:text-[color:var(--oak)]"
              >
                {siteConfig.phone}
              </a>
            </p>
          ) : null}
        </div>
      </section>
    </>
  );
}
