#!/bin/bash

# Radhe Boutique - Setup Script
# This script helps you set up the project quickly

echo "🎨 Radhe Boutique - Luxury Jewellery E-Commerce Setup"
echo "=================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env file with your credentials:"
    echo "   - MongoDB URI"
    echo "   - NextAuth Secret (generate with: openssl rand -base64 32)"
    echo "   - Cloudinary credentials"
    echo "   - Razorpay keys"
    echo "   - Resend API key (optional)"
    echo ""
    read -p "Press Enter after updating .env file..."
else
    echo "✅ .env file already exists"
    echo ""
fi

# Ask if user wants to seed database
read -p "🌱 Do you want to seed the database with sample data? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🌱 Seeding database..."
    npm run seed
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Database seeded successfully!"
        echo ""
        echo "👤 Test Credentials:"
        echo "   Admin: admin@radheboutique.com / Admin@123"
        echo "   User: test@example.com / Test@123"
        echo ""
    else
        echo "❌ Failed to seed database. Check your MongoDB connection."
    fi
fi

echo ""
echo "=================================================="
echo "🎉 Setup Complete!"
echo "=================================================="
echo ""
echo "📖 Next steps:"
echo "   1. Make sure .env file has all required credentials"
echo "   2. Run: npm run dev"
echo "   3. Open: http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Full documentation"
echo "   - QUICKSTART.md - Quick start guide"
echo "   - PROJECT_STATUS.md - Implementation status"
echo ""
echo "🚀 Happy coding!"
