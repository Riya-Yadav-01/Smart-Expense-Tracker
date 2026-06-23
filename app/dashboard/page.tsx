import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ExpenseForm } from '@/components/expense-form'
import { ExpenseList } from '@/components/expense-list'
import { LogOut } from 'lucide-react'

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Expense Tracker</h1>
            <p className="text-sm text-gray-500">Welcome, {session.user.name || session.user.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/insights">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                View Insights
              </Button>
            </Link>
            <form action={async () => {
              'use server'
              await auth.api.signOut({ headers: await headers() })
              redirect('/sign-in')
            }}>
              <Button type="submit" variant="outline" className="flex items-center gap-2">
                <LogOut size={18} />
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-1">
            <ExpenseForm />
          </div>

          {/* List Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Expenses</h2>
              <ExpenseList />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
