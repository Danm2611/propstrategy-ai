# Supabase Setup Guide

## ✅ Project Successfully Created!

**Project Details:**
- **Name**: PropertyAgent
- **ID**: wqllmdgptrvriewrwfet
- **Region**: eu-west-2
- **Status**: ACTIVE_HEALTHY
- **URL**: https://wqllmdgptrvriewrwfet.supabase.co
- **Database Host**: db.wqllmdgptrvriewrwfet.supabase.co

## 🔐 Important: Database Password

You need to:
1. Go to your Supabase dashboard at https://supabase.com/dashboard/project/wqllmdgptrvriewrwfet
2. Navigate to Settings → Database
3. Find your database password or reset it if needed
4. Update the DATABASE_URL in your .env file with the password

## 2. Get Database Connection String

Once your project is created:

1. Go to Settings → Database
2. Find "Connection string" section
3. Copy the "URI" connection string
4. It should look like:
   ```
   postgresql://postgres.[your-project-ref]:[your-password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```

## 3. Update Environment Variables

Replace the DATABASE_URL in your `.env` file with your Supabase connection string:

```env
# Old SQLite URL (comment out or remove)
# DATABASE_URL=file:./dev.db

# New Supabase URL (Update [YOUR-PASSWORD] with your actual password)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.wqllmdgptrvriewrwfet.supabase.co:5432/postgres"
```

Note: Add `?pgbouncer=true&connection_limit=1` for serverless compatibility.

## 4. Alternative: Direct Connection (for migrations)

For running migrations, you might need the direct connection:
```env
DIRECT_URL="postgresql://postgres.[your-project-ref]:[your-password]@aws-0-[region].pooler.supabase.com:5432/postgres"
```

## 5. Run Database Migration

Once you've updated your .env file, run:
```bash
npx prisma migrate deploy
npx prisma generate
```

## 6. (Optional) Enable Row Level Security

In Supabase dashboard:
1. Go to Authentication → Policies
2. Enable RLS on all tables
3. Create appropriate policies for your app

## Notes

- The pooler connection (port 6543) is recommended for serverless
- The direct connection (port 5432) is for migrations
- Your existing schema will work with PostgreSQL
- All data types are compatible