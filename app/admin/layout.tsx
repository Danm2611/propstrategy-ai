import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  // Check if user is admin (you'll need to add an isAdmin field to User model)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true }
  })

  // For now, check if email is a specific admin email
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || ['admin@propertyagent.com']
  
  if (!user || !adminEmails.includes(user.email)) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <nav className="flex gap-6">
              <a href="/admin" className="text-gray-700 hover:text-gray-900">
                Dashboard
              </a>
              <a href="/admin/users" className="text-gray-700 hover:text-gray-900">
                Users
              </a>
              <a href="/admin/reports" className="text-gray-700 hover:text-gray-900">
                Reports
              </a>
              <a href="/dashboard" className="text-gray-700 hover:text-gray-900">
                ← Back to App
              </a>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}