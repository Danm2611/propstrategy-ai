import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('Testing database connection...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Connected to database successfully!')
    
    // Count users
    const userCount = await prisma.user.count()
    console.log(`📊 Current user count: ${userCount}`)
    
    // List tables
    const result = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
    console.log('📋 Available tables:', result)
    
    console.log('\n✅ Database connection test passed!')
    
  } catch (error) {
    console.error('❌ Database connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()