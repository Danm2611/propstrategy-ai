import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createAnalysisSchema = z.object({
  propertyAddress: z.string().min(5),
  propertyPostcode: z.string().min(3),
  purchasePrice: z.string().transform((val) => parseFloat(val)),
  propertyType: z.enum(["residential", "commercial", "office", "care_home", "mixed_use"]),
  currentCondition: z.enum(["operational", "vacant", "needs_renovation", "derelict"]),
  propertySize: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  numberOfUnits: z.string().optional().transform((val) => val ? parseInt(val) : undefined),
  reportType: z.enum(["basic", "professional", "development"]),
  developmentGoals: z.array(z.string()),
  additionalNotes: z.string().optional(),
})

const reportPrices = {
  basic: 49,
  professional: 149,
  development: 299,
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Parse form data
    const formData = await req.formData()
    const data: any = {}
    
    // Extract non-file fields
    for (const [key, value] of formData.entries()) {
      if (key === "files") continue
      
      if (key === "developmentGoals[]") {
        if (!data.developmentGoals) data.developmentGoals = []
        data.developmentGoals.push(value)
      } else {
        data[key] = value
      }
    }

    console.log("Received form data:", data)

    // Validate data
    const validatedData = createAnalysisSchema.parse(data)

    // Check user credits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true }
    })

    if (!user || user.credits < 1) {
      return NextResponse.json(
        { error: "Insufficient credits. Please purchase more credits to continue." },
        { status: 403 }
      )
    }

    // Create report record
    const report = await prisma.report.create({
      data: {
        userId: session.user.id,
        propertyAddress: validatedData.propertyAddress,
        propertyPostcode: validatedData.propertyPostcode,
        purchasePrice: validatedData.purchasePrice,
        propertyType: validatedData.propertyType,
        condition: validatedData.currentCondition,
        reportType: validatedData.reportType,
        reportData: {
          propertySize: validatedData.propertySize,
          numberOfUnits: validatedData.numberOfUnits,
          developmentGoals: validatedData.developmentGoals,
          additionalNotes: validatedData.additionalNotes,
        },
        status: "processing",
      }
    })

    // Deduct credit and log transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: session.user.id },
        data: { credits: { decrement: 1 } }
      }),
      prisma.creditLog.create({
        data: {
          userId: session.user.id,
          creditsChange: -1,
          creditsAfter: user.credits - 1,
          transactionType: "used",
          description: `${validatedData.reportType} analysis for ${validatedData.propertyAddress}`,
          relatedId: report.id,
        }
      })
    ])

    // Handle file uploads
    const files = formData.getAll("files") as File[]
    const uploadedFiles: string[] = []
    
    if (files.length > 0) {
      try {
        const { uploadFiles } = await import('@/lib/upload')
        const uploads = await uploadFiles(files, {
          folder: `reports/${report.id}`,
          maxSize: 50 * 1024 * 1024, // 50MB
          allowedTypes: [
            'image/jpeg',
            'image/png', 
            'image/gif',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          ]
        })
        
        // Store upload URLs
        uploadedFiles.push(...uploads.map(u => u.url))
        
        // Update report with file URLs
        await prisma.report.update({
          where: { id: report.id },
          data: {
            reportData: {
              ...(report.reportData as any || {}),
              uploadedFiles
            }
          }
        })
      } catch (uploadError) {
        console.error('File upload error:', uploadError)
        // Continue without uploads - don't fail the entire request
      }
    }

    // Queue analysis job with Claude API
    processAnalysis(report.id, validatedData).catch(console.error)

    return NextResponse.json({
      reportId: report.id,
      status: "processing",
      message: "Your analysis has been queued and will be ready shortly."
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating analysis:", error)
    return NextResponse.json(
      { error: "Failed to create analysis" },
      { status: 500 }
    )
  }
}

