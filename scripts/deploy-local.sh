#!/bin/bash

# Local Development Deployment Script
echo "🚀 Starting PropStrategy AI Local Development Environment"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found. Copying from example..."
    cp .env.local.example .env.local
    echo "📝 Please edit .env.local with your actual API keys"
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.local.yml down

# Build and start containers
echo "🔨 Building and starting containers..."
docker-compose -f docker-compose.local.yml up --build -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run database migrations
echo "🗄️  Running database migrations..."
docker-compose -f docker-compose.local.yml exec app npx prisma migrate dev --name init

# Show status
echo "📊 Container status:"
docker-compose -f docker-compose.local.yml ps

echo ""
echo "✅ Local development environment is ready!"
echo "🌐 App: http://localhost:3000"
echo "🗄️  Database Admin: http://localhost:8080"
echo "📊 Redis: localhost:6379"
echo ""
echo "To view logs: docker-compose -f docker-compose.local.yml logs -f"
echo "To stop: docker-compose -f docker-compose.local.yml down"