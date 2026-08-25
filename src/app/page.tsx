import Image from "next/image";
import Link from "next/link";
import { ProjectGrid, ProjectsCta } from "@/components/ProjectGrid";
import { ServiceAreaTeaser } from "@/components/ServiceAreaSection";
import { getFeaturedProjects, getPublishedTestimonials } from "@/lib/content";
import { homeMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = homeMetadata();

export default async function HomePage() {
  const [projects, testimonials] = await Promise.all([
    getFeaturedProjects(),
    getPublishedTestimonials(),
  ]);

  return (
    <>
      <section className="relative min-h-[100svh] overflow-hidden bg-[color:var(--sea-deep)] text-white">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=2400&q=80"
            alt="South Jersey bathroom remodel with natural light and tile finishes"
            fill
            priority
            className="hero-media object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(15,26,34,0.88)_0%,rgba(15,26,34,0.55)_48%,rgba(15,26,34,0.25)_100%)]" />
        </div>

        <div className="container-page relative flex min-h-[100svh] flex-col justify-end pb-16 pt-32 md:justify-center md:pb-24">
          <p className="reveal section-label !text-[color:var(--oak)] !mb-5">
            South Jersey bathroom & flooring
          </p>
          <h1 className="reveal reveal-delay-1 font-display max-w-3xl text-[clamp(2.8rem,8vw,5.6rem)] leading-[0.95] tracking-tight">
            {siteConfig.name}
          </h1>
          <p className="reveal reveal-delay-2 mt-6 max-w-xl text-lg text-white/80 md:text-xl">
            Full bathroom remodels and flooring across South Jersey — from the
            subfloor up — finished with the care of a family craft tradition.
          </p>
          <div className="reveal reveal-delay-3 mt-10 flex flex-wrap gap-3">
            <Link href="/estimate" className="btn btn-primary">
              Request an estimate
            </Link>
            <Link href="/projects" className="btn btn-ghost">
              See recent work
            </Link>
          </div>
        </div>
      </section>

      <section className="section bg-[color:var(--cream)]">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="section-label">What we do</p>
            <h2 className="font-display text-4xl leading-tight tracking-tight md:text-5xl">
              Bathrooms built right. Floors that last.
            </h2>
          </div>
          <p className="max-w-2xl text-lg text-[color:var(--slate)]">
            Complete bathroom remodeling and flooring for shore towns and
            inland communities across {siteConfig.serviceAreaLabel}.
            Electricians and plumbers coordinated so the job finishes clean.
          </p>
        </div>

        <div className="container-page mt-14 grid gap-px bg-[color:var(--line)] md:grid-cols-2">
          <Link
            href="/services"
            className="group bg-[color:var(--cream)] p-8 transition hover:bg-white md:p-12"
          >
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--oak)]">
              Specialty
            </p>
            <h3 className="font-display mt-3 text-3xl">Bathroom remodeling</h3>
            <p className="mt-4 max-w-md text-[color:var(--slate)]">
              Demolition, subfloors, waterproofing, tile, drywall, fixtures, and
              finishes — a complete remodel, managed end to end.
            </p>
            <span className="mt-8 inline-block text-sm font-semibold uppercase tracking-[0.12em] text-[color:var(--ink)] group-hover:text-[color:var(--oak)]">
              Explore bathrooms →
            </span>
          </Link>
          <Link
            href="/services"
            className="group bg-[color:var(--cream)] p-8 transition hover:bg-white md:p-12"
          >
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--oak)]">
              Everywhere else
            </p>
            <h3 className="font-display mt-3 text-3xl">Flooring</h3>
            <p className="mt-4 max-w-md text-[color:var(--slate)]">
              Kitchens, living rooms, bedrooms, and hallways — installed with
              clean transitions and attention to the details you live with every
              day.
            </p>
            <span className="mt-8 inline-block text-sm font-semibold uppercase tracking-[0.12em] text-[color:var(--ink)] group-hover:text-[color:var(--oak)]">
              Explore flooring →
            </span>
          </Link>
        </div>
      </section>

      <section className="section bg-[color:var(--paper)]">
        <div className="container-page max-w-2xl">
          <p className="section-label">Service area</p>
          <h2 className="font-display text-4xl leading-tight md:text-5xl">
            Jersey Shore & inland South Jersey
          </h2>
          <ServiceAreaTeaser className="mt-5 text-lg leading-relaxed" />
        </div>
      </section>

      <section className="section bg-[color:var(--sea)] text-white">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="section-label !text-[color:var(--oak)]">Legacy</p>
            <h2 className="font-display text-4xl leading-tight md:text-5xl">
              Built on twenty years of family craftsmanship.
            </h2>
          </div>
          <div>
            <p className="text-lg leading-relaxed text-white/75">
              The Foglio name has been tied to careful home improvement in South
              Jersey for decades. Today, {siteConfig.shortName} Interiors &amp;
              Remodeling carries that standard forward — focused on bathrooms and
              flooring, with the same reliability and quality homeowners expect.
            </p>
            <Link href="/about" className="btn btn-ghost mt-8">
              Our story
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <p className="section-label">Selected work</p>
          <h2 className="font-display max-w-2xl text-4xl leading-tight md:text-5xl">
            Recent projects
          </h2>
          <div className="mt-12">
            <ProjectGrid projects={projects} compact />
          </div>
          <ProjectsCta />
        </div>
      </section>

      {testimonials[0] ? (
        <section className="section bg-[color:var(--paper)]">
          <div className="container-page max-w-3xl text-center">
            <p className="section-label">Homeowners</p>
            <blockquote className="font-display text-3xl leading-snug tracking-tight text-[color:var(--ink)] md:text-4xl">
              “{testimonials[0].quote}”
            </blockquote>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--slate)]">
              — {testimonials[0].name}
            </p>
            <Link href="/testimonials" className="btn btn-dark mt-10">
              More reviews
            </Link>
          </div>
        </section>
      ) : null}
    </>
  );
}
