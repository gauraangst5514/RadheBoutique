# 📑 Radhe Boutique - Complete File Index

## 🏁 Start Here
- **START_HERE.md** - Quick start guide (read this first!)
- **README.md** - Complete project documentation
- **package.json** - Dependencies and scripts

## 📖 Documentation (Read in Order)
1. **START_HERE.md** - 5-minute quick start
2. **INSTALLATION.md** - Detailed setup instructions
3. **QUICKSTART.md** - Developer quick reference
4. **PROJECT_STATUS.md** - Implementation details
5. **PRODUCTION_CHECKLIST.md** - Pre-launch checklist
6. **DEPLOY.md** - Production deployment guide
7. **PROJECT_COMPLETE.md** - Final summary
8. **INDEX.md** - This file

## ⚙️ Configuration Files
- `package.json` - Dependencies, scripts
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS setup
- `next.config.ts` - Next.js configuration
- `postcss.config.mjs` - PostCSS configuration
- `.env.example` - Environment variables template
- `.gitignore` - Git ignore rules
- `middleware.ts` - Route protection

## 🎨 Styling
- `app/globals.css` - Global styles, design tokens
- `tailwind.config.ts` - Tailwind customization

## 📦 Database Models (`models/`)
- `User.ts` - User authentication & profiles
- `Product.ts` - Product catalog
- `Category.ts` - Product categories
- `Order.ts` - Order management
- `Review.ts` - Product reviews
- `Coupon.ts` - Discount coupons

## 🔧 Utilities (`lib/`)
- `db.ts` - MongoDB connection
- `auth.ts` - NextAuth configuration
- `utils.ts` - Helper functions
- `validations.ts` - Zod schemas
- `cloudinary.ts` - Image upload
- `razorpay.ts` - Payment processing
- `email.ts` - Email templates

## 🎯 Types (`types/`)
- `index.ts` - All TypeScript interfaces

## 💾 State Management (`store/`)
- `cartStore.ts` - Shopping cart with Zustand
- `wishlistStore.ts` - Wishlist with Zustand

## 🧩 UI Components (`components/ui/`)
- `Button.tsx` - Button variants
- `Input.tsx` - Input field
- `Badge.tsx` - Status badges
- `Skeleton.tsx` - Loading skeleton
- `Modal.tsx` - Modal dialog

## 🏗️ Layout Components (`components/layout/`)
- `Navbar.tsx` - Main navigation (scroll effect)
- `Footer.tsx` - Site footer
- `WhatsAppButton.tsx` - Floating WhatsApp button

## 🛍️ Shop Components (`components/shop/`)
- `ProductCard.tsx` - Product display card
- `AddToCartButton.tsx` - Add to cart action
- `WishlistButton.tsx` - Wishlist toggle

## 📄 Pages

### Public (`app/(store)/`)
- `app/page.tsx` - Home page
- `shop/page.tsx` - Product listing
- `shop/[slug]/page.tsx` - Product detail
- `cart/page.tsx` - Shopping cart
- `wishlist/page.tsx` - Wishlist
- `collections/page.tsx` - Collections
- `about/page.tsx` - About us
- `contact/page.tsx` - Contact info
- `search/page.tsx` - Search

### Auth (`app/(auth)/`)
- `login/page.tsx` - User login
- `register/page.tsx` - User registration
- `forgot-password/page.tsx` - Password reset request
- `reset-password/page.tsx` - Password reset form

### Account (`app/(account)/account/`)
- `page.tsx` - Account dashboard
- `orders/page.tsx` - Order history
- `orders/[id]/page.tsx` - Order detail
- `profile/page.tsx` - Profile edit
- `addresses/page.tsx` - Address management

### Admin (`app/(admin)/admin/`)
- `page.tsx` - Admin dashboard
- `products/page.tsx` - Products list
- `products/new/page.tsx` - Add product
- `products/[id]/edit/page.tsx` - Edit product
- `orders/page.tsx` - Orders management
- `orders/[id]/page.tsx` - Order detail
- `categories/page.tsx` - Categories management
- `users/page.tsx` - Users management
- `coupons/page.tsx` - Coupons management
- `settings/page.tsx` - Settings

## 🔌 API Routes (`app/api/`)

### Auth
- `auth/[...nextauth]/route.ts` - NextAuth handler
- `auth/register/route.ts` - User registration

### Products
- `products/route.ts` - GET (list), POST (create)
- `products/[id]/route.ts` - GET, PUT, DELETE
- `products/[id]/reviews/route.ts` - Reviews

### Categories
- `categories/route.ts` - GET, POST
- `categories/[id]/route.ts` - GET, PUT, DELETE

### Orders
- `orders/route.ts` - GET, POST
- `orders/[id]/route.ts` - GET
- `orders/[id]/status/route.ts` - PUT

