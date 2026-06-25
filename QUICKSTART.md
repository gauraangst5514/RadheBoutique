# Quick Start Guide - Radhe Boutique

## Project Status

✅ **Core Foundation Complete:**
- Configuration files (Next.js, TypeScript, Tailwind)
- Database models (User, Product, Category, Order, Review, Coupon)
- Authentication system (NextAuth.js)
- Utility functions and validations
- State management (Zustand)
- Email templates
- Payment integration (Razorpay)
- Image upload (Cloudinary)
- Database seed script

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create `.env` file:

```bash
cp .env.example .env
```

**Minimum Required Variables:**

```env
# MongoDB (use free MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/radhe-boutique

# NextAuth (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Cloudinary (free tier available)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Razorpay Test Mode
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx

# Resend (optional, for emails)
RESEND_API_KEY=re_xxxxx
```

### 3. Seed Database

```bash
npm run seed
```

This creates:
- **Admin**: admin@radheboutique.com / Admin@123
- **User**: test@example.com / Test@123
- 5 categories
- 15 products
- 2 coupons

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## What's Next - Remaining Implementation

The foundation is complete. Here are the remaining components to build:

### Pages to Create:

1. **Home Page** (`app/page.tsx`)
   - Hero section with video/image background
   - Featured collections
   - New arrivals grid
   - Testimonials
   - Newsletter signup

2. **Shop Pages** (`app/(store)/shop/`)
   - Product listing with filters
   - Product detail page
   - Search page

3. **Auth Pages** (`app/(auth)/`)
   - Login, Register
   - Forgot/Reset password

4. **Account Pages** (`app/(account)/account/`)
   - Dashboard, Orders, Profile, Addresses

5. **Checkout** (`app/(checkout)/checkout/`)
   - Multi-step checkout
   - Success page

6. **Admin Pages** (`app/(admin)/admin/`)
   - Dashboard with charts
   - Products, Orders, Users, Coupons management

### Components to Create:

1. **Layout Components** (`components/layout/`)
   - Navbar (transparent → solid on scroll)
   - Footer
   - Mobile menu
   - Cart drawer

2. **UI Components** (`components/ui/`)
   - Button, Input, Badge, Modal
   - Select, Tabs, Skeleton

3. **Shop Components** (`components/shop/`)
   - ProductCard, ProductGrid
   - ProductFilters, ProductGallery
   - ReviewSection

4. **Admin Components** (`components/admin/`)
   - Tables, Forms, Charts
   - Stats cards

### API Routes to Create:

Most API routes follow this pattern. Example template:

```typescript
// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const product = await Product.findById(params.id).populate("category");
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const product = await Product.findByIdAndUpdate(params.id, body, {
      new: true,
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update product" },
      { status: 500 }
    );
  }
}
```

### Recommended Development Order:

1. **Week 1: Core Pages**
   - Create Navbar & Footer components
   - Build Home page with hero and featured products
   - Implement Shop page with product grid
   - Create Product detail page

2. **Week 2: E-commerce Features**
   - Cart drawer functionality
   - Wishlist page
   - Authentication pages (login/register)
   - User account dashboard

3. **Week 3: Checkout & Orders**
   - Multi-step checkout flow
   - Razorpay integration
   - Order confirmation
   - Order history page

4. **Week 4: Admin Panel**
   - Admin dashboard with stats
   - Product management (CRUD)
   - Order management
   - User & coupon management

## Testing

### Test Credentials

**Admin:**
- Email: admin@radheboutique.com
- Password: Admin@123

**Regular User:**
- Email: test@example.com
- Password: Test@123

### Test Payment

Use Razorpay test cards:
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

## Design Guidelines

- **Colors**: Gold (#C9A84C) on dark (#0A0A0A)
- **Fonts**: Cormorant Garamond (headings), Montserrat (body)
- **Spacing**: Generous whitespace, luxury feel
- **Animations**: Subtle, smooth (Framer Motion)
- **Images**: next/image with proper optimization

## Resources

- [Next.js 14 Docs](https://nextjs.org/docs)
- [NextAuth.js v5](https://authjs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Razorpay Docs](https://razorpay.com/docs/)
- [MongoDB Docs](https://www.mongodb.com/docs/)
- [Cloudinary Docs](https://cloudinary.com/documentation)

## Support

If you need help completing specific sections, ask about:
- Specific page implementation
- Component creation
- API route logic
- Admin panel features
- Payment flow
- Email templates

The foundation is solid - now it's time to build the UI! 🚀
