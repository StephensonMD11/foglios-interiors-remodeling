import Link from "next/link";
import { siteConfig } from "@/lib/site";

/** Full shore + inland town lists — intended for the About page. */
export function ServiceAreaSection() {
  return (
    <section className="section bg-[color:var(--paper)]">
      <div className="container-page">
        <p className="section-label">Service area</p>
        <h2 className="font-display max-w-2xl text-4xl leading-tight md:text-5xl">
          Shore towns & inland communities we serve
        </h2>
        <p className="mt-5 max-w-2xl text-lg text-[color:var(--slate)]">
          A lot of our work is along the Jersey Shore — from Cape May north to
          Longport — and throughout inland South Jersey. If you&apos;re in{" "}
          {siteConfig.serviceAreaLabel.toLowerCase()}, reach out and we&apos;ll
          let you know if your project is a fit.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--oak)]">
              Shore towns
            </p>
            <ul className="mt-4 columns-2 gap-x-6 text-[color:var(--ink-soft)]">
              {siteConfig.shoreTowns.map((town) => (
                <li key={town} className="mb-2 break-inside-avoid">
                  {town}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--oak)]">
              Inland communities
            </p>
            <ul className="mt-4 columns-2 gap-x-6 text-[color:var(--ink-soft)]">
              {siteConfig.serviceTowns.map((town) => (
                <li key={town} className="mb-2 break-inside-avoid">
                  {town}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 text-sm text-[color:var(--slate)]">
          Counties:{" "}
          {siteConfig.serviceArea.map((county) => county).join(" · ")}
        </p>
      </div>
    </section>
  );
}

/** Short teaser with link to About — for homepage, services, estimate. */
export function ServiceAreaTeaser({
  className = "",
}: {
  className?: string;
}) {
  return (
    <p className={`text-[color:var(--slate)] ${className}`.trim()}>
      From Cape May and Wildwood to Egg Harbor, Galloway, Vineland, and
      beyond — we work along the shore and inland across{" "}
      {siteConfig.serviceAreaLabel.toLowerCase()}.{" "}
      <Link href="/about" className="font-semibold text-[color:var(--ink)] hover:text-[color:var(--oak)]">
        See all communities we serve
      </Link>
      .
    </p>
  );
}
