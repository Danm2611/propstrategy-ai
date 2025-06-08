# 📘 Three-Tier Workflow Implementation Guide

## How to Implement This in Every Project

### Method 1: New Projects (Recommended)

**Step 1: Tell Claude Code**
```
Please create a new project using the three-tier development template at /Users/danmacbookpro/three-tier-dev-template.

Project details:
- Name: [YOUR_PROJECT_NAME]
- Type: [web app/API/dashboard/etc.]
- Framework: [Flask/Next.js/Django/etc.]

Set up:
1. Create GitHub repository with main and dev branches
2. Copy and customize the template files
3. Configure Digital Ocean dev environment
4. Configure Digital Ocean prod environment  
5. Set up local Docker development
6. Create separate databases for dev and prod

Make sure everything mirrors the video workflow exactly.
```

### Method 2: Existing Projects

**Step 1: Backup Current Work**
```
Please backup my current project and then convert it to use the three-tier development workflow template.
```

**Step 2: Apply Template**
```
Copy the three-tier template structure to my existing project and:
1. Add Docker configuration for local development
2. Set up GitHub branch structure (main, dev)
3. Create Digital Ocean deployment configurations
4. Add environment separation
5. Migrate existing code to this workflow
6. Set up separate databases for each environment
```

## 🔄 Daily Workflow Commands

### Starting Your Day
```
"Pull latest changes from dev branch and start local development environment"
```

### Creating New Features
```
"Create a new feature branch called 'feature/[FEATURE_NAME]' and start local development"
```

### Testing Changes
```
"Start the local Docker environment so I can test my changes at localhost:8080"
```

### When Feature is Ready
```
"I'm happy with this feature. Merge it to dev branch and deploy to Digital Ocean dev environment"
```

### When Dev is Stable
```
"Dev environment is working perfectly. Deploy dev to production"
```

### Emergency Fixes
```
"Create a hotfix branch from main, fix [ISSUE], and deploy directly to production"
```

## 🎯 Framework-Specific Adaptations

### Next.js/React Projects
```
"Convert this three-tier template to use Next.js with:
- API routes instead of Flask
- Vercel or Docker deployment
- Tailwind CSS for styling
- PostgreSQL database"
```

### Django Projects
```
"Adapt this template for Django with:
- Django REST Framework
- PostgreSQL database
- Redis for caching
- Celery for background tasks"
```

### Node.js/Express Projects
```
"Convert this template to Node.js/Express with:
- Express server
- MongoDB or PostgreSQL
- JWT authentication
- Proper API structure"
```

## 🔧 Environment Variables Setup

### Local Development (.env)
```
ENVIRONMENT=localhost
DATABASE_URL=sqlite:///local.db
REDIS_URL=redis://localhost:6379
FLASK_ENV=development
```

### Dev Environment (Digital Ocean)
```
ENVIRONMENT=dev
DATABASE_URL=[SUPABASE_DEV_URL]
REDIS_URL=[UPSTASH_DEV_URL]
FLASK_ENV=production
```

### Production Environment (Digital Ocean)
```
ENVIRONMENT=production
DATABASE_URL=[SUPABASE_PROD_URL]
REDIS_URL=[UPSTASH_PROD_URL]
FLASK_ENV=production
```

## 📊 Database Strategy

### Supabase Setup (Recommended)
Tell Claude Code:
```
"Set up three separate Supabase databases for my three-tier workflow:
1. Dev database for staging
2. Production database for live app
3. Use the same schema for both but separate data

Also set up the connection strings in my deployment configs."
```

### Alternative: PostgreSQL
```
"Set up separate PostgreSQL databases for dev and production environments using Digital Ocean managed databases"
```

## 🚀 Deployment Automation

### Auto-Deploy Setup
```
"Configure my GitHub repository so that:
1. Pushes to 'dev' branch automatically deploy to Digital Ocean dev environment
2. Pushes to 'main' branch automatically deploy to Digital Ocean production
3. Feature branches only run locally until merged"
```

### Manual Deploy Commands
```
"Deploy my current dev branch to Digital Ocean dev environment"
"Deploy main branch to production environment"
"Check deployment status for both environments"
```

## 🔍 Monitoring & Debugging

### Check App Status
```
"Check the status and logs of my Digital Ocean applications"
```

### Debug Issues
```
"My dev environment is showing [ERROR]. Please check the logs and fix the issue"
```

### Performance Monitoring
```
"Set up basic monitoring for my production environment to track uptime and performance"
```

## 🔐 Security Best Practices

### Environment Separation
- **Never** use production database for development
- **Always** use separate Redis instances for each environment
- **Store** secrets in Digital Ocean environment variables, not in code

### Access Control
```
"Set up proper access controls for my Digital Ocean environments:
- Dev environment: accessible by development team
- Production: restricted access only"
```

## 🎭 Advanced Workflows

### Feature Flag Development
```
"Add feature flag support to my three-tier workflow so I can test features in dev before enabling in production"
```

### A/B Testing Setup
```
"Set up A/B testing infrastructure in my three-tier workflow using Redis for fast feature toggling"
```

### Automated Testing
```
"Add automated testing to my workflow that runs on every push to dev before deployment"
```

## 🆘 Troubleshooting Commands

### Local Environment Issues
```
"My local Docker environment isn't working. Please reset and rebuild it"
```

### Deployment Failures
```
"My deployment to [dev/prod] failed. Please check the logs and fix the issue"
```

### Database Connection Issues
```
"I'm getting database connection errors in [environment]. Please check and fix the connection string"
```

### Branch Sync Issues
```
"My branches are out of sync. Please help me properly merge dev to main"
```

## 🎯 Success Metrics

After implementing this workflow, you should have:

✅ **Instant local feedback** - Changes visible immediately at localhost:8080
✅ **Stable development** - Never break your working environment
✅ **Safe experimentation** - Easy feature branching and reverting
✅ **Automated deployment** - Push to deploy, no manual steps
✅ **Environment isolation** - Separate databases prevent data conflicts
✅ **Scalable workflow** - Easy to add new team members

## 📞 Getting Help

If you need help implementing this workflow, just ask Claude Code:

```
"I need help implementing the three-tier development workflow. Please:
1. Review my current project structure
2. Identify what needs to be changed
3. Walk me through the implementation step by step
4. Test that everything is working correctly"
```

Remember: The goal is to have the exact same workflow as shown in the video - localhost for development, Digital Ocean for dev/staging, and Digital Ocean for production, all automated through Claude Code and MCP servers.