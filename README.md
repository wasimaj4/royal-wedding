# Royal Wedding Invitation

A luxury, Victorian-style wedding invitation website for **Wasim & Rayan**.

## Tech Stack
- **Next.js 15** (App Router)
- **Tailwind CSS** + custom CSS ornamental styles
- **Framer Motion** (slow, cinematic animations)
- **TypeScript**
- Bilingual: English & Arabic (RTL)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment (Vercel)

```bash
npm i -g vercel
vercel
```

Or connect the GitHub repo to Vercel for auto-deploy.

## Structure

```
src/
├── app/
│   ├── globals.css      # Global styles, parchment textures, gold frames
│   ├── layout.tsx        # Root layout with SEO meta tags
│   └── page.tsx          # Main app shell (envelope → invitation → RSVP)
├── components/
│   ├── EnvelopePage.tsx   # Page 1: Cinematic envelope opening
│   ├── InvitationPage.tsx # Page 2: Full invitation details
│   ├── RSVPPage.tsx       # Page 3: RSVP form
│   ├── CandleFlame.tsx    # Animated candle with SVG flame
│   ├── CountdownTimer.tsx # Elegant countdown to wedding date
│   ├── GoldOrnament.tsx   # Decorative SVG ornaments
│   └── LanguageSwitcher.tsx # EN | AR toggle
├── context/
│   └── LanguageContext.tsx  # i18n context with RTL support
└── lib/
    └── i18n.ts             # All translations (EN + AR)
```

## Color Palette

| Name           | HEX       |
|----------------|-----------|
| Antique White  | `#FAF0E6` |
| Parchment      | `#F5E6C8` |
| Gold           | `#D4AF37` |
| Gold Metallic  | `#CFB53B` |
| Gold Dark      | `#8B7536` |
| Candlelight    | `#FFD700` |
| Deep Brown     | `#3E2723` |

## Fonts

- **Script (EN names):** Great Vibes
- **Serif (EN headings):** Playfair Display
- **Body (EN):** Cormorant Garamond
- **Arabic (text):** Amiri
- **Arabic (decorative names):** Aref Ruqaa

## Customization

- **Google Maps links:** Update URLs in `InvitationPage.tsx`
- **Wedding date:** Update in `CountdownTimer` props and translations
- **Names:** Update in `src/lib/i18n.ts`
