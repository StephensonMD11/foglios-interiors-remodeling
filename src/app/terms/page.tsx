import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms of use for ${siteConfig.name}.`,
};

export default function TermsPage() {
  return (
    <section className="section pt-32">
      <div className="container-page prose-legal max-w-3xl">
        <h1 className="font-display text-5xl tracking-tight">Terms of Use</h1>
        <p className="text-sm text-[color:var(--slate)]">
          Last updated: August 15, 2026
        </p>
        <p>
          By using the {siteConfig.name} website, you agree to these terms.
          Please read them carefully.
        </p>
        <h2>Website purpose</h2>
        <p>
          This site provides information about our remodeling and flooring
          services and a way to request estimates. Content is for general
          information and does not constitute a binding contract, warranty, or
          professional advice until a written agreement is signed.
        </p>
        <h2>Estimates and proposals</h2>
        <p>
          Online inquiries and any proposals shared through this site are
          invitations to discuss work. Pricing, scope, and schedules are subject
          to site visit, material selection, and a signed agreement.
        </p>
        <h2>Intellectual property</h2>
        <p>
          Photos, text, logos, and design on this site belong to{" "}
          {siteConfig.name} or our licensors. You may not copy or reuse them
          without permission.
        </p>
        <h2>User submissions</h2>
        <p>
          When you send an inquiry, you confirm the information is accurate and
          that we may contact you about your project using the details you
          provide.
        </p>
        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, we are not liable for damages
          arising from use of this website or reliance on its content. New
          Jersey law governs these terms.
        </p>
        <h2>Changes</h2>
        <p>
          We may update these terms from time to time. Continued use of the site
          after changes means you accept the revised terms.
        </p>
        <h2>Contact</h2>
        <p>
          Questions about these terms can be sent through our{" "}
          <a href="/estimate">estimate form</a>.
        </p>
      </div>
    </section>
  );
}
