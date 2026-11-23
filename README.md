# ISOE Interiors — website

Editorial website for **ISOE Interiors** (I/I), an interior architecture and design studio.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS v4 · Framer Motion · React Router · React Hook Form + Zod · Lenis · Firebase (free Spark plan)

```bash
npm install
npm run dev            # http://localhost:5173
npm run build          # production build → dist/ (+ sitemap.xml)
npm run build:preview  # single self-contained HTML preview → dist-preview/index.html
npm run typecheck
npm run lint
```

## What's in it

| Route | Page |
| --- | --- |
| `/` | Home: hero, studio, services index, collections rail, portfolio, before/after slider, style finder, moodboard builder, budget estimator, site-visit CTA, testimonials, Instagram, footer |
| `/designs` | All 8 design collections, filterable by space |
| `/designs/:slug` | Concept detail: story, colour palette, materials, imagery, key pieces, **Request This Design** |
| `/services` | Residential, commercial, hospitality, kitchens, bedrooms, living spaces, renovation, space planning |
| `/projects` | Sample case studies |
| `/book-a-site-visit` | Site visit / consultation form (`?type=consultation`, `?design=slug`, `?moodboard=…`, `?estimate=…` prefill it) |
| `/privacy` | Draft privacy notice |
| `/studio/inquiries` | Studio-only inquiry inbox (Firebase Auth) |

## Things to replace before launch

All of these are clearly marked placeholders — nothing was invented.

1. **Contact details, WhatsApp number, address, hours, Instagram** → `src/config/site.ts`. The footer, booking page, WhatsApp button and structured data pick them up automatically.
2. **Imagery** → the site currently uses illustrated, on-palette room renders (`src/components/art/RoomScene.tsx`). To use real photography, pass `src` (and ideally `srcSet`/`sizes`) to `<Artwork />`; it renders a lazy-loaded, async-decoded `<img>` instead. Serve WebP/AVIF at 2–3 widths.
3. **Testimonials** → `src/data/testimonials.ts` (empty on purpose; add real quotes with permission).
4. **Projects** → `src/data/projects.ts` contains illustrative sample case studies; replace with real work.
5. **Budget rates & currency** → `src/data/budget.ts` rates are placeholders; currency is in `src/config/site.ts`.
6. **Domain** → set `VITE_SITE_URL` (canonical URLs, sitemap, robots).
7. **Privacy notice** → `src/pages/Privacy.tsx` is a draft; have it reviewed.

## Firebase (free Spark plan)

Copy `.env.example` → `.env` and fill in the web-app config. Without it the site runs in **preview mode**: forms validate and show a success state, but nothing is sent.

| Feature | Firebase product | Plan |
| --- | --- | --- |
| Hosting with SPA rewrites, caching & security headers (CSP, HSTS…) | Hosting — `firebase.json` | Free |
| Store site-visit & consultation inquiries | Cloud Firestore — `firestore.rules` | Free (1 GiB, 20k writes/day) |
| Photo uploads | Firestore: resized in-browser to ≤ ~640 KB JPEG (EXIF/GPS stripped) | Free |
| Studio inbox login | Authentication (email/password) | Free |
| Bot protection | App Check with reCAPTCHA v3 | Free |
| Visitor analytics (after cookie consent only) | Google Analytics for Firebase | Free |
| Full-resolution photo uploads (`VITE_PHOTO_UPLOAD_MODE=storage`) | Cloud Storage — `storage.rules` | **Needs Blaze** |
| Email/SMS notification on each new inquiry | Cloud Functions or the Trigger Email extension | **Needs Blaze** |

> Cloud Storage buckets and Cloud Functions are not available on the Spark plan, so the default setup keeps everything in Firestore and staff check new inquiries in `/studio/inquiries`. If instant email alerts are wanted while staying free, a third-party form/email service (e.g. EmailJS, Formspree) can be called from `submitInquiry()` in `src/lib/inquiries.ts`.

### Setup

1. Create a project at console.firebase.google.com, add a **Web app**, copy its config into `.env`.
2. **Firestore** → create database (production mode).
3. **Authentication** → enable *Email/Password*; add a user for each staff member.
4. **Make them admins**: in Firestore create a document `admins/{that user's UID}` (any field, e.g. `name`). Only these users can read inquiries.
5. **App Check** → register the web app with reCAPTCHA v3, put the site key in `VITE_FIREBASE_APPCHECK_SITE_KEY`, then *Enforce* for Firestore.
6. **Analytics** (optional) → enable; set `VITE_FIREBASE_MEASUREMENT_ID`. A consent banner appears automatically.
7. Deploy:
   ```bash
   npm i -g firebase-tools
   firebase login
   firebase use --add            # pick your project (updates .firebaserc)
   npm run build
   firebase deploy --only hosting,firestore:rules
   ```

### How inquiries are protected

* Client: Zod validation, honeypot field, minimum fill time, soft rate limit, input sanitising, image type/size checks, EXIF stripping.
* Server (`firestore.rules`): create-only for the public with an exact field allow-list, type and length checks, `status == 'new'`, server timestamp; photos only within 15 minutes of their inquiry and ≤ 900 KB; read/update/delete only for admins; everything else denied.
* App Check (when enforced) blocks requests that don't come from this site.

## Architecture

```
src/
  config/site.ts        studio details (placeholders), navigation
  data/                 concepts, services, projects, quiz, budget, moodboard, testimonials
  components/
    art/                RoomScene + MaterialSwatch (illustrated placeholder imagery)
    brand/              I/I monogram + wordmark
    layout/             Header, Footer, Layout, smooth scroll, cursor, WhatsApp, consent
    sections/           homepage sections
    tools/              StyleFinder, MoodboardBuilder, BudgetEstimator
    forms/              SiteVisitForm
    ui/                 Button, Artwork, Reveal, SectionHeading, PageHero, Seo
  lib/                  firebase, inquiries, image compression, whatsapp, storage, colour
  pages/                route components (lazy-loaded except Home)
```

**Motion & accessibility:** reveal animations, smooth scroll (desktop pointers only) and the custom cursor (fine pointers only) are all disabled for `prefers-reduced-motion`. Skip link, labelled landmarks, keyboard-operable slider/tabs/menus, visible focus, form errors announced and linked with `aria-describedby`.

**SEO:** per-page `<title>`, description, canonical and Open Graph tags (React 19 metadata), `InteriorDesigner` JSON-LD, `sitemap.xml`, `robots.txt`. For best crawlability on launch, consider pre-rendering the routes (e.g. `vite-react-ssg`) — client-rendered pages are indexed by Google but not by every crawler.
