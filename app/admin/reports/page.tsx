import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"

export default async function AdminReportsPage({
  searchParams
}: {
  searchParams: { 
    search?: string
    page?: string
    status?: string
    type?: string
  }
}) {
  const page = parseInt(searchParams.page || "1")
  const pageSize = 20
  const search = searchParams.search || ""
  const status = searchParams.status || "all"
  const type = searchParams.type || "all"

  const where: any = {}
  
  if (search) {
    where.OR = [
      { propertyAddress: { contains: search, mode: 'insensitive' } },
      { propertyPostcode: { contains: search, mode: 'insensitive' } },
      { user: { email: { contains: search, mode: 'insensitive' } } }
    ]
  }
  
  if (status !== "all") {
    where.status = status
  }
  
  if (type !== "all") {
    where.reportType = type
  }

  const [reports, totalCount] = await Promise.all([
    prisma.report.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        }
      }
    }),
    prisma.report.count({ where })
  ])

  const totalPages = Math.ceil(totalCount / pageSize)

  const statusColors = {
    processing: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  }

  const reportTypeLabels = {
    basic: "Basic",
    professional: "Professional",
    development: "Development",
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">
            Manage property analysis reports
          </p>
        </div>
        <Button>Export Reports</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>All Reports</CardTitle>
              <CardDescription>
                Total: {totalCount} reports
              </CardDescription>
            </div>
            <form className="flex gap-2">
              <Input
                placeholder="Search reports..."
                name="search"
                defaultValue={search}
                className="w-64"
              />
              <Select name="status" defaultValue={status}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select name="type" defaultValue={type}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit">Filter</Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{report.propertyAddress}</p>
                      <p className="text-sm text-muted-foreground">{report.propertyPostcode}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{report.user.name || 'Unnamed'}</p>
                      <p className="text-xs text-muted-foreground">{report.user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {reportTypeLabels[report.reportType as keyof typeof reportTypeLabels]}
                    </Badge>
                  </TableCell>
                  <TableCell>£{report.purchasePrice.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[report.status as keyof typeof statusColors]}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(report.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/reports/${report.id}`} target="_blank">
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                      {report.status === "failed" && (
                        <Button variant="outline" size="sm">Retry</Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {page > 1 && (
                <Link href={`/admin/reports?page=${page - 1}&search=${search}&status=${status}&type=${type}`}>
                  <Button variant="outline" size="sm">Previous</Button>
                </Link>
              )}
              <span className="py-2 px-4 text-sm">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link href={`/admin/reports?page=${page + 1}&search=${search}&status=${status}&type=${type}`}>
                  <Button variant="outline" size="sm">Next</Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}