# Radhe Boutique - Luxury Jewellery E-Commerce

A complete, production-ready luxury jewellery e-commerce website built with Next.js 14 App Router, featuring a beautiful editorial design, full admin panel, and integrated payment processing.

## ✨ Features

### Frontend
- 🎨 **Luxury Editorial Design** - Champagne gold accents on obsidian black
- 📱 **Fully Responsive** - Mobile-first design that works on all devices
- 🎭 **Smooth Animations** - Framer Motion transitions and effects
- 🛒 **Shopping Cart & Wishlist** - Persistent with Zustand
- 🔍 **Advanced Filtering** - By category, metal, stone, price range
- ⭐ **Product Reviews** - Verified purchase reviews with ratings
- 💳 **Razorpay Integration** - Secure payment processing
- 🎁 **Coupon System** - Percentage and flat discounts

### Admin Panel
- 📊 **Analytics Dashboard** - Revenue charts, stats, and insights
- 📦 **Product Management** - Full CRUD with image uploads
- 📋 **Order Management** - Status updates, tracking numbers
- 👥 **User Management** - View and manage customers
- 🎫 **Coupon Management** - Create and track discount codes
- 🏷️ **Category Management** - Organize product collections

### Technical
- ⚡ **Next.js 14 App Router** - Latest features, server components
- 🔐 **NextAuth.js v5** - Email/password + Google OAuth
- 🗄️ **MongoDB with Mongoose** - Flexible NoSQL database
- ☁️ **Cloudinary** - Optimized image storage and delivery
- 📧 **Resend** - Transactional email service
- 🎨 **Tailwind CSS** - Utility-first styling with custom design tokens

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- MongoDB (local or MongoDB Atlas)
- Cloudinary account
- Razorpay account
- Resend account (for emails)
- Google OAuth credentials (optional)

### Installation

1. **Clone and install dependencies:**

```bash
cd jewellery-store
npm install
```

2. **Set up environment variables:**

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:
- `MONGODB_URI` - MongoDB connection string
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `CLOUDINARY_*` - Cloudinary credentials
- `RAZORPAY_*` - Razorpay API keys
- `RESEND_API_KEY` - Resend API key

Optional:
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - For Google OAuth

3. **Seed the database:**

```bash
npm run seed
```

This creates:
- 5 product categories
- 15 sample products
- Admin user: `admin@radheboutique.com` / `Admin@123`
- Test user: `test@example.com` / `Test@123`

4. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
jewellery-store/
├── app/
│   ├── (store)/          # Public storefront routes
│   ├── (auth)/           # Authentication pages
│   ├── (account)/        # User account pages
│   ├── (checkout)/       # Checkout flow
│   ├── (admin)/          # Admin panel
│   ├── api/              # API routes (backend)
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   ├── ui/               # Reusable UI primitives
│   ├── layout/           # Layout components
│   ├── home/             # Home page sections
│   ├── shop/             # Shop page components
│   ├── checkout/         # Checkout components
│   └── admin/            # Admin panel components
├── lib/
│   ├── db.ts             # MongoDB connection
│   ├── auth.ts           # NextAuth configuration
│   ├── utils.ts          # Utility functions
│   ├── validations.ts    # Zod schemas
│   ├── cloudinary.ts     # Image upload
│   ├── razorpay.ts       # Payment processing
│   └── email.ts          # Email templates
├── models/               # Mongoose models
├── store/                # Zustand stores
├── types/                # TypeScript types
└── public/               # Static assets
```

## 🎨 Design System

### Color Palette
- **Background**: `#0A0A0A` (Obsidian Black)
- **Primary Accent**: `#C9A84C` (Champagne Gold)
- **Text**: `#FAF7F0` (Ivory)
- **Secondary Accent**: `#E8D5C4` (Blush Rose)
- **Surface**: `#141414` (Card backgrounds)
- **Border**: `#2A2A2A` (Subtle borders)

### Typography
- **Display/Headings**: Cormorant Garamond (Serif)
- **Body/UI**: Montserrat (Sans-serif)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS + custom CSS variables
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js v5
- **Image Storage**: Cloudinary
- **Payment**: Razorpay
- **Email**: Resend
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Charts**: Recharts

## 📦 API Routes

### Products
- `GET /api/products` - Get products with filtering & pagination
- `POST /api/products` - Create product (admin)
- `GET /api/products/[id]` - Get single product
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/[id]` - Get order details
- `PUT /api/orders/[id]/status` - Update order status (admin)

### Categories
- Full CRUD at `/api/categories` and `/api/categories/[id]`

### Coupons
- `POST /api/coupons/validate` - Validate coupon code
- Full CRUD at `/api/coupons` (admin)

### Payment
- `POST /api/razorpay/create-order` - Create Razorpay order
- `POST /api/razorpay/webhook` - Payment webhook

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/revenue` - Revenue chart data

## 🔐 Authentication

### Default Accounts

**Admin:**
- Email: `admin@radheboutique.com`
- Password: `Admin@123`

**Test User:**
- Email: `test@example.com`
- Password: `Test@123`

### Authentication Methods
- Email/Password (credentials)
- Google OAuth (optional)

## 💳 Payment Setup

1. Sign up for [Razorpay](https://razorpay.com/)
2. Get your API keys from the dashboard
3. Add to `.env`:
   ```
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id
   ```
4. Set up webhook for payment confirmation

## 📧 Email Setup

1. Sign up for [Resend](https://resend.com/)
2. Verify your domain (or use test mode)
3. Get your API key
4. Add to `.env`:
   ```
   RESEND_API_KEY=your_api_key
   ```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Environment Variables for Production

Make sure to set all environment variables in your hosting platform:
- Update `NEXTAUTH_URL` to your production domain
- Update `NEXT_PUBLIC_APP_URL` to your production domain
- Use production API keys for Razorpay, Cloudinary, etc.

### MongoDB Atlas

1. Create a cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Update `MONGODB_URI` in environment variables

## 🧪 Testing Payments

Use Razorpay test cards:
- Card: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

## 📝 Customization

### Brand Information

Update in `.env`:
```
NEXT_PUBLIC_BRAND_NAME=Your Brand
NEXT_PUBLIC_BRAND_TAGLINE=Your Tagline
NEXT_PUBLIC_BRAND_CITY=Your City
NEXT_PUBLIC_BRAND_WHATSAPP=+91XXXXXXXXXX
NEXT_PUBLIC_BRAND_EMAIL=your@email.com
NEXT_PUBLIC_BRAND_INSTAGRAM=@yourbrand
```

### Design Tokens

Edit `app/globals.css`:
```css
:root {
  --color-bg: #0A0A0A;
  --color-gold: #C9A84C;
  /* ... more tokens */
}
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Check `MONGODB_URI` format
- Whitelist your IP in MongoDB Atlas
- Ensure network connectivity

### Image Upload Issues
- Verify Cloudinary credentials
- Check file size limits
- Ensure proper image formats

### Payment Issues
- Use test mode keys for development
- Check webhook configuration
- Verify signature validation

## 📄 License

This project is licensed under the MIT License.

## 🙏 Support

For issues and questions:
- Email: info@radheboutique.com
- WhatsApp: +919876543210

---

**Built with ❤️ for Radhe Boutique**
