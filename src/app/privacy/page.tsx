import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = {
  ...pageMetadata({
    title: "Privacy Policy",
    description: `Privacy policy for ${siteConfig.name}.`,
    path: "/privacy",
  }),
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <section className="section pt-32">
      <div className="container-page prose-legal max-w-3xl">
        <h1 className="font-display text-5xl tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-[color:var(--slate)]">
          Last updated: August 15, 2026
        </p>
        <p>
          {siteConfig.name} (&quot;we,&quot; &quot;us&quot;) respects your
          privacy. This policy explains what information we collect when you use
          our website and how we use it.
        </p>
        <h2>Information we collect</h2>
        <p>When you submit an inquiry form, we collect:</p>
        <ul>
          <li>Name, email address, and phone number (if provided)</li>
          <li>County, project type, and message content</li>
        </ul>
        <p>
          We may also collect standard technical data such as IP address,
          browser type, and pages visited through hosting analytics or
          advertising partners.
        </p>
        <h2>How we use information</h2>
        <ul>
          <li>To respond to project inquiries and provide estimates</li>
          <li>To improve the website and understand visitor interest</li>
          <li>
            To show relevant advertising if Google AdSense or similar services
            are enabled
          </li>
        </ul>
        <h2>Cookies and advertising</h2>
        <p>
          If Google AdSense or other advertising networks are enabled on this
          site, third parties may use cookies or similar technologies to serve
          ads based on your prior visits to this or other websites. You can
          opt out of personalized advertising through Google&apos;s Ads Settings
          and industry tools such as aboutads.info.
        </p>
        <h2>Email addresses</h2>
        <p>
          Our business contact email is not published on public pages. Inquiries
          are delivered through a secure form so that address is not harvested
          by spam bots.
        </p>
        <h2>Data retention</h2>
        <p>
          Inquiry messages are retained as long as needed to respond to your
          request and for ordinary business records, then deleted or archived
          according to our practices.
        </p>
        <h2>Children</h2>
        <p>
          This website is not directed to children under 13. We do not knowingly
          collect personal information from children.
        </p>
        <h2>Contact</h2>
        <p>
          Questions about this policy can be sent through our{" "}
          <a href="/estimate">estimate form</a>.
        </p>
      </div>
    </section>
  );
}
