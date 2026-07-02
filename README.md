# Eagle Logistics & Relocations — Website

Production-ready marketing website for **Eagle Logistics & Relocations**, a New Delhi-based logistics and relocation startup focused on:

- Domestic relocation across India
- International relocation
- India ↔ UAE logistics (our core specialisation)
- Household shifting
- Freight forwarding — sea & air
- Customs clearance & import/export documentation support
- Door-to-door logistics coordination

Shipment tracking is intentionally **not** included in this release — it will be integrated in a future phase.

## Project Structure

```
.
├── index.html                          Home
├── pages/
│   ├── about.html                      About Us
│   ├── services.html                   Services (Domestic, India-UAE, International, Household, Freight, Customs, Door-to-Door)
│   ├── contact.html                    Contact / quote request form
│   ├── privacy.html                    Privacy Policy
│   └── terms.html                      Terms & Conditions
├── css/
│   └── style.css                       Design tokens, layout, components (single stylesheet)
├── js/
│   ├── load-components.js              Single source of truth for header + footer (injected into every page)
│   └── main.js                         Scroll reveal, counters, back-to-top, newsletter, contact form
├── assets/
│   ├── images/                         Logo, hero/service illustrations, OG share image
│   └── icons/                          Favicons & app icons (svg/png/ico)
├── sitemap.xml
├── robots.txt
├── site.webmanifest
├── vercel.json
└── package.json
```

