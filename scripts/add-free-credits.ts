import { prisma } from '@/lib/prisma'

async function addFreeCredits() {
  try {
    // Add 50 free credits to all existing users
    const users = await prisma.user.findMany()
    
    for (const user of users) {
      await prisma.user.update({
        where: { id: user.id },
        data: { credits: user.credits + 50 }
      })
      
      // Log the credit addition
      await prisma.creditLog.create({
        data: {
          userId: user.id,
          creditsChange: 50,
          creditsAfter: user.credits + 50,
          transactionType: 'bonus',
          description: 'Free credits - Enhanced AI with live property data',
          relatedId: null
        }
      })
      
      console.log(`✅ Added 50 credits to ${user.email} (${user.name})`)
    }
    
    console.log(`🎉 Successfully added 50 free credits to ${users.length} users`)
  } catch (error) {
    console.error('❌ Error adding free credits:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addFreeCredits()