### Coupons
- `coupons/route.ts` - CRUD operations
- `coupons/validate/route.ts` - Validate coupon

### Payment
- `razorpay/create-order/route.ts` - Create payment
- `razorpay/webhook/route.ts` - Payment webhook

### Admin
- `admin/stats/route.ts` - Dashboard statistics
- `admin/revenue/route.ts` - Revenue data

### Utilities
- `upload/route.ts` - Image upload
- `cart/route.ts` - Cart operations
- `wishlist/route.ts` - Wishlist operations
- `users/route.ts` - User operations
- `users/[id]/route.ts` - User detail

## 🗂️ Scripts (`scripts/`)
- `seed.ts` - Database seeding
- `setup.sh` - Installation script

## 📊 Project Statistics

- **Total Files:** 60+
- **Lines of Code:** ~3000+
- **TypeScript Coverage:** 100%
- **Components:** 20+
- **Pages:** 25+
- **API Routes:** 15+
- **Documentation:** 9 files

## 🎯 Key Features by File

### Authentication Flow
1. `app/(auth)/login/page.tsx` - User enters credentials
2. `lib/auth.ts` - NextAuth validates
3. `models/User.ts` - Database check
4. `middleware.ts` - Protects routes

### Product Browsing
1. `app/(store)/shop/page.tsx` - Lists products
2. `components/shop/ProductCard.tsx` - Displays card
3. `app/(store)/shop/[slug]/page.tsx` - Shows details
4. `app/api/products/route.ts` - Fetches data
5. `models/Product.ts` - Database schema

### Shopping Cart
1. `store/cartStore.ts` - Cart state
2. `components/shop/AddToCartButton.tsx` - Add action
3. `app/(store)/cart/page.tsx` - Cart view
4. `app/(checkout)/checkout/page.tsx` - Checkout

### Admin Management
1. `app/(admin)/admin/page.tsx` - Dashboard
2. `app/(admin)/admin/products/page.tsx` - Products list
3. `app/api/products/route.ts` - CRUD operations
4. `middleware.ts` - Admin protection

## 🔍 Finding What You Need

### "I want to..."

**Add a new page**
→ Create in `app/(store)/` or other route group

**Modify styles**
→ Edit `app/globals.css` or `tailwind.config.ts`

**Change colors**
→ Edit CSS variables in `app/globals.css`

**Add API endpoint**
→ Create in `app/api/`

**Update database schema**
→ Modify models in `models/`

**Change business info**
→ Update `.env` file

**Add component**
→ Create in `components/`

**Fix authentication**
→ Check `lib/auth.ts` and `middleware.ts`

**Update email templates**
→ Edit `lib/email.ts`

## 🚀 Common Tasks

### Run Development
```bash
npm run dev
```
Uses: package.json scripts

### Seed Database
```bash
npm run seed
```
Uses: scripts/seed.ts

### Deploy
```bash
vercel --prod
```
See: DEPLOY.md

### Add Product
1. Login to /admin
2. Navigate to Products
3. Click "Add Product"

Uses: app/(admin)/admin/products/

## 📦 Dependencies Overview

### Core
- next@14.1.0 - Framework
- react@18 - UI library
- typescript@5 - Type safety

### Database
- mongoose@8.1.1 - MongoDB ODM
- mongodb - Database driver

### Authentication
- next-auth@5.0.0-beta.4 - Auth system
- bcryptjs@2.4.3 - Password hashing

### UI & Styling
- tailwindcss@3.3.0 - CSS framework
- framer-motion@11.0.5 - Animations
- lucide-react@0.344.0 - Icons

### State
- zustand@4.5.0 - State management

### Forms & Validation
- react-hook-form@7.50.1 - Forms
- zod@3.22.4 - Validation

### Services
- cloudinary@2.0.3 - Image storage
- razorpay@2.9.2 - Payments
- resend@3.2.0 - Emails

### Utils
- react-hot-toast@2.4.1 - Notifications
- recharts@2.12.0 - Charts

## 🎓 Learning Path

1. Read START_HERE.md
2. Browse app/page.tsx (home)
3. Check app/(store)/shop/page.tsx
4. Review components/shop/ProductCard.tsx
5. Look at store/cartStore.ts
6. Explore app/api/products/route.ts
7. Read models/Product.ts
8. Review lib/auth.ts

## 💡 Pro Tips

- All pages use Server Components by default
- Client Components marked with "use client"
- API routes are serverless functions
- Middleware runs on edge runtime
- Images auto-optimized with next/image
- Styles use Tailwind + CSS variables
- State persists in localStorage
- Database connections pooled

---

**Complete Project Index** | Radhe Boutique
*Crafted for Eternity* ✨💎
