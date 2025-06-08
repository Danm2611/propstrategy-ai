import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { 
  ArrowRight, 
  Building2, 
  CreditCard, 
  FileText, 
  TrendingUp,
  Clock,
  Download
} from "lucide-react"
import { format } from "date-fns"

async function getDashboardData(userId: string) {
  const [user, reports, recentCredits] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        credits: true,
        subscription: true,
        subscriptionEnd: true,
      },
    }),
    prisma.report.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        propertyAddress: true,
        propertyType: true,
        reportType: true,
        status: true,
        createdAt: true,
        reportUrl: true,
      },
    }),
    prisma.creditLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        creditsChange: true,
        creditsAfter: true,
        transactionType: true,
        description: true,
        createdAt: true,
      },
    }),
  ])

  return { user, reports, recentCredits }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const { user, reports, recentCredits } = await getDashboardData(session.user.id)

  if (!user) {
    redirect("/auth/signin")
  }

  const totalReports = reports.length
  const completedReports = reports.filter(r => r.status === "completed").length
  const pendingReports = reports.filter(r => r.status === "processing").length

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {user.name || "there"}!</h1>
        <p className="text-muted-foreground">
          Manage your property analyses and account settings
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits Available</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.credits}</div>
            <p className="text-xs text-muted-foreground">
              {user.subscription ? `${user.subscription} plan` : "Pay as you go"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReports}</div>
            <p className="text-xs text-muted-foreground">
              {completedReports} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReports}</div>
            <p className="text-xs text-muted-foreground">
              Reports in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.subscription || "Free"}
            </div>
            <p className="text-xs text-muted-foreground">
              {user.subscriptionEnd 
                ? `Renews ${format(new Date(user.subscriptionEnd), "MMM d")}`
                : "Upgrade for more"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Start New Analysis</CardTitle>
            <CardDescription>
              Create a comprehensive property investment report
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {user.credits} credits available
              </span>
            </div>
            <Link href="/analyze">
              <Button className="gap-2">
                New Analysis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Get More Credits</CardTitle>
            <CardDescription>
              Purchase credits or upgrade your subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                From £49 per report
              </span>
            </div>
            <Link href="/pricing">
              <Button variant="outline" className="gap-2">
                View Pricing
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>
            Your latest property analyses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{report.propertyAddress}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-muted-foreground">
                        {report.propertyType}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(report.createdAt), "MMM d, yyyy")}
                      </span>
                      <Badge variant={
                        report.status === "completed" ? "default" : 
                        report.status === "processing" ? "secondary" : 
                        "destructive"
                      }>
                        {report.status}
                      </Badge>
                    </div>
                  </div>
                  {report.status === "completed" && report.reportUrl && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={report.reportUrl} download>
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No reports yet</p>
              <Link href="/analyze">
                <Button>Create Your First Report</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Credit History */}
      <Card>
        <CardHeader>
          <CardTitle>Credit History</CardTitle>
          <CardDescription>
            Your recent credit transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentCredits.length > 0 ? (
            <div className="space-y-4">
              {recentCredits.map((credit) => (
                <div
                  key={credit.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">{credit.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(credit.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      credit.creditsChange > 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {credit.creditsChange > 0 ? "+" : ""}{credit.creditsChange}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Balance: {credit.creditsAfter}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              No credit transactions yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}