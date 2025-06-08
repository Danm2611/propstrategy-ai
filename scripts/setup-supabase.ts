import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (prompt: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function setupSupabase() {
  console.log('🚀 Supabase Setup Wizard\n')
  
  console.log('Please follow these steps:')
  console.log('1. Go to https://supabase.com and create a new project')
  console.log('2. Once created, go to Settings → Database')
  console.log('3. Copy the "Connection string" URI\n')
  
  const connectionString = await question('Paste your Supabase connection string here: ')
  
  if (!connectionString.includes('supabase.com')) {
    console.error('❌ Invalid connection string. Please make sure it contains "supabase.com"')
    process.exit(1)
  }
  
  // Add pooler settings for serverless
  const poolerString = connectionString.includes('?') 
    ? `${connectionString}&pgbouncer=true&connection_limit=1`
    : `${connectionString}?pgbouncer=true&connection_limit=1`
  
  // Update .env file
  const envPath = path.join(process.cwd(), '.env')
  let envContent = fs.readFileSync(envPath, 'utf-8')
  
  // Comment out old SQLite URL and add new PostgreSQL URL
  envContent = envContent.replace(
    /^DATABASE_URL=.*$/m,
    `# SQLite (old)\n# DATABASE_URL=file:./dev.db\n\n# Supabase PostgreSQL\nDATABASE_URL="${poolerString}"`
  )
  
  fs.writeFileSync(envPath, envContent)
  console.log('✅ Updated .env file with Supabase connection\n')
  
  const runMigration = await question('Do you want to run database migrations now? (y/n): ')
  
  if (runMigration.toLowerCase() === 'y') {
    console.log('\n📦 Running Prisma migrations...')
    
    try {
      // Generate Prisma client
      execSync('npx prisma generate', { stdio: 'inherit' })
      
      // Push schema to database
      execSync('npx prisma db push', { stdio: 'inherit' })
      
      console.log('✅ Database schema created successfully!\n')
      
      const migrateData = await question('Do you want to migrate existing data from SQLite? (y/n): ')
      
      if (migrateData.toLowerCase() === 'y') {
        console.log('\n🔄 Migrating data...')
        execSync('npx tsx scripts/migrate-to-supabase.ts', { stdio: 'inherit' })
      }
      
    } catch (error) {
      console.error('❌ Migration failed:', error)
    }
  }
  
  console.log('\n✨ Supabase setup complete!')
  console.log('You can now run: npm run dev')
  
  rl.close()
}

setupSupabase().catch(console.error)