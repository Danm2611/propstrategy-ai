# Supabase Database Password Reset Guide

## 📍 Step-by-Step Instructions

### 1. Access Your Supabase Dashboard
Go to: https://supabase.com/dashboard/project/wqllmdgptrvriewrwfet

### 2. Navigate to Database Settings
1. Click on the **"Settings"** icon in the left sidebar (gear icon)
2. Click on **"Database"** in the settings menu

### 3. Find Database Password Section
Look for one of these sections:
- **"Database password"**
- **"Connection info"**
- **"Database settings"**

### 4. Reset Your Password
You should see either:
- A **"Reset Database Password"** button
- A **"Generate new password"** option
- An existing password that you can copy

### 5. Update Your .env File
Once you have the password, update your `.env` file:

```bash
# Replace [YOUR-PASSWORD] with the actual password
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.wqllmdgptrvriewrwfet.supabase.co:5432/postgres
```

## 🔐 Alternative: Connection Pooler String

Sometimes Supabase provides a complete connection string with the password included:

1. In Database settings, look for **"Connection string"** or **"Connection pooling"**
2. You might see different connection strings:
   - **Session mode**: Direct connection
   - **Transaction mode**: For serverless/Vercel

3. Copy the appropriate connection string (it will include the password)

## 💡 Tips

- The password is usually auto-generated when you create the project
- If you can't find it, there's usually a "Reset" or "Regenerate" button
- After resetting, update all applications using this database
- Keep the password secure and never commit it to git

## 🚨 Still Can't Find It?

Try these locations in the Supabase dashboard:
1. **Project Settings** → **Database** → **Connection string**
2. **Project Settings** → **API** (sometimes shows connection info)
3. **Database** → **Connection pooling** → **Connection string**

The connection string will look like:
```
postgresql://postgres:YOUR_ACTUAL_PASSWORD_HERE@db.wqllmdgptrvriewrwfet.supabase.co:5432/postgres
```