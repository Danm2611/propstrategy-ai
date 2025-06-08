import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Download, 
  FileText, 
  Building2, 
  MapPin,
  Calendar,
  DollarSign,
  Loader2
} from "lucide-react"
import Link from "next/link"

export default async function ReportPage({ 
  params 
}: { 
  params: Promise<{ reportId: string }>
}) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    notFound()
  }

  const { reportId } = await params

  const report = await prisma.report.findFirst({
    where: {
      id: reportId,
      userId: session.user.id,
    },
  })

  if (!report) {
    notFound()
  }

  const statusColors = {
    processing: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  }

  const reportTypeLabels = {
    basic: "Basic Report",
    professional: "Professional Report",
    development: "Development Appraisal",
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mb-4">
            ← Back to Dashboard
          </Button>
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Property Analysis Report</h1>
            <p className="text-muted-foreground">
              {report.propertyAddress}, {report.propertyPostcode}
            </p>
          </div>
          
          <Badge className={statusColors[report.status as keyof typeof statusColors]}>
            {report.status}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Report Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Report Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Property Type</p>
                  <p className="font-medium capitalize">{report.propertyType.replace("_", " ")}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Purchase Price</p>
                  <p className="font-medium">£{report.purchasePrice.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Report Type</p>
                  <p className="font-medium">{reportTypeLabels[report.reportType as keyof typeof reportTypeLabels]}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">{new Date(report.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {report.status === "processing" && (
              <Card className="bg-muted/50">
                <CardContent className="flex items-center gap-3 pt-6">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <div>
                    <p className="font-medium">Processing your analysis...</p>
                    <p className="text-sm text-muted-foreground">
                      This usually takes 2-5 minutes. We'll notify you when it's ready.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {report.status === "failed" && (
              <Card className="bg-red-50 dark:bg-red-900/10">
                <CardContent className="pt-6">
                  <p className="font-medium text-red-800 dark:text-red-400">Analysis Failed</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {(report.reportData as any)?.error || "An error occurred processing your report. Your credit has been refunded."}
                  </p>
                </CardContent>
              </Card>
            )}

            {report.status === "completed" && report.reportUrl && (
              <div className="pt-4">
                <Link href={report.reportUrl} target="_blank">
                  <Button className="w-full sm:w-auto">
                    <Download className="mr-2 h-4 w-4" />
                    Download Report (PDF)
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Property Condition</p>
              <p className="font-medium capitalize">{report.condition.replace("_", " ")}</p>
            </div>

            {(report.reportData as any)?.propertySize && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Property Size</p>
                <p className="font-medium">{(report.reportData as any).propertySize} sq ft</p>
              </div>
            )}

            {(report.reportData as any)?.numberOfUnits && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Number of Units</p>
                <p className="font-medium">{(report.reportData as any).numberOfUnits}</p>
              </div>
            )}

            {(report.reportData as any)?.developmentGoals && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Development Strategies</p>
                <div className="flex flex-wrap gap-2">
                  {(report.reportData as any).developmentGoals.map((goal: string) => (
                    <Badge key={goal} variant="secondary" className="text-xs">
                      {goal.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {(report.reportData as any)?.additionalNotes && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Additional Notes</p>
                <p className="text-sm">{(report.reportData as any).additionalNotes}</p>
              </div>
            )}

            {(report.reportData as any)?.uploadedFiles && (report.reportData as any).uploadedFiles.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Uploaded Files</p>
                <div className="space-y-2">
                  {(report.reportData as any).uploadedFiles.map((fileUrl: string, index: number) => (
                    <Link 
                      key={index}
                      href={fileUrl} 
                      target="_blank"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <FileText className="h-4 w-4" />
                      {fileUrl.split('/').pop()}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Executive Summary (if available) */}
      {report.status === "completed" && (report.reportData as any)?.executiveSummary && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Executive Summary</CardTitle>
            <CardDescription>
              AI-generated analysis of your property investment opportunity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: (report.reportData as any).executiveSummary }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}