import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Bathroom Remodeling & Flooring Services in South Jersey",
  description:
    "Bathroom remodeling and flooring installation across South Jersey — Cape May, Cumberland, Salem, Atlantic, and Gloucester counties. Full gut baths, tile, LVP, and hardwood.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <section className="bg-[color:var(--sea-deep)] pb-20 pt-32 text-white">
        <div className="container-page">
          <p className="section-label !text-[color:var(--oak)]">Services</p>
          <h1 className="font-display max-w-3xl text-5xl leading-tight tracking-tight md:text-6xl">
            Bathroom remodeling & flooring for South Jersey homes.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            Focused work across {siteConfig.serviceAreaLabel}: complete
            bathrooms and flooring anywhere in the home. When other trades are
            needed, the right electrician and plumber are brought in so the
            project stays coordinated.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--fog)]">
            <Image
              src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1400&q=80"
              alt="Tiled bathroom remodel"
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
              alt="Hardwood flooring in a living space"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page max-w-3xl text-center">
          <h2 className="font-display text-4xl">Ready to talk through a project?</h2>
          <p className="mt-4 text-[color:var(--slate)]">
            Serving Cape May, Cumberland, Salem, Atlantic, and Gloucester
            counties.
          </p>
          <Link href="/estimate" className="btn btn-primary mt-8">
            Request an estimate
          </Link>
        </div>
      </section>
    </>
  );
}
