# 🚀 PropStrategy AI - Three-Tier Deployment Guide

## Architecture Overview

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  LOCALHOST  │    │   DEV ENV   │    │  PROD ENV   │
│             │    │             │    │             │
│ Port: 3000  │───▶│ Digital     │───▶│ Digital     │
│ PostgreSQL  │    │ Ocean       │    │ Ocean       │
│ Redis       │    │ (dev branch)│    │ (main branch│
└─────────────┘    └─────────────┘    └─────────────┘
```

## Quick Start Commands

### For Local Development
```bash
# Start local environment
./scripts/deploy-local.sh

# Or manually
docker-compose -f docker-compose.local.yml up --build
```

### For Claude Code (Recommended)
```
Set up PropStrategy AI using the three-tier development workflow:

1. Create GitHub repository with main and dev branches
2. Set up Digital Ocean dev environment using .do/deploy-dev.yml
3. Set up Digital Ocean production environment using .do/deploy-prod.yml
4. Configure separate Supabase databases for dev and production
5. Start local Docker environment for development

Make sure all environments use PostgreSQL and have proper separation.
```

## Environment Details

### 🏠 Local Development (localhost:3000)
- **Purpose**: Feature development and testing
- **Database**: PostgreSQL (Docker container)
- **Cache**: Redis (Docker container)
- **API Keys**: Test/development keys
- **Branch**: Any feature branch

### 🧪 Development Environment (Digital Ocean)
- **Purpose**: Staging and integration testing
- **URL**: `https://propstrategy-dev.yourdomain.com`
- **Database**: Supabase Dev Database
- **Cache**: Upstash Redis (dev instance)
- **Branch**: `dev` (auto-deploy)
- **API Keys**: Test/development keys

### 🌍 Production Environment (Digital Ocean)
- **Purpose**: Live application
- **URL**: `https://app.propstrategy.ai`
- **Database**: Supabase Production Database
- **Cache**: Upstash Redis (production instance)
- **Branch**: `main` (auto-deploy)
- **API Keys**: Live/production keys

## Pre-Deployment Setup

### 1. API Keys Required
```bash
# Core functionality
ANTHROPIC_API_KEY=sk-ant-api03-...
PERPLEXITY_API_KEY=pplx-...

# Payment processing
STRIPE_PUBLIC_KEY=pk_test_... (dev) / pk_live_... (prod)
STRIPE_SECRET_KEY=sk_test_... (dev) / sk_live_... (prod)
STRIPE_WEBHOOK_SECRET=whsec_test_... (dev) / whsec_live_... (prod)

# Email
RESEND_API_KEY=re_...

# Authentication
NEXTAUTH_SECRET=32-character-random-string
```

### 2. Database Setup
- **Dev**: Separate Supabase project for development
- **Prod**: Separate Supabase project for production
- Both use the same schema but completely separate data

### 3. Domain Configuration
- **Dev**: `propstrategy-dev.yourdomain.com`
- **Prod**: `app.propstrategy.ai`

## Local Development Workflow

### Starting Development
```bash
# 1. Create feature branch
git checkout -b feature/new-analysis-feature

# 2. Start local environment
./scripts/deploy-local.sh

# 3. Develop and test at http://localhost:3000
```

### Daily Development
```bash
# View logs
docker-compose -f docker-compose.local.yml logs -f app

# Restart specific service
docker-compose -f docker-compose.local.yml restart app

# Run database commands
docker-compose -f docker-compose.local.yml exec app npx prisma studio
```

### Cleaning Up
```bash
# Stop all containers
docker-compose -f docker-compose.local.yml down

# Remove volumes (reset database)
docker-compose -f docker-compose.local.yml down -v
```

## Digital Ocean Deployment

### Using Claude Code (Recommended)
```
Deploy my PropStrategy AI to Digital Ocean:

1. Create dev environment from .do/deploy-dev.yml
2. Set up environment variables for dev
3. Deploy dev branch to development environment
4. Test dev environment
5. Create production environment from .do/deploy-prod.yml
6. Set up environment variables for production
7. Deploy main branch to production

Use separate databases for each environment.
```

### Manual Deployment
```bash
# Install doctl CLI
brew install doctl

# Authenticate
doctl auth init

# Deploy dev environment
doctl apps create --spec .do/deploy-dev.yml

# Deploy production environment
doctl apps create --spec .do/deploy-prod.yml
```

## Environment Variables Setup

### Local Development
Copy `.env.local.example` to `.env.local` and fill in your keys.

### Digital Ocean Environments
Set these in the Digital Ocean App Platform dashboard or via CLI:

```bash
# For dev environment
doctl apps update YOUR_DEV_APP_ID --spec .do/deploy-dev.yml

# For production environment  
doctl apps update YOUR_PROD_APP_ID --spec .do/deploy-prod.yml
```

## Database Migration Strategy

### Initial Setup
```bash
# Generate Prisma client
npx prisma generate

# Create initial migration
npx prisma migrate dev --name init

# Deploy to production database
npx prisma migrate deploy
```

### Schema Changes
```bash
# 1. Make changes to prisma/schema.prisma
# 2. Test locally
npx prisma migrate dev --name your-change-description

# 3. Deploy to dev environment (automatic via CI/CD)
# 4. Test on dev environment
# 5. Deploy to production (automatic via CI/CD)
```

## Monitoring & Debugging

### Local Environment
```bash
# App logs
docker-compose -f docker-compose.local.yml logs -f app

# Database logs
docker-compose -f docker-compose.local.yml logs -f db

# All services
docker-compose -f docker-compose.local.yml logs -f
```

### Digital Ocean Environments
```bash
# View app logs
doctl apps logs YOUR_APP_ID --type run

# View build logs
doctl apps logs YOUR_APP_ID --type build

# Get app info
doctl apps get YOUR_APP_ID
```

## Automated Workflows

### Feature Development
1. Create feature branch from `dev`
2. Develop locally using Docker
3. Push feature branch (no auto-deploy)
4. Merge to `dev` → auto-deploy to dev environment
5. Test on dev environment
6. Merge `dev` to `main` → auto-deploy to production

### Hotfixes
1. Create hotfix branch from `main`
2. Fix locally using Docker
3. Merge to `main` → auto-deploy to production
4. Merge back to `dev` to keep in sync

## Troubleshooting

### Local Environment Issues
```bash
# Reset everything
docker-compose -f docker-compose.local.yml down -v
docker system prune -f
./scripts/deploy-local.sh
```

### Digital Ocean Issues
```bash
# Check app status
doctl apps get YOUR_APP_ID

# View recent deployments
doctl apps list-deployments YOUR_APP_ID

# Force redeploy
doctl apps create-deployment YOUR_APP_ID
```

### Database Issues
```bash
# Reset local database
docker-compose -f docker-compose.local.yml down -v
docker-compose -f docker-compose.local.yml up -d db
npx prisma migrate dev --name init
```

## Security Checklist

- ✅ Separate databases for dev and production
- ✅ Different API keys for each environment
- ✅ Secure NextAuth secrets (32+ characters)
- ✅ HTTPS enforced on all public environments
- ✅ Environment variables stored securely in Digital Ocean
- ✅ No secrets committed to Git

## Cost Optimization

### Digital Ocean Resources
- **Dev Environment**: Basic XXS ($5/month)
- **Production Environment**: Basic XS ($12/month)
- **Dev Database**: Basic ($15/month)
- **Production Database**: Basic ($15/month)

**Total**: ~$47/month for full three-tier setup

### Scaling Strategy
- Start with Basic instances
- Monitor performance in Digital Ocean dashboard
- Scale up production instance size as needed
- Keep dev environment minimal

---

**Ready to deploy?** Just tell Claude Code to set up the three-tier workflow and it will handle everything automatically! 🚀