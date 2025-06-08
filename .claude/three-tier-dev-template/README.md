# 🚀 Three-Tier Development Workflow Template

A complete development workflow template that mirrors the system demonstrated in the video. This setup gives you **localhost → dev → production** environments with full automation through Claude Code + MCP servers.

## 🏗️ Architecture Overview

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  LOCALHOST  │    │   DEV ENV   │    │  PROD ENV   │
│             │    │             │    │             │
│ Port: 8080  │───▶│ Digital     │───▶│ Digital     │
│ Feature     │    │ Ocean       │    │ Ocean       │
│ Branches    │    │ (dev branch)│    │ (main branch│
└─────────────┘    └─────────────┘    └─────────────┘
      ▲                    ▲                    ▲
      │                    │                    │
   Docker            Separate DB         Separate DB
  Container          & Redis Cache      & Redis Cache
```

## 🎯 Key Benefits

- **Instant local feedback** - No waiting for builds during development
- **Stable dev environment** - Always have a working version to revert to
- **Safe experimentation** - Create feature branches without breaking anything
- **Automated deployments** - Push to deploy via GitHub integration
- **Environment isolation** - Separate databases and caches prevent conflicts

## 📋 Prerequisites

✅ You already have these MCP servers installed:
- Digital Ocean MCP
- Supabase MCP (for database management)
- Puppeteer MCP (for testing/automation)

## 🚀 Quick Start

### For New Projects

1. **Copy this template to your new project:**
   ```bash
   cp -r /Users/danmacbookpro/three-tier-dev-template/* /path/to/your/new/project/
   ```

2. **Tell Claude Code:**
   ```
   Set up a new three-tier development project using the template at /Users/danmacbookpro/three-tier-dev-template. 
   
   Please:
   1. Create a new GitHub repository called [PROJECT_NAME]
   2. Set up the dev and main branches
   3. Deploy dev environment to Digital Ocean
   4. Deploy production environment to Digital Ocean
   5. Start the local Docker environment
   
   Make sure to use separate databases for dev and prod environments.
   ```

### For Existing Projects

1. **Tell Claude Code:**
   ```
   Convert my existing project to use the three-tier development workflow from /Users/danmacbookpro/three-tier-dev-template.
   
   Please:
   1. Add the Docker configuration files
   2. Set up proper GitHub branch structure (main, dev)
   3. Create Digital Ocean deployment configs
   4. Set up environment separation
   5. Migrate current code to this workflow
   ```

## 🔄 Daily Development Workflow

### Starting a New Feature
Tell Claude Code:
```
Start a new feature branch called "feature/[FEATURE_NAME]" and set up local development environment.
```

### Testing Locally
```
Start the local Docker environment so I can test at localhost:8080
```

### Deploying to Dev
```
I'm happy with my local changes. Please merge this feature to the dev branch and deploy to Digital Ocean dev environment.
```

### Deploying to Production
```
The dev environment is working perfectly. Please merge dev to main and deploy to production.
```

## 📁 Project Structure

```
your-project/
├── Dockerfile              # Production container config
├── docker-compose.yml      # Local development setup
├── requirements.txt        # Python dependencies
├── app.py                 # Main Flask application
├── templates/             # HTML templates
│   └── index.html
├── deploy-dev.yml         # Digital Ocean dev config
├── deploy-prod.yml        # Digital Ocean prod config
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
└── README.md             # Project documentation
```

## 🔧 Environment Configuration

### Localhost
- **Purpose:** Feature development and testing
- **Database:** Can share dev database or use SQLite
- **Cache:** Local Redis container
- **Access:** http://localhost:8080

### Dev Environment
- **Purpose:** Staging and integration testing
- **Database:** Separate dev database (Supabase/PostgreSQL)
- **Cache:** Separate Redis instance (Upstash)
- **Branch:** `dev`
- **Auto-deploy:** On push to dev branch

### Production Environment
- **Purpose:** Live application
- **Database:** Separate production database
- **Cache:** Separate Redis instance
- **Branch:** `main`
- **Auto-deploy:** On push to main branch

## 🛠️ Common Claude Code Commands

### Project Setup
```
"Set up a new three-tier development project for [PROJECT_TYPE] using the template"
```

### Development
```
"Start local development environment"
"Create a new feature branch for [FEATURE_NAME]"
"Test the current changes locally"
```

### Deployment
```
"Deploy current changes to dev environment"
"Deploy dev to production"
"Check the status of my Digital Ocean apps"
```

### Troubleshooting
```
"Check the logs for my dev environment"
"Fix the deployment issue in production"
"Reset my local development environment"
```

## 🔐 Security & Best Practices

1. **Never share databases** between environments
2. **Use separate Redis/cache instances** for each environment
3. **Keep environment variables** in separate `.env` files
4. **Test on dev** before deploying to production
5. **Use feature branches** for all development work

## 📝 Customization

This template uses Flask/Python, but you can easily adapt it for:
- **Next.js/React:** Modify Dockerfile and deployment configs
- **Node.js/Express:** Update package.json and startup commands
- **Django:** Adjust Python dependencies and WSGI configuration

Just tell Claude Code:
```
"Convert this three-tier template to use [FRAMEWORK] instead of Flask"
```

## 🎥 Video Reference

This workflow is based on the development system demonstrated in the video, providing the same three-tier architecture with full automation through Claude Code and MCP servers.

---

**Ready to implement this in your next project?** Just copy the template and tell Claude Code to set it up! 🚀