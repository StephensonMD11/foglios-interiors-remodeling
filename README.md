# Foglio's Interiors & Remodeling

High-end marketing site + light owner dashboard for bathroom remodeling and flooring across South Jersey.

## Stack

- Next.js (App Router) on Vercel
- Tailwind CSS v4
- Vercel Blob for project photos + content JSON
- Password-protected `/admin` (no user accounts)
- Contact form via Resend (send-only) → private `CONTACT_TO_EMAIL` (never shown publicly)
- Proposal builder → shareable `/p/[id]` pages (print / save as PDF)

## Quick start

```bash
npm install
cp .env.example .env.local
# edit .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin](http://localhost:3000/admin).

Without `BLOB_READ_WRITE_TOKEN`, the site shows demo projects/testimonials and admin saves will error until Blob is connected.

## Environment variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for SEO |
| `ADMIN_PASSWORD` | Owner dashboard password |
| `SESSION_SECRET` | Signs admin session cookie |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob read/write |
| `CONTACT_TO_EMAIL` | Private human inbox for inquiries (default `Leonard3587@hotmail.com`) |
| `RESEND_API_KEY` | Sends inquiry emails |
| `CONTACT_FROM_EMAIL` | Verified Resend From (`noreply@fogliosinteriors.com`) |
| `INBOUND_BLAIR_FORWARD_TO` | Optional inbound forward target (default owner Hotmail) |
| `INBOUND_FORWARD_FROM` | Optional inbound From (defaults to verified `noreply@`) |
| `RESEND_WEBHOOK_SECRET` | Optional Resend inbound webhook signing secret |
| `NEXT_PUBLIC_PHONE` | Optional public phone |
| `NEXT_PUBLIC_INSTAGRAM` | Optional Instagram handle/URL |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Enables AdSense script when set |

## Deploy on Vercel

1. Push this repo to GitHub
2. Import in Vercel
3. Add env vars (especially `ADMIN_PASSWORD`, `SESSION_SECRET`, `CONTACT_TO_EMAIL`, `RESEND_API_KEY`, `BLOB_READ_WRITE_TOKEN`)
4. Create a Blob store in the Vercel project and link it
5. Deploy
6. Domain: `fogliosinteriors.com` (canonical `www.fogliosinteriors.com`). If DNS is still at GoDaddy, set:
   - `A` `@` → `76.76.21.21`
   - `CNAME` `www` → `7f579fcd7ce8de78.vercel-dns-017.com.`
   Or change nameservers to `ns1.vercel-dns.com` / `ns2.vercel-dns.com`.

## Email (Resend send-only + Microsoft 365)

- Apex MX stays Microsoft 365 / Outlook. **Never** point apex MX at Resend.
- Resend is transactional send only: contact form From is verified `noreply@fogliosinteriors.com` (DKIM on the Resend send subdomain).
- Human To for estimate/contact inquiries is `Leonard3587@hotmail.com` (`CONTACT_TO_EMAIL`). Do not use Proton or personal Gmail.
- After a successful owner notification, Resend also sends an automatic thank-you / confirmation to the submitter (reply-to is the Hotmail inbox). Ack failures are logged and do not fail the form.
- Optional `/api/resend/inbound` webhook still matches `blair@fogliosinteriors.com` and forwards to `Leonard3587@hotmail.com`. Because apex MX is Outlook, Resend will not receive apex mail unless Drew adds an `inbound.*` subdomain MX — never reclaim apex. Drew may instead forward M365 → Hotmail and leave this webhook unused.

Without `RESEND_API_KEY`, inquiries still succeed in the UI and are logged server-side (useful for local preview).

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Brand hero + services teaser + featured work |
| `/services` | Bathrooms + flooring |
| `/about` | Story + license/insurance placeholders |
| `/projects` | Gallery |
| `/testimonials` | Curated reviews |
| `/contact` | Social / connect |
| `/estimate` | Private inquiry form |
| `/privacy` `/terms` | Legal (AdSense-ready) |
| `/admin` | Projects, testimonials, proposals |
| `/p/[id]` | Client-facing proposal |

## Notes

- Distinct from Foglio's Flooring Center Inc. (separate family business)
- History/about may name Foglio's Handyman and Carpentry Services, LLC (father's prior company); current legal entity is Foglio and Sons Contracting LLC — do not conflate them
- License/insurance numbers intentionally left as confirm-with-owner placeholders
