import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'
import { prisma } from '../../../../lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { credits } = await request.json()
    
    if (!credits || credits !== 10) {
      return NextResponse.json(
        { error: 'Invalid credits amount' },
        { status: 400 }
      )
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user has already claimed free credits (optional limit)
    const existingFreeCredits = await prisma.creditLog.count({
      where: {
        userId: user.id,
        transactionType: 'bonus',
        description: { contains: 'Free credits - Enhanced AI' }
      }
    })

    // Allow up to 2 free credit claims per user
    if (existingFreeCredits >= 2) {
      return NextResponse.json(
        { error: 'Free credits limit reached' },
        { status: 400 }
      )
    }

    // Add credits to user account
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { credits: user.credits + credits }
    })

    // Log the credit addition
    await prisma.creditLog.create({
      data: {
        userId: user.id,
        creditsChange: credits,
        creditsAfter: updatedUser.credits,
        transactionType: 'bonus',
        description: 'Free credits - Enhanced AI with live property data',
        relatedId: null
      }
    })

    console.log(`✅ Added ${credits} free credits to ${user.email}`)

    return NextResponse.json({
      success: true,
      credits: updatedUser.credits,
      message: `${credits} free credits added successfully!`
    })

  } catch (error) {
    console.error('Add free credits error:', error)
    return NextResponse.json(
      { error: 'Failed to add free credits' },
      { status: 500 }
    )
  }
}