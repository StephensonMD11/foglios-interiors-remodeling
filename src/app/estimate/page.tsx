import {
  BreadcrumbJsonLd,
  pageBreadcrumbs,
} from "@/components/BreadcrumbJsonLd";
import { ContactForm } from "@/components/ContactForm";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Free Bathroom & Flooring Estimate in South Jersey",
  description:
    "Request a free estimate for bathroom remodeling or LVP, hardwood, and tile flooring from Foglio's — serving Cape May, Cumberland, Salem, Atlantic, and Gloucester counties.",
  path: "/estimate",
});

export default function EstimatePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={pageBreadcrumbs({ name: "Free estimate", path: "/estimate" })}
      />
      <section className="bg-[color:var(--sea-deep)] pb-16 pt-32 text-white">
        <div className="container-page">
          <p className="section-label !text-[color:var(--oak)]">Free estimate</p>
          <h1 className="font-display max-w-3xl text-5xl leading-tight tracking-tight md:text-6xl">
            Tell us about the space.
          </h1>
          <p className="mt-5 max-w-xl text-white/75">
            Send a short note about your bathroom or flooring project. Your
            message is delivered privately — no public email address on this
            site.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <ContactForm />
          <aside>
            <h2 className="font-display text-3xl">Service area</h2>
            <ul className="mt-5 space-y-2 text-[color:var(--slate)]">
              {siteConfig.serviceArea.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            {siteConfig.phone ? (
              <p className="mt-8">
                <a
                  href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
                  className="text-lg font-semibold text-[color:var(--ink)] hover:text-[color:var(--oak)]"
                >
                  {siteConfig.phone}
                </a>
              </p>
            ) : (
              <p className="mt-8 text-sm text-[color:var(--slate)]">
                Prefer a call? Phone number coming soon — the form is the
                fastest way to reach us right now.
              </p>
            )}
            <p className="mt-6 text-sm text-[color:var(--slate)]">
              Typical reply: within one to two business days, depending on job
              schedule.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
