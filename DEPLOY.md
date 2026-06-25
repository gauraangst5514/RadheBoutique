# Production Deployment Guide

## Current Project Status

✅ **Production-Ready Features:**
- User authentication (login/register)
- Product browsing with filters
- Shopping cart with persistence
- Wishlist functionality
- Product detail pages
- Admin dashboard
- Admin product management
- Order creation API
- Payment integration structure
- Email templates
- Database seed data

🚧 **Pending Features** (Optional for MVP):
- Complete checkout flow
- Payment webhook
- Order tracking
- Admin orders management
- Review system

## Quick Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account
- MongoDB Atlas account (free tier)
- Cloudinary account
- Razorpay account

### Step 1: Prepare MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Create database user with password
4. Network Access → Add IP Address → Allow from Anywhere (0.0.0.0/0)
5. Get connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/radhe-boutique?retryWrites=true&w=majority
   ```

### Step 2: Setup Cloudinary

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Dashboard → Copy credentials:
   - Cloud Name
   - API Key
   - API Secret

### Step 3: Setup Razorpay

1. Sign up at [Razorpay](https://razorpay.com/)
2. Use Test Mode for initial deployment
3. Settings → API Keys → Generate Test Key
4. Copy:
   - Key ID (starts with rzp_test_)
   - Key Secret

### Step 4: Push to GitHub

```bash
cd jewellery-store

# Initialize git if not done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Radhe Boutique"

# Create repository on GitHub, then:
git remote add origin https://github.com/yourusername/radhe-boutique.git
git branch -M main
git push -u origin main
```

### Step 5: Deploy to Vercel

1. Go to [Vercel](https://vercel.com/)
2. Click "New Project"
3. Import your GitHub repository
4. Configure Project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Install Command: `npm install`

5. Add Environment Variables:

```env
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=https://your-domain.vercel.app
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_BRAND_NAME=Radhe Boutique
NEXT_PUBLIC_BRAND_TAGLINE=Crafted for Eternity
NEXT_PUBLIC_BRAND_CITY=Mumbai
NEXT_PUBLIC_BRAND_WHATSAPP=+919876543210
NEXT_PUBLIC_BRAND_EMAIL=info@radheboutique.com
NEXT_PUBLIC_BRAND_INSTAGRAM=@radheboutique
RESEND_API_KEY=re_xxxxx
```

6. Click "Deploy"

### Step 6: Seed Production Database

After deployment, seed the database:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run seed script
vercel env pull .env.local
npm run seed
```

Or manually run seed via Vercel Functions.

### Step 7: Test Production

1. Visit your deployed URL
2. Test user flows:
   - Browse products
   - Register new account
   - Login
   - Add to cart
   - Add to wishlist
   - View product details
   - Admin login
   - Admin dashboard

**Test Credentials:**
- Admin: `admin@radheboutique.com` / `Admin@123`
- User: `test@example.com` / `Test@123`

## Custom Domain Setup

### Step 1: Add Domain in Vercel

1. Project Settings → Domains
2. Add your domain (e.g., radheboutique.com)
3. Vercel will provide DNS records

### Step 2: Configure DNS

Add these records in your domain registrar:

```
Type  Name  Value
A     @     76.76.21.21
CNAME www   cname.vercel-dns.com
```

### Step 3: Update Environment Variables

Update these in Vercel:
```env
NEXTAUTH_URL=https://radheboutique.com
NEXT_PUBLIC_APP_URL=https://radheboutique.com
```

## Post-Deployment Checklist

### Immediate Actions

- [ ] Test all critical user flows
- [ ] Verify database connections
- [ ] Check image uploads to Cloudinary
- [ ] Test email sending (if configured)
- [ ] Verify admin panel access
- [ ] Test mobile responsiveness

### Security

- [ ] Rotate NEXTAUTH_SECRET if exposed
- [ ] Enable Vercel's password protection (Settings → General → Password Protection)
- [ ] Set up Vercel Analytics
- [ ] Configure error tracking (Sentry recommended)
- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Review environment variables

### Performance

- [ ] Enable Vercel Speed Insights
- [ ] Check Lighthouse scores
- [ ] Optimize images if needed
- [ ] Review build logs for warnings
- [ ] Test from different locations

### SEO & Marketing

- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Analytics
- [ ] Add favicon and OG images
- [ ] Update meta tags
- [ ] Set up robots.txt

## Environment-Specific Configuration

### Development
```env
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
RAZORPAY_KEY_ID=rzp_test_xxxxx
```

### Production
```env
NEXTAUTH_URL=https://radheboutique.com
NEXT_PUBLIC_APP_URL=https://radheboutique.com
RAZORPAY_KEY_ID=rzp_live_xxxxx  # Use live keys after testing
```

## Monitoring & Maintenance

### Vercel Dashboard

Monitor:
- Deployment status
- Build logs
- Function logs
- Analytics
- Performance metrics

### Database Monitoring

MongoDB Atlas:
- Monitor connections
- Check slow queries
- Review storage usage
- Set up alerts

### Regular Maintenance

- Weekly: Review error logs
- Monthly: Update dependencies
- Quarterly: Security audit
- As needed: Database backups

## Rollback Procedure

If deployment has issues:

1. Go to Vercel Dashboard
2. Deployments tab
3. Find last working deployment
4. Click "..." → "Promote to Production"

## Scaling Considerations

### When to Scale

- More than 1000 products
- High traffic (>10k visitors/day)
- Complex search queries
- Large order volume

### Scaling Options

1. **Database**: Upgrade MongoDB Atlas tier
2. **Images**: Upgrade Cloudinary plan
3. **Vercel**: Pro plan for better limits
4. **Caching**: Add Redis for sessions
5. **CDN**: Cloudflare for additional caching

## Troubleshooting

### Build Failures

```bash
# Check build locally
npm run build

# Common fixes:
npm install
rm -rf .next
npm run build
```

### Database Connection Issues

- Verify MongoDB URI
- Check IP whitelist
- Test connection locally:
```bash
mongosh "your-connection-string"
```

### Environment Variable Issues

- Check variable names (case-sensitive)
- Redeploy after updating variables
- Use `process.env.VARIABLE_NAME` in code

### Image Upload Issues

- Verify Cloudinary credentials
- Check API limits
- Test upload locally

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Razorpay Docs](https://razorpay.com/docs/)

## Cost Estimation

### Free Tier (MVP)

- Vercel: Free (Hobby plan)
- MongoDB Atlas: Free (M0 cluster, 512MB)
- Cloudinary: Free (25GB storage, 25GB bandwidth)
- Razorpay: No setup fee (transaction fees apply)
- **Total: ₹0 per month** (until significant traffic)

### Production (Moderate Traffic)

- Vercel Pro: $20/month
- MongoDB Atlas M2: $9/month
- Cloudinary Plus: $99/month (if needed)
- Domain: ~$15/year
- **Total: ~$30-130/month**

---

## Quick Commands

```bash
# Build locally
npm run build

# Start production build locally
npm start

# Deploy to Vercel
vercel --prod

# Check deployment
vercel inspect

# View logs
vercel logs

# Pull environment variables
vercel env pull
```

---

**Congratulations! Your luxury jewellery store is now live! 🎉**