`index.html` lives at the project root; every other page lives inside `/pages/`. All internal links and asset paths (in `js/load-components.js` and in each page's own `<head>`/`<img>` tags) are written relative to each page's actual depth, so `index.html` uses paths like `pages/about.html` and `assets/images/...`, while every page inside `/pages/` uses `../assets/images/...`, `../css/style.css`, and so on back up to the root. This has been verified end-to-end — there are no 404s anywhere in the site.

> Note: The header and footer markup live in **one place only** — `js/load-components.js` — as JS string templates (`HEADER_HTML` / `FOOTER_HTML`). Every page just has `<div id="header-placeholder"></div>` and `<div id="footer-placeholder"></div>`, which this script replaces on load. To change the nav, footer links, address, or socials, edit `js/load-components.js` — editing the HTML pages directly won't have any effect on the header/footer. The script also contains a `_page()` helper and a `PAGE_PATHS` map that automatically resolves the correct relative path to every page from any depth — so all nav/footer links keep working even if pages are moved into further subfolders later.

## Company Details Currently Used on the Site

- **Address:** Add-A-254, Chungi No 2, Lalkuan, Pul Prahalapur, New Delhi, India
- **Phone:** +91 96963 01338
- **Email:** tiwarisangam5163@gmail.com

These appear consistently in the header, footer, contact page, and the structured data (JSON-LD) block on the homepage.

## About the Images

This project doesn't have internet access to source licensed stock photography, so every image currently in `assets/images/` is a **custom-drawn, brand-consistent illustration** (navy/gold gradient backgrounds with simple flat iconography — a truck, plane, ship, home, document, etc.), generated specifically for this build. They are real image files (not placeholders/broken links), properly sized, and wired into the HTML with correct `width`/`height`, `alt` text and `loading="lazy"` (or `eager` for the hero).

They look clean and professional, but you will likely want to replace them with real photography for the strongest result. To swap an image, **keep the exact same filename and folder path** (or update the `src` if you rename it) and use an image with a similar aspect ratio so the responsive `object-fit: cover` cropping continues to look right.

| File | Used On | Recommended real photo | Aspect ratio |
|---|---|---|---|
| `assets/images/hero-india-uae-route.webp` | Home hero | A loaded cargo ship, an aircraft, or a packed moving truck — something that reads "India ⇄ UAE" at a glance | 4:3 |
| `assets/images/service-domestic-relocation.webp` | Home services grid | Movers carrying boxes / a loaded relocation truck in an Indian city | 16:10 |
| `assets/images/service-india-uae.webp` | Home services grid | A container ship or port, ideally with visible containers | 16:10 |
| `assets/images/service-household-shifting.webp` | Home services grid | Packing boxes, bubble wrap, furniture being wrapped | 16:10 |
| `assets/images/service-freight-forwarding.webp` | Home services grid | Stacked cargo/pallets or an aircraft cargo hold | 16:10 |
| `assets/images/service-customs-clearance.webp` | Home services grid | Paperwork, customs forms, a clipboard/checklist | 16:10 |
| `assets/images/service-international-relocation.webp` | Home services grid | An airport/airplane scene suggesting international travel | 16:10 |
| `assets/images/row-domestic-relocation.webp` | Services page | Same theme as above, larger crop | 4:3 |
| `assets/images/row-india-uae-corridor.webp` | Services page | Port/ship scene | 4:3 |
| `assets/images/row-international-relocation.webp` | Services page | Airport/airplane scene | 4:3 |
| `assets/images/row-household-shifting.webp` | Services page | Packing/moving scene | 4:3 |
| `assets/images/row-freight-forwarding.webp` | Services page | Cargo/freight scene | 4:3 |
| `assets/images/row-customs-documentation.webp` | Services page | Documentation/paperwork scene | 4:3 |
| `assets/images/row-door-to-door.webp` | Services page | Delivery handover / warehouse dock scene | 4:3 |
| `assets/images/about-our-story.webp` | About page | Office/team or cargo scene | 4:3 (1200×1000) |
| `assets/images/about-mission.webp` | About page | Port/shipping scene | 4:3 (1200×1000) |
| `assets/images/og-cover.jpg` | Social share previews (WhatsApp, LinkedIn, etc.) | Can stay as the branded graphic, or be replaced with a hero photo + logo overlay | 1200×630 |

All images are referenced with relative paths from the project root (e.g. `assets/images/...`), so they will work correctly on GitHub Pages, Vercel, or any static host without changes.

### Image Format Strategy

- **On-page images** (hero, service cards, about page) are served as **`.webp`** — roughly 50–65% smaller than the original JPGs with no visible quality loss, which speeds up page load and Core Web Vitals.
- **`og-cover.jpg`** (the social share preview image used in `og:image` / `twitter:image` / JSON-LD) is intentionally kept as a **`.jpg`**, not `.webp`. Several social crawlers (notably LinkedIn's) don't reliably render WebP share images, so this one file stays JPG to guarantee link previews never break on any platform.
- **The company logo** (header + footer) is served as **`.png`** (`logo.png` / `logo-light.png`), generated from the original `logo.svg` / `logo-light.svg` source files (kept alongside for future edits). PNG was chosen over SVG here for guaranteed pixel-perfect, consistent rendering in the `<img>` tag and structured data across all browsers/crawlers.

## Local Development

No build step is required — this is a static site.

```bash
npx serve .
# or simply open index.html in a browser
```

## Deploying to Vercel

1. Push this project to a GitHub repository.
2. Import the repository in Vercel ([vercel.com/new](https://vercel.com/new)).
3. Framework preset: **Other** (static site). No build command or output directory needed — Vercel will serve the root.
4. Deploy.

`vercel.json` is preconfigured with clean URLs and long-term caching for `assets/`, `css/` and `js/`.

## Before Going Live

- **Domain:** The site currently uses `https://www.slcinfo.in/` as a placeholder domain in canonical URLs, Open Graph tags, `sitemap.xml`, `robots.txt` and the structured data block in `index.html`. Update this once your real domain is confirmed.
- **Social links:** The footer and contact page link to generic `linkedin.com`, `twitter.com` and `facebook.com` placeholders — update with your real profile URLs, or remove the icons if you don't have business profiles yet.
- **Images:** See the table above — swap in real photography when available.
- **Map embed:** `contact.html` embeds a Google Maps view centred on Lalkuan, New Delhi. For a pinpoint-accurate marker, generate an embed URL from Google Maps for your exact address and replace the `iframe` `src`.

## SEO Included

- Unique `<title>` and meta description per page, focused on India ↔ UAE relocation and freight
- Open Graph + Twitter Card tags with a generated social share image (`assets/images/og-cover.jpg`)
- Canonical URLs
- `sitemap.xml` and `robots.txt`
- `MovingCompany` JSON-LD structured data on the homepage, with the real business address, phone and email
- Semantic HTML, descriptive alt text, and a logical heading hierarchy

## Accessibility & Performance Notes

- Skip-to-content link, visible focus states, and `aria-current` on active nav links
- `prefers-reduced-motion` respected for all animation
- Mobile-first responsive layout (tested down to ~360px width)
- All images use explicit `width`/`height` attributes (prevents layout shift) and `object-fit: cover` inside fixed-aspect-ratio containers, so they crop gracefully on any screen size
- Google Fonts loaded with `preconnect` for faster first paint

## Contact Form

The contact form (`contact.html`) includes full client-side validation and a polished submit/success state, but is **frontend-only** — wire the `fetch`/`submit` handler in `js/main.js` (`initContactForm`) to your backend, a form service (e.g. Formspree, Getform), or a serverless function to receive submissions at `tiwarisangam5163@gmail.com` or your preferred inbox.

## Content Notes

This revision intentionally avoids unverifiable claims (years in business, fabricated leadership bios, made-up certifications, invented client testimonials). Copy on the About and Home pages describes Eagle Logistics & Relocations as a focused startup specialising in the India–UAE corridor, without overstating company history or scale. Update this copy as the business grows and you have real milestones, team bios, and client stories to share.
