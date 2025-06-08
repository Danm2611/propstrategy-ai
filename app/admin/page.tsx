import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp,
  Activity,
  CreditCard
} from "lucide-react"

export default async function AdminDashboard() {
  // Fetch statistics
  const [
    totalUsers,
    totalReports,
    totalRevenue,
    activeSubscriptions,
    recentReports,
    recentPayments
  ] = await Promise.all([
    prisma.user.count(),
    prisma.report.count(),
    prisma.payment.aggregate({
      where: { status: 'succeeded' },
      _sum: { amount: true }
    }),
    prisma.subscription.count({
      where: { status: 'active' }
    }),
    prisma.report.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    }),
    prisma.payment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    })
  ])

  const stats = [
    {
      title: "Total Users",
      value: totalUsers.toLocaleString(),
      icon: Users,
      change: "+12%",
      changeType: "positive"
    },
    {
      title: "Total Reports",
      value: totalReports.toLocaleString(),
      icon: FileText,
      change: "+23%",
      changeType: "positive"
    },
    {
      title: "Total Revenue",
      value: `£${((totalRevenue._sum.amount || 0) / 100).toLocaleString()}`,
      icon: DollarSign,
      change: "+18%",
      changeType: "positive"
    },
    {
      title: "Active Subscriptions",
      value: activeSubscriptions.toLocaleString(),
      icon: CreditCard,
      change: "+5%",
      changeType: "positive"
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to your admin dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>
              Latest property analysis reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {report.propertyAddress}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {report.user.email} • {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      report.status === 'completed' ? 'bg-green-100 text-green-800' :
                      report.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>
              Latest transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {payment.user.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {payment.credits} credits • {new Date(payment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-sm font-medium">
                    £{(payment.amount / 100).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}