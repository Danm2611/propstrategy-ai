# Three-Tier Development Setup Commands

## Quick Start Commands (Copy these to Claude Code)

### 1. Initial Repository Setup
```bash
# Create new GitHub repository
gh repo create YOUR_PROJECT_NAME --public --clone

# Copy template files to your new project
cp -r /Users/danmacbookpro/three-tier-dev-template/* ./

# Initial commit
git add .
git commit -m "Initial three-tier development setup"
git push origin main

# Create and push dev branch
git checkout -b dev
git push -u origin dev
```

### 2. Local Development Setup
```bash
# Copy environment file
cp .env.example .env

# Start local development with Docker
docker-compose up --build

# Access at: http://localhost:8080
```

### 3. Digital Ocean Deployment (Dev Environment)
```bash
# Deploy dev environment
doctl apps create --spec deploy-dev.yml

# Or using Claude Code MCP:
# "Deploy this to Digital Ocean dev environment using the deploy-dev.yml configuration"
```

### 4. Digital Ocean Deployment (Prod Environment)
```bash
# Deploy production environment
doctl apps create --spec deploy-prod.yml

# Or using Claude Code MCP:
# "Deploy this to Digital Ocean production environment using the deploy-prod.yml configuration"
```

### 5. Daily Development Workflow
```bash
# Start new feature
git checkout dev
git pull origin dev
git checkout -b feature/new-feature-name

# Make changes, test locally at localhost:8080

# When ready, merge to dev
git checkout dev
git merge feature/new-feature-name
git push origin dev

# When dev is stable, merge to production
git checkout main
git merge dev
git push origin main
```