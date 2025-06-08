import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Find the first user and add credits
  const user = await prisma.user.findFirst()
  
  if (user) {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { credits: 10 }
    })
    
    console.log(`Added 10 credits to user: ${updatedUser.email}`)
    console.log(`User now has ${updatedUser.credits} credits`)
  } else {
    console.log('No users found in database')
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())