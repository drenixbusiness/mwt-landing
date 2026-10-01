# MWT Transport — Driver Landing

One-page recruiting site for MWT Transport LLC (USDOT 4041419). Built with Next.js (App Router), TypeScript and Tailwind CSS v4.

## Run locally

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Production build:

```bash
npm run build
npm start
```

## Where things live

| Path | What |
| --- | --- |
| `app/page.tsx` | Page composition (section order) |
| `app/globals.css` | Design tokens, grid background, `bp` corner marks, buttons, fields |
| `app/api/apply/route.ts` | Application form endpoint (`POST /api/apply`) |
| `app/opengraph-image.tsx` | Generated 1200×630 social preview image |
| `components/` | `Nav`, `Hero`, `CompanyRecord`, `Positions`, `Benefits`, `HiringRoute`, `FAQ`, `ApplyForm`, `Footer`, `Blueprint`, `MobileBar` |
| `app/offer/page.tsx` | Owner-operator offer page (`/offer`): calculator, carrier comparison, lease-on checklist |
| `lib/offer.ts` | **Offer numbers** — dispatch %, weekly fixed costs, gross/RPM ranges. Replace the sample figures with real terms |
| `app/privacy`, `app/terms` | Privacy Policy and Terms & Conditions |
| `lib/site.ts` | Phone, address, USDOT — edit contact details here |
| `public/logo.png` | Logo (placeholder — replace with your own, square PNG) |

## Shareable estimates

On `/offer`, "Copy link to this estimate" produces a URL like `/offer?mi=4000&rpm=3&pay=200&fuel=1`. Opening it prefills the calculator — recruiters can send a driver their exact numbers.

## Receiving applications

With no configuration, applications are only printed to the server log. Copy `.env.example` to `.env.local` (or add the variables in Vercel → Project → Settings → Environment Variables) and set at least one channel:

- **Telegram** — `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`. Create a bot with @BotFather, add it to your group or message it, then get the chat id from `https://api.telegram.org/bot<TOKEN>/getUpdates`.
- **Email (Resend)** — `RESEND_API_KEY`, `APPLY_EMAIL_TO` (comma-separated), `APPLY_EMAIL_FROM` (an address on a domain verified in Resend).
- **Google Sheet / Zapier / Make** — `APPLY_WEBHOOK_URL`. The application is POSTed as JSON: `{ name, phone, email, state, position, experience, submittedAt }`. For Google Sheets, deploy an Apps Script web app whose `doPost(e)` appends `JSON.parse(e.postData.contents)` as a row.

If several channels are set, all of them are used; the form shows success when at least one delivery succeeds.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, **Add New → Project**, import the repo. The Next.js preset is detected automatically.
3. Add environment variables: `NEXT_PUBLIC_SITE_URL` (your final URL, e.g. `https://drive.mwttransport.com`) plus the delivery variables above.
4. Deploy. Add a custom domain under **Settings → Domains** if you have one, then update `NEXT_PUBLIC_SITE_URL` and redeploy.

Or from the command line:

```bash
npx vercel --prod
```
