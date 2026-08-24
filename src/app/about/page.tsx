import Link from "next/link";
import {
  BreadcrumbJsonLd,
  pageBreadcrumbs,
} from "@/components/BreadcrumbJsonLd";
import { ServiceAreaSection } from "@/components/ServiceAreaSection";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About Our South Jersey Remodeling Company",
  description:
    "Meet Foglio's — bathroom remodeling and flooring from Cape May to Atlantic City and inland across South Jersey. Family craftsmanship, shore towns, and communities we serve.",
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
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            Bathroom remodeling and flooring for homeowners across the Jersey
            Shore and inland South Jersey — with the care of a family craft
            tradition behind it.
          </p>
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
                  Coverage
                </strong>
                Jersey Shore from Cape May to Longport, plus inland towns
                across {siteConfig.serviceAreaLabel.toLowerCase()}
              </li>
              <li>
                <strong className="block text-[color:var(--ink)]">
                  How we work
                </strong>
                One point of contact, coordinated trades when needed, and
                finishes that hold up in real daily use
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

      <section className="section bg-[color:var(--cream)]">
        <div className="container-page grid gap-10 lg:grid-cols-3">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--oak)]">
              Bathrooms
            </p>
            <h2 className="font-display mt-3 text-2xl leading-snug">
              Built right, start to finish
            </h2>
            <p className="mt-3 text-[color:var(--slate)]">
              Full gut remodels and focused refreshes — demolition, waterproofing,
              tile, fixtures, and the details that make a bath feel finished.
            </p>
          </div>
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--oak)]">
              Flooring
            </p>
            <h2 className="font-display mt-3 text-2xl leading-snug">
              LVP, hardwood, and tile
            </h2>
            <p className="mt-3 text-[color:var(--slate)]">
              Kitchens, living rooms, bedrooms, and baths — installed with solid
              prep, clean transitions, and finishes suited to how you use the
              space.
            </p>
          </div>
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--oak)]">
              Shore & inland
            </p>
            <h2 className="font-display mt-3 text-2xl leading-snug">
              Year-round & seasonal homes
            </h2>
            <p className="mt-3 text-[color:var(--slate)]">
              We work in shore communities and inland towns alike — second homes,
              rentals, and primary residences that need updates done right.
            </p>
          </div>
        </div>
      </section>

      <ServiceAreaSection />

      <section className="section">
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
