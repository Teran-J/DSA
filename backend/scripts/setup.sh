#!/bin/bash

# Script de setup inicial del proyecto
# Uso: ./setup.sh

echo "================================================"
echo "  🚀 Design Platform Backend - Setup"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if Node.js is installed
echo -e "${YELLOW}Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ $NODE_VERSION -lt 18 ]; then
    echo -e "${RED}✗ Node.js version is too old (${NODE_VERSION})${NC}"
    echo "Please upgrade to Node.js 18+"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node -v) found${NC}"
echo ""

# Check if PostgreSQL is available
echo -e "${YELLOW}Checking PostgreSQL...${NC}"
if ! command -v psql &> /dev/null; then
    echo -e "${RED}⚠ PostgreSQL client not found${NC}"
    echo "Please ensure PostgreSQL is installed and accessible"
    echo "Continuing anyway..."
else
    echo -e "${GREEN}✓ PostgreSQL found${NC}"
fi
echo ""

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to install dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Setup .env file
echo -e "${YELLOW}Setting up environment variables...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created from .env.example${NC}"
    echo -e "${YELLOW}⚠ Please edit .env and configure your DATABASE_URL${NC}"
else
    echo -e "${YELLOW}⚠ .env file already exists${NC}"
fi
echo ""

# Ask if user wants to run migrations
echo -e "${YELLOW}Do you want to run database migrations now? (y/n)${NC}"
read -r RUN_MIGRATIONS

if [ "$RUN_MIGRATIONS" = "y" ] || [ "$RUN_MIGRATIONS" = "Y" ]; then
    echo -e "${YELLOW}Running Prisma migrations...${NC}"

    npx prisma generate
    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ Failed to generate Prisma client${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Prisma client generated${NC}"

    npx prisma migrate dev --name init
    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ Failed to run migrations${NC}"
        echo "Please check your DATABASE_URL in .env"
        exit 1
    fi
    echo -e "${GREEN}✓ Migrations completed${NC}"
    echo ""

    # Ask if user wants to seed database
    echo -e "${YELLOW}Do you want to seed the database with sample data? (y/n)${NC}"
    read -r RUN_SEED

    if [ "$RUN_SEED" = "y" ] || [ "$RUN_SEED" = "Y" ]; then
        npm run prisma:seed
        if [ $? -ne 0 ]; then
            echo -e "${RED}✗ Failed to seed database${NC}"
        else
            echo -e "${GREEN}✓ Database seeded${NC}"
        fi
    fi
else
    echo -e "${YELLOW}Skipping migrations. You can run them later with:${NC}"
    echo "  npm run prisma:migrate"
    echo "  npm run prisma:seed"
fi
echo ""

# Create uploads directory
echo -e "${YELLOW}Creating uploads directory...${NC}"
mkdir -p uploads
echo -e "${GREEN}✓ Uploads directory created${NC}"
echo ""

# Summary
echo "================================================"
echo "  ✅ Setup Complete!"
echo "================================================"
echo ""
echo "Next steps:"
echo "  1. Edit .env and configure DATABASE_URL"
echo "  2. Run migrations: npm run prisma:migrate"
echo "  3. Seed database: npm run prisma:seed"
echo "  4. Start dev server: npm run dev"
echo ""
echo "Test users (after seeding):"
echo "  - client@example.com / password123 (CLIENT)"
echo "  - designer@example.com / password123 (DESIGNER)"
echo "  - admin@example.com / password123 (ADMIN)"
echo ""
echo "Documentation:"
echo "  - README.md - Complete documentation"
echo "  - QUICK_START.md - Quick start guide"
echo "  - API_INTEGRATION.md - Frontend integration"
echo ""
