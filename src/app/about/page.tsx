import Link from "next/link";
import {
  BreadcrumbJsonLd,
  pageBreadcrumbs,
} from "@/components/BreadcrumbJsonLd";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About Our South Jersey Remodeling Company",
  description:
    "Meet Foglio's Interiors & Remodeling — bathroom remodeling and flooring craftsmanship for Cape May, Cumberland, Salem, Atlantic, and Gloucester counties, rooted in a family home-improvement tradition.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={pageBreadcrumbs({ name: "About", path: "/about" })}
      />
      <section className="bg-[color:var(--sea-deep)] pb-20 pt-32 text-white">
        <div className="container-page">
          <p className="section-label !text-[color:var(--oak)]">About</p>
          <h1 className="font-display max-w-3xl text-5xl leading-tight tracking-tight md:text-6xl">
            A new chapter. The same standard of work.
          </h1>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-2xl space-y-5 text-lg text-[color:var(--slate)]">
            <p>
              {siteConfig.name} is built for homeowners who want bathroom
              remodels and flooring done carefully — clear communication,
              reliable scheduling, and finishes you&apos;re proud to live with.
            </p>
            <p>
              The work sits in a longer family story. For roughly two decades,
              Foglio&apos;s Handyman and Carpentry Services LLC served South
              Jersey homes with integrity and craftsmanship. That legacy
              continues here as a focused interiors and remodeling practice —
              not a rebrand of every past offering, but the same values applied
              to bathrooms and floors.
            </p>
            <p>
              Busy schedules are normal in this trade. This site exists so
              homeowners can see the work, leave an inquiry, and get a
              professional response — and so the business can keep a fresh
              portfolio without living only on social media.
            </p>
          </div>
          <aside className="border border-[color:var(--line)] bg-[color:var(--paper)] p-8">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--oak)]">
              At a glance
            </p>
            <ul className="mt-6 space-y-5 text-[color:var(--ink-soft)]">
              <li>
                <strong className="block text-[color:var(--ink)]">Focus</strong>
                Bathroom remodeling & flooring
              </li>
              <li>
                <strong className="block text-[color:var(--ink)]">
                  Service area
                </strong>
                {siteConfig.serviceAreaLabel} — including{" "}
                {siteConfig.serviceTowns.slice(0, 4).join(", ")}, and nearby
                towns
              </li>
              <li>
                <strong className="block text-[color:var(--ink)]">
                  Licensed & insured
                </strong>
                Details confirmed with owner — license and insurance numbers
                will be published here once verified. Ask for current
                documentation with any estimate.
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="section bg-[color:var(--paper)]">
        <div className="container-page max-w-3xl text-center">
          <h2 className="font-display text-4xl">Planning a remodel?</h2>
          <p className="mt-4 text-[color:var(--slate)]">
            Tell us about the space. We&apos;ll follow up to discuss scope,
            timing, and next steps.
          </p>
          <Link href="/estimate" className="btn btn-primary mt-8">
            Start an inquiry
          </Link>
        </div>
      </section>
    </>
  );
}
