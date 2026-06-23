'use client'

import { useState } from 'react'
import ExpenseForm from '@/components/expense-form'
import ExpenseList from '@/components/expense-list'
import InsightsDashboard from '@/components/insights-dashboard'

interface Expense {
  id: string
  amount: number
  category: string
  description: string
  date: string
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', amount: 45.99, category: 'Groceries', description: 'Weekly grocery shopping', date: '2024-06-20' },
    { id: '2', amount: 12.50, category: 'Dining', description: 'Coffee and breakfast', date: '2024-06-21' },
    { id: '3', amount: 89.99, category: 'Transportation', description: 'Uber rides', date: '2024-06-21' },
    { id: '4', amount: 120.00, category: 'Groceries', description: 'Costco run', date: '2024-06-19' },
    { id: '5', amount: 35.00, category: 'Entertainment', description: 'Movie tickets', date: '2024-06-18' },
    { id: '6', amount: 55.50, category: 'Dining', description: 'Dinner at restaurant', date: '2024-06-17' },
  ])

  const [showInsights, setShowInsights] = useState(false)
  const [loadingInsights, setLoadingInsights] = useState(false)

  const handleAddExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expense = {
      ...newExpense,
      id: Math.random().toString(36).substr(2, 9),
    }
    setExpenses([...expenses, expense])
  }

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id))
  }

  const handleGenerateInsights = async () => {
    setLoadingInsights(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setShowInsights(true)
    setLoadingInsights(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">💰 Smart Expense Tracker</h1>
          <p className="text-sm text-gray-600 mt-1">Track your spending and get AI-powered insights</p>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Expense</h2>
              <ExpenseForm onAddExpense={handleAddExpense} />
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h2>
              <ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">AI Insights & Analysis</h2>
                <button
                  onClick={handleGenerateInsights}
                  disabled={loadingInsights}
                  className="px-4 py-2 bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                >
                  {loadingInsights ? 'Generating...' : 'Generate Insights'}
                </button>
              </div>

              {showInsights && expenses.length > 0 ? (
                <InsightsDashboard expenses={expenses} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    {expenses.length === 0
                      ? 'Add expenses to get personalized AI insights'
                      : 'Click "Generate Insights" to analyze your spending patterns'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
