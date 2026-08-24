import Image from "next/image";
import Link from "next/link";
import {
  BreadcrumbJsonLd,
  pageBreadcrumbs,
} from "@/components/BreadcrumbJsonLd";
import { FaqJsonLd, type FaqItem } from "@/components/FaqJsonLd";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Bathroom Remodeling & Flooring Services in South Jersey",
  description:
    "Bathroom remodeling and flooring across South Jersey shore towns — Cape May, Wildwood, Ocean City, Stone Harbor, Avalon, Atlantic City, and more — plus Vineland, Millville, and Gloucester County communities. Full gut baths, tile, LVP, and hardwood.",
  path: "/services",
});

const FAQS: FaqItem[] = [
  {
    question: "What areas of South Jersey do you serve?",
    answer: `We serve homeowners across ${siteConfig.serviceAreaLabel} — including Jersey Shore towns like ${siteConfig.shoreTowns.slice(0, 6).join(", ")}, and mainland communities such as ${siteConfig.serviceTowns.slice(0, 4).join(", ")}.`,
  },
  {
    question: "Do you work in shore towns along the coast?",
    answer: `Yes. We regularly work in shore towns from Cape May through Atlantic City, including ${siteConfig.shoreTowns.slice(0, 8).join(", ")}, and nearby beach communities.`,
  },
  {
    question: "Do you handle full bathroom remodels or only finishes?",
    answer:
      "Both. We handle full gut remodels — demolition, subfloor repair, waterproofing, tile, drywall, fixtures, and finishes — as well as focused refreshes. When electrical or plumbing work is needed, we coordinate the right trades so the project stays organized.",
  },
  {
    question: "What flooring options do you install?",
    answer:
      "We install luxury vinyl plank (LVP), hardwood, and tile for kitchens, living rooms, bedrooms, hallways, and baths, with proper subfloor prep and clean transitions.",
  },
  {
    question: "How do I get a free estimate?",
    answer:
      "Use the free estimate form on this site to describe your bathroom or flooring project. Messages are delivered privately — there is no public email address on the site.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={pageBreadcrumbs({ name: "Services", path: "/services" })}
      />
      <FaqJsonLd faqs={FAQS} />
      <section className="bg-[color:var(--sea-deep)] pb-20 pt-32 text-white">
        <div className="container-page">
          <p className="section-label !text-[color:var(--oak)]">Services</p>
          <h1 className="font-display max-w-3xl text-5xl leading-tight tracking-tight md:text-6xl">
            Bathroom remodeling & flooring for South Jersey homes.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            Focused work across {siteConfig.serviceAreaLabel} — from Cape May
            and Wildwood up through Atlantic City, plus inland towns throughout
            South Jersey. When other trades are needed, the right electrician
            and plumber are brought in so the project stays coordinated.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--fog)]">
            <Image
              src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1400&q=80"
              alt="Tiled bathroom remodel in a South Jersey shore town home"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="section-label">Bathrooms</p>
            <h2 className="font-display text-4xl leading-tight md:text-5xl">
              Full bathroom remodeling in South Jersey
            </h2>
            <p className="mt-5 text-lg text-[color:var(--slate)]">
              From a refresh to a gut remodel — including work down to the
              studs, subfloor repair, waterproofing, drywall, tile, fixtures,
              and finishes. One point of contact from first visit to final walkthrough.
            </p>
            <ul className="mt-8 space-y-3 text-[color:var(--ink-soft)]">
              {[
                "Demolition and structural prep",
                "Subfloors and waterproofing",
                "Coordination with electrician & plumber",
                "Tile, drywall, paint, and trim",
                "Vanities, fixtures, glass, and hardware",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[color:var(--oak)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section bg-[color:var(--paper)]">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <p className="section-label">Flooring</p>
            <h2 className="font-display text-4xl leading-tight md:text-5xl">
              Flooring for every room
            </h2>
            <p className="mt-5 text-lg text-[color:var(--slate)]">
              Kitchens, living rooms, bedrooms, hallways — LVP, hardwood, and
              tile flooring installed across South Jersey with clean lines,
              solid prep, and finishes that match how you actually use the
              space.
            </p>
            <ul className="mt-8 space-y-3 text-[color:var(--ink-soft)]">
              {[
                "Hardwood, LVP, tile, and more",
                "Proper subfloor prep",
                "Transitions and base details",
                "Single rooms or whole-home runs",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[color:var(--oak)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative order-1 aspect-[4/5] overflow-hidden bg-[color:var(--fog)] lg:order-2">
            <Image
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=80"
              alt="Hardwood flooring installation in a South Jersey living space"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <p className="section-label">Shore towns</p>
          <h2 className="font-display max-w-2xl text-4xl leading-tight md:text-5xl">
            Bathroom & flooring work along the Jersey Shore
          </h2>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--slate)]">
            We do a lot of work in shore communities — second homes, year-round
            residences, and rental properties from Cape May north to Longport.
          </p>
          <ul className="mt-10 columns-2 gap-x-8 text-[color:var(--ink-soft)] sm:columns-3 lg:columns-4">
            {siteConfig.shoreTowns.map((town) => (
              <li key={town} className="mb-2 break-inside-avoid">
                {town}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-[color:var(--paper)]">
        <div className="container-page max-w-3xl">
          <p className="section-label">Common questions</p>
          <h2 className="font-display text-4xl leading-tight md:text-5xl">
            Before you start a remodel
          </h2>
          <dl className="mt-12 space-y-8">
            {FAQS.map((faq) => (
              <div key={faq.question}>
                <dt className="font-display text-2xl text-[color:var(--ink)]">
                  {faq.question}
                </dt>
                <dd className="mt-3 text-lg leading-relaxed text-[color:var(--slate)]">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="container-page max-w-3xl text-center">
          <h2 className="font-display text-4xl">Ready to talk through a project?</h2>
          <p className="mt-4 text-[color:var(--slate)]">
            Serving shore towns from Cape May to Longport, plus{" "}
            {siteConfig.serviceAreaLabel.toLowerCase()}.
          </p>
          <Link href="/estimate" className="btn btn-primary mt-8">
            Request an estimate
          </Link>
        </div>
      </section>
    </>
  );
}
