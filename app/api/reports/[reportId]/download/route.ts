import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: { reportId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const report = await prisma.report.findFirst({
      where: {
        id: params.reportId,
        userId: session.user.id
      }
    })

    if (!report) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      )
    }

    if (report.status !== "completed") {
      return NextResponse.json(
        { error: "Report not ready" },
        { status: 400 }
      )
    }

    // Check if we have stored PDF data in the database
    const reportData = report.reportData as any
    if (reportData?.pdfBuffer) {
      const pdfBuffer = Buffer.from(reportData.pdfBuffer, 'base64')
      
      return new Response(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="property-analysis-${report.propertyAddress.replace(/[^a-zA-Z0-9]/g, '-')}.pdf"`
        }
      })
    }

    // Fallback: try to read from file system (local development)
    try {
      const fs = await import('fs/promises')
      const path = await import('path')
      const filePath = path.join(process.cwd(), 'public', 'uploads', `report-${params.reportId}.pdf`)
      const pdfBuffer = await fs.readFile(filePath)
      
      return new Response(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="property-analysis-${report.propertyAddress.replace(/[^a-zA-Z0-9]/g, '-')}.pdf"`
        }
      })
    } catch (fileError) {
      console.error('File read error:', fileError)
    }

    // If no PDF available, regenerate or return error
    return NextResponse.json(
      { error: "PDF not available. Please regenerate the report." },
      { status: 404 }
    )

  } catch (error) {
    console.error("Error downloading report:", error)
    return NextResponse.json(
      { error: "Failed to download report" },
      { status: 500 }
    )
  }
}