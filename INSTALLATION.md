# Installation Guide - Radhe Boutique

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm, yarn, or pnpm** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

## Required Services (Sign up for free tiers)

1. **MongoDB** - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier available)
2. **Cloudinary** - [Sign up](https://cloudinary.com/) (Free tier: 25GB storage)
3. **Razorpay** - [Sign up](https://razorpay.com/) (Test mode available)
4. **Resend** (Optional) - [Sign up](https://resend.com/) (Free tier: 100 emails/day)
5. **Google OAuth** (Optional) - [Google Cloud Console](https://console.cloud.google.com/)

## Quick Installation (Recommended)

### Step 1: Navigate to Project

```bash
cd jewellery-store
```

### Step 2: Run Setup Script

```bash
chmod +x setup.sh
./setup.sh
```

The script will:
- Install all dependencies
- Create .env file from template
- Optionally seed the database

### Step 3: Configure Environment Variables

Edit the `.env` file with your credentials:

```env
# MongoDB - Get from MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/radhe-boutique

# NextAuth - Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-random-secret-min-32-chars
NEXTAUTH_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Razorpay (Test Mode)
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx

# Resend (Optional)
RESEND_API_KEY=re_xxxxx

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Seed Database

```bash
npm run seed
```

This creates:
- 5 categories (Rings, Necklaces, Earrings, Bracelets, Sets)
- 15 products with realistic data
- 2 users (admin + regular user)
- 2 active coupons

### Step 5: Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Manual Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup MongoDB

**Option A: MongoDB Atlas (Recommended)**

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free M0 tier)
3. Create database user
4. Whitelist your IP (or use 0.0.0.0/0 for development)
5. Get connection string
6. Add to `.env` as `MONGODB_URI`

**Option B: Local MongoDB**

1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/radhe-boutique`

### 3. Setup Cloudinary

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret
4. Add to `.env`

### 4. Setup Razorpay

1. Sign up at [Razorpay](https://razorpay.com/)
2. Use test mode for development
3. Go to Settings → API Keys → Generate Test Key
4. Copy Key ID and Key Secret
5. Add both to `.env` (including NEXT_PUBLIC_RAZORPAY_KEY_ID)

### 5. Setup NextAuth Secret

Generate a secure secret:

```bash
openssl rand -base64 32
```

Add to `.env` as `NEXTAUTH_SECRET`

### 6. Setup Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project
3. Enable Google+ API
4. Create OAuth credentials
5. Add authorized redirect: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret
7. Add to `.env`

### 7. Setup Resend (Optional)

1. Sign up at [Resend](https://resend.com/)
2. Verify your domain (or use onboarding email for testing)
3. Create API key
4. Add to `.env`

### 8. Create .env File

```bash
cp .env.example .env
```

Then edit `.env` with all your credentials.

### 9. Seed Database

```bash
npm run seed
```

### 10. Start Development

```bash
npm run dev
```

## Verification

### Check Installation

1. **Home Page**: http://localhost:3000
   - Should display luxury landing page
   - Navigation links should work

2. **Login**: http://localhost:3000/login
   - Use: admin@radheboutique.com / Admin@123
   - Should redirect to account page

3. **Admin Panel**: http://localhost:3000/admin
   - Should show dashboard (admin only)
   - Stats cards should display

4. **API Test**: http://localhost:3000/api/products
   - Should return JSON with product list
   - Should have 15 products

### Test Credentials

**Admin Account:**
- Email: `admin@radheboutique.com`
- Password: `Admin@123`
- Access: Full admin panel access

**Regular User:**
- Email: `test@example.com`
- Password: `Test@123`
- Access: User account features

**Test Coupons:**
- `WELCOME10` - 10% off on orders above ₹10,000
- `FESTIVE2024` - ₹5,000 off on orders above ₹50,000

## Troubleshooting

### MongoDB Connection Error

**Error**: `MongooseError: connect ECONNREFUSED`

**Solution**:
- Check MongoDB is running
- Verify `MONGODB_URI` in `.env`
- Whitelist your IP in MongoDB Atlas
- Check network connectivity

### NextAuth Error

**Error**: `[next-auth][error][NO_SECRET]`

**Solution**:
- Generate secret: `openssl rand -base64 32`
- Add to `.env` as `NEXTAUTH_SECRET`
- Restart dev server

### Cloudinary Upload Error

**Error**: `Cloudinary upload failed`

**Solution**:
- Verify Cloudinary credentials
- Check API key is active
- Ensure file size is within limits

### Razorpay Error

**Error**: `Invalid key_id`

**Solution**:
- Use test mode keys (rzp_test_xxx)
- Verify both RAZORPAY_KEY_ID and NEXT_PUBLIC_RAZORPAY_KEY_ID are set
- Check key is active in Razorpay dashboard

### Port Already in Use

**Error**: `Port 3000 is already in use`

**Solution**:
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Module Not Found

**Error**: `Cannot find module 'xxx'`

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Seed database
npm run seed

# Lint code
npm run lint
```

## Project Structure

```
jewellery-store/
├── app/                    # Next.js App Router
│   ├── (store)/           # Public pages
│   ├── (auth)/            # Auth pages
│   ├── (account)/         # User account
│   ├── (admin)/           # Admin panel
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
├── lib/                   # Utilities
├── models/                # Mongoose models
├── store/                 # Zustand stores
├── types/                 # TypeScript types
├── public/                # Static files
└── scripts/               # Utility scripts
```

## Next Steps

1. ✅ Installation complete
2. ✅ Database seeded
3. ✅ Development server running
4. 📖 Read `README.md` for full documentation
5. 📖 Check `PROJECT_STATUS.md` for implementation status
6. 🚀 Start building UI components

## Support

- **Documentation**: See README.md
- **Project Status**: See PROJECT_STATUS.md
- **Quick Start**: See QUICKSTART.md

## Production Deployment

See README.md section on deployment for:
- Vercel deployment guide
- Environment variables setup
- MongoDB Atlas configuration
- Domain configuration

---

**Happy Coding! 🚀**

Built for **Radhe Boutique** - Crafted for Eternity
