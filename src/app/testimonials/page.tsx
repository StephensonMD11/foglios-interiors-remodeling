import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedTestimonials } from "@/lib/content";

export const metadata: Metadata = {
  title: "South Jersey Bathroom & Flooring Reviews",
  description:
    "Homeowner reviews of Foglio's Interiors & Remodeling — bathroom remodeling and flooring work across South Jersey.",
  alternates: { canonical: "/testimonials" },
};

export default async function TestimonialsPage() {
  const testimonials = await getPublishedTestimonials();

  return (
    <>
      <section className="bg-[color:var(--sea-deep)] pb-16 pt-32 text-white">
        <div className="container-page">
          <p className="section-label !text-[color:var(--oak)]">Reviews</p>
          <h1 className="font-display max-w-3xl text-5xl leading-tight tracking-tight md:text-6xl">
            What homeowners say.
          </h1>
          <p className="mt-5 max-w-xl text-white/75">
            Curated testimonials from completed projects. Google reviews can be
            linked here once the business profile is ready.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container-page grid gap-6 md:grid-cols-2">
          {testimonials.length ? (
            testimonials.map((t) => (
              <blockquote
                key={t.id}
                className="border border-[color:var(--line)] bg-white p-8"
              >
                <p className="font-display text-2xl leading-snug text-[color:var(--ink)]">
                  “{t.quote}”
                </p>
                <footer className="mt-6 text-sm font-semibold uppercase tracking-[0.12em] text-[color:var(--slate)]">
                  {t.name}
                  {t.projectTag ? (
                    <span className="mt-1 block font-medium normal-case tracking-normal text-[color:var(--oak)]">
                      {t.projectTag}
                    </span>
                  ) : null}
                </footer>
              </blockquote>
            ))
          ) : (
            <p className="text-[color:var(--slate)]">
              Testimonials will appear here once added from the owner dashboard.
            </p>
          )}
        </div>
        <div className="container-page mt-14 text-center">
          <Link href="/estimate" className="btn btn-primary">
            Start your project
          </Link>
        </div>
      </section>
    </>
  );
}
