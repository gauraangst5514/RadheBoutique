# Radhe Boutique: online store

Website for Radhe Boutique, Nashik: anti-tarnish jewellery, Kashmiri earrings, hasli sets and branded kurtis.

**Stack:** Next.js 15 (App Router, TypeScript, Tailwind 4) · Three.js hero · MediaPipe live try-on · Supabase (database + photo storage) · Razorpay · WhatsApp ordering.

## What works today

**Storefront**
- **Homepage hero:** while the Korean Earrings launch is on, a tilted, endlessly scrolling wall of their photos (`src/components/hero/KoreanHero.tsx`). The original 3D slideshow (`Hero.tsx` + `stage.ts`) comes back by itself when there are fewer than 6 Korean earrings.
- **Empty categories** show an animated "Ye sab shop pe milega" panel that sends people to the shop, Instagram or WhatsApp (`src/components/InStoreOnly.tsx`).
- **On the reels:** the shop's 5 most-viewed Instagram reels, set in `topReels` in `src/config/store.ts`.
- Home, shop-by-category, product pages with per-colour/size stock ("Only 2 left", "Sold out"), and "Notify me on WhatsApp" for sold-out variants.
- **Live try-on** (`/try-on/<product>`): the phone's camera plus MediaPipe face tracking pin earrings to the earlobes (with a little swing) or a necklace under the chin. It runs fully in the browser and the video never leaves the phone. Shoppers can switch colours, save or share a photo, and add to cart. The camera only works on HTTPS or localhost.
- Cart with the **3 kurtis for ₹999** combo applied automatically (`src/config/store.ts` → `bundles`).
- Checkout: **Order on WhatsApp** (opens WhatsApp with the full order typed out). **Razorpay** (UPI/cards) is built but switched off until it is set up: set `onlinePayments: true` in `src/config/store.ts` once the keys are in and a test order works. Cash on delivery is off, and the server refuses COD orders.
- The server re-prices every order and takes stock atomically, so two people can't buy the last piece.

**Admin (`/admin`, phone-first)**
- **Orders:** pack, ship, deliver and cancel (cancelling puts stock back). Confirming a WhatsApp order takes its stock.
- **Add product** in 4 steps: take photos, enter the price, pick a category, add colours/sizes with **online stock**, then review the AI draft and publish.
- **Products:** change the price and the stock, hide a product or feature it on the homepage.
- **Restock alerts:** see who asked to be told when a piece is back, and message them with one tap.

**Photo pipeline** (each part switches on when its key is set)
- `REMOVE_BG_API_KEY`: cuts the product out of the background. The site shows cut-outs on brand pink as the studio shot. The jewellery itself is never redrawn.
- `ANTHROPIC_API_KEY`: drafts the name, a Hinglish description and tags from the first photo.
- **Try-on image:** when a product has a try-on type (earrings or necklace), its first photo's cut-out becomes the try-on image. For earrings, make that first photo **one earring**, front-on, laid flat on a plain background. Products without a cut-out simply don't show the Try-on button.
- The sample earrings and hasli use 3D look-alike PNGs (`public/tryon/`, rendered from the hero models), and the try-on screen labels them as look-alikes.

Online stock is separate from the shop counter. Every variant has a SKU so the billing software can be connected later.

## Korean Earrings (added 20 Nov 2026)

- Category `korean-earrings`, first in the menu: 50 best-sellers from the supplier jewellerywholesalersindia.com, in `src/data/korean-earrings.ts`.
- **Price rule:** 2 × supplier price per pair, rounded **up** to the next number ending in 9 (₹37 → ₹79). Each product's comment holds the supplier cost and link.
- SKUs are `KE-<supplier code>`. Stock is 6 each (one supplier pack). The top 8 are featured.
- Photos load from the supplier's CDN (`cdn.shopify.com`) for now.
- **The shop's own products are hidden, not deleted.** Demo mode: set `HIDE_SHOP_PRODUCTS = false` in `src/data/seed.ts`. Supabase: Admin → Products, or `update products set active = true where category <> 'korean-earrings';`.
- An existing Supabase database: run `supabase/korean-earrings.sql` once. A new one gets everything from `schema.sql` + `seed.sql`.

## Run it locally

```bash
npm install
cp .env.example .env.local   # optional at first
npm run dev                  # http://localhost:3000
```

With no Supabase keys the site runs in **demo mode**. It uses the sample catalogue and saves orders to `.data/db.json`. In dev the admin password is `admin`.

## Go live

> **Supabase is required in production.** Without it the site falls back to demo mode, which saves orders to a local file, and that doesn't work on Vercel.

1. **Supabase:** create a project. In the SQL editor, run `supabase/schema.sql` and then `supabase/seed.sql` (the sample catalogue; delete it later if you like). Put the Project URL and the service-role key in `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
2. **Admin:** set `ADMIN_PASSWORD` and a long random `ADMIN_SECRET`.
3. **Razorpay:** start with test keys in `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`. Add a webhook at `https://<domain>/api/payments/webhook` for the events `payment.captured` and `order.paid`, with the secret in `RAZORPAY_WEBHOOK_SECRET`. Switch to live keys once a test order works end to end.
4. **Deploy** to Vercel and add the env vars. Set `NEXT_PUBLIC_SITE_URL` to the real domain.
5. **Fill in the shop's decisions** in `src/config/store.ts`: shipping fee or free-shipping threshold. Write the return policy in `src/app/(store)/help/page.tsx`.

## Before launch: to confirm
- Prices marked `TODO confirm price` in `src/data/seed.ts` (the clover pendant, stone bracelet and kurti). The other prices come from the shop's reels.
- The sample photos are low-resolution crops from Instagram reels. Replace them with real photos through **Admin → Add product**.

## Try-on notes
- The face model loads from Google's MediaPipe storage by default. To self-host it, download `face_landmarker.task` from Google's MediaPipe models page, put it in `public/mediapipe/`, and set `NEXT_PUBLIC_FACE_MODEL_URL=/mediapipe/face_landmarker.task`.
- The WebAssembly runtime is copied into `public/mediapipe/wasm` by `npm install` (postinstall).
- Placement tuning (earlobe position, sizes, swing) lives in `src/components/tryon/engine.ts`.

## Next up
- Ring try-on (hand tracking).
- A 3D showroom page, and proper `.glb` models for the hero pieces.
- Connecting the billing software, using the SKUs.

## Project map
```
src/app/(store)/      storefront pages (home, shop, product, cart, checkout, order, help)
src/app/admin/        admin pages
src/app/api/          orders, payments, restock, admin APIs
src/components/hero/  3D hero (Hero.tsx + stage.ts)
src/config/store.ts   shop settings, categories, combos
src/lib/db/           data layer (supabase.ts for live, local.ts for demo)
src/lib/pipeline.ts   background removal + AI listing drafts
supabase/             schema.sql, seed.sql
```