// Process analysis with Claude API
async function processAnalysis(reportId: string, data: any) {
  try {
    // Import enhanced analysis services
    const { generateStructuredPropertyAnalysis } = await import('@/lib/claude-structured-analyzer')
    
    // Use different PDF generators based on environment
    const isProduction = process.env.NODE_ENV === 'production'
    const pdfGenerator = isProduction 
      ? await import('@/lib/pdf-simple')
      : await import('@/lib/advanced-pdf-formatter')
    
    // Get the full report data
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: { user: true }
    })
    
    if (!report) {
      throw new Error('Report not found')
    }
    
    // Prepare property data for Claude
    const propertyData = {
      propertyAddress: report.propertyAddress,
      propertyPostcode: report.propertyPostcode,
      purchasePrice: report.purchasePrice,
      propertyType: report.propertyType,
      currentCondition: report.condition,
      propertySize: data.propertySize,
      numberOfUnits: data.numberOfUnits,
      developmentGoals: data.developmentGoals || [],
      additionalNotes: data.additionalNotes,
      reportType: report.reportType,
    }
    
    // Generate structured analysis with comprehensive research
    const structuredAnalysis = await generateStructuredPropertyAnalysis(propertyData)
    
    // Generate PDF report based on environment
    const pdfBuffer = isProduction 
      ? await pdfGenerator.generateSimpleAdvancedReport(
          {
            propertyAddress: report.propertyAddress,
            reportType: report.reportType,
            createdAt: report.createdAt,
            userId: report.userId
          },
          structuredAnalysis
        )
      : await pdfGenerator.generateAdvancedPropertyReport(
          {
            html: JSON.stringify(structuredAnalysis),
            propertyAddress: report.propertyAddress,
            reportType: report.reportType,
            createdAt: report.createdAt,
            userId: report.userId
          },
          structuredAnalysis
        )
    
    // Save PDF to file system (in production, upload to S3/R2)
    const fs = await import('fs/promises')
    const path = await import('path')
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadsDir, { recursive: true })
    
    const fileName = `report-${reportId}.pdf`
    const filePath = path.join(uploadsDir, fileName)
    await fs.writeFile(filePath, pdfBuffer)
    
    // Update report with completed status
    await prisma.report.update({
      where: { id: reportId },
      data: {
        status: "completed",
        reportUrl: `/uploads/${fileName}`,
        reportData: {
          ...report.reportData as any,
          structuredAnalysis,
          generatedAt: new Date().toISOString(),
        }
      }
    })
    
    // Send completion email notification
    try {
      const { sendReportCompletionEmail } = await import('@/lib/email')
      await sendReportCompletionEmail(
        report.user.email,
        report.user.name,
        reportId,
        report.propertyAddress,
        `/uploads/${fileName}`
      )
    } catch (emailError) {
      console.error('Failed to send completion email:', emailError)
    }
    
    console.log(`Report ${reportId} completed successfully`)
    
  } catch (error) {
    console.error('Error processing analysis:', error)
    
    // Update report status to failed
    await prisma.report.update({
      where: { id: reportId },
      data: {
        status: "failed",
        reportData: {
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        }
      }
    })

    // Send failure email notification
    try {
      const { sendReportFailureEmail } = await import('@/lib/email')
      const report = await prisma.report.findUnique({
        where: { id: reportId },
        include: { user: true }
      })
      
      if (report) {
        await sendReportFailureEmail(
          report.user.email,
          report.user.name,
          reportId,
          report.propertyAddress,
          error instanceof Error ? error.message : 'Unknown error occurred'
        )
      }
    } catch (emailError) {
      console.error('Failed to send failure email:', emailError)
    }
    
    // Refund credit
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: { user: true }
    })
    
    if (report) {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: report.userId },
          data: { credits: { increment: 1 } }
        }),
        prisma.creditLog.create({
          data: {
            userId: report.userId,
            creditsChange: 1,
            creditsAfter: report.user.credits + 1,
            transactionType: "refund",
            description: `Refund for failed analysis: ${report.propertyAddress}`,
            relatedId: reportId,
          }
        })
      ])
    }
  }
}