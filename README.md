# Digital Niraj AI Marketing Consultation

A focused, mobile-first landing page for booking a free one-to-one AI marketing consultation. It includes a validated lead form, a simulated submission flow, and a matching Thank You page.

## Pages

- `/` — landing page and consultation form
- `/thank-you` — confirmation, next steps, and WhatsApp contact

## Local setup

Use Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production checks

```bash
npm run build
npm run vercel-build
```

The first command validates the Sites-compatible production build. The second validates the standard Next.js build used by Vercel.

## Deploy to Vercel

1. Push this project to a Git repository.
2. Import the repository at [vercel.com/new](https://vercel.com/new).
3. Vercel will detect Next.js automatically.
4. Keep the default install command and use `npm run vercel-build` as the build command if it is not selected automatically.
5. Deploy.

No environment variables or backend services are required. The form currently simulates success and redirects to `/thank-you`.

## Main files

- `app/page.tsx` — landing-page composition
- `app/thank-you/page.tsx` — confirmation page
- `app/layout.tsx` — SEO and social metadata
- `app/globals.css` — brand tokens and shared styling
- `components/CTAForm.tsx` — validation and redirect behavior
- `public/og.png` — social-sharing image
