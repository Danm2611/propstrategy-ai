# PropStrategy AI - Setup Commands

## Quick Start

### 1. Local Development with Docker
```bash
# Start all services (app, postgres, redis)
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Reset everything (including volumes)
docker-compose down -v
```

### 2. Local Development without Docker
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

## Database Management

### Prisma Commands
```bash
# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name init

# Push schema changes (without migration)
npx prisma db push

# Open Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset
```

## Deployment Commands

### Deploy to Development
```bash
# Create dev branch if not exists
git checkout -b dev

# Push to dev (triggers auto-deploy)
git push origin dev
```

### Deploy to Production
```bash
# Merge dev to main
git checkout main
git merge dev

# Push to main (triggers auto-deploy)
git push origin main
```

## Environment Setup

### 1. Supabase Database
- Create new project at https://supabase.com
- Copy connection string from Settings > Database
- Update DATABASE_URL in .env

### 2. Stripe Setup
- Get test keys from https://dashboard.stripe.com/test/apikeys
- Update STRIPE_PUBLIC_KEY and STRIPE_SECRET_KEY
- Set up webhook endpoint and get STRIPE_WEBHOOK_SECRET

### 3. Anthropic API
- Get API key from https://console.anthropic.com
- Update ANTHROPIC_API_KEY

### 4. AWS S3 / Cloudflare R2
- Create bucket for file uploads
- Create IAM user with S3 access
- Update AWS_* variables

### 5. Resend Email
- Get API key from https://resend.com
- Update RESEND_API_KEY

## Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e
```

### Test Stripe Webhooks Locally
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to localhost
stripe listen --forward-to localhost:3000/api/payments/webhook
```

## Useful Commands

### Check Application Health
```bash
# Local
curl http://localhost:3000/api/health

# Dev environment
curl https://propstrategy-ai-dev.ondigitalocean.app/api/health

# Production
curl https://propstrategy.ai/api/health
```

### Build for Production
```bash
# Build Next.js app
npm run build

# Build Docker image
docker build -t propstrategy-ai .

# Run production build locally
npm start
```

## Troubleshooting

### Database Connection Issues
```bash
# Test connection
npx prisma db pull

# Check DATABASE_URL format
# Should be: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```

### Clear Cache
```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules
rm -rf node_modules
npm install

# Clear Docker volumes
docker-compose down -v
```

### View Logs
```bash
# Docker logs
docker-compose logs app
docker-compose logs postgres
docker-compose logs redis

# Digital Ocean logs (via DO dashboard or CLI)
doctl apps logs <app-id>
```