# Foglio's Interiors & Remodeling

High-end marketing site + light owner dashboard for bathroom remodeling and flooring across South Jersey.

## Stack

- Next.js (App Router) on Vercel
- Tailwind CSS v4
- Vercel Blob for project photos + content JSON
- Password-protected `/admin` (no user accounts)
- Contact form via Resend → private `CONTACT_TO_EMAIL` (never shown publicly)
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
| `CONTACT_TO_EMAIL` | Where inquiries are delivered (private) |
| `RESEND_API_KEY` | Sends inquiry emails |
| `CONTACT_FROM_EMAIL` | Optional Resend from address |
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
   Or change nameservers to `ns1.vercel-dns.com` / `ns2.vercel-dns.com` (easier later for MX/email).

## Resend setup (contact form)

1. Create a free [Resend](https://resend.com) account
2. Add `RESEND_API_KEY` and `CONTACT_TO_EMAIL` in Vercel
3. Until a domain is verified, use `onboarding@resend.dev` as the from address (testing)
4. After domain + MX: verify the domain in Resend and set `CONTACT_FROM_EMAIL`

Without Resend configured, inquiries still succeed in the UI and are logged server-side (useful for local preview).

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
- Legacy positioning references the handyman/carpentry tradition without claiming identical entities
- License/insurance numbers intentionally left as confirm-with-owner placeholders
