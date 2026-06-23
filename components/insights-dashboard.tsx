'use client'

import { useState } from 'react'
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts'
import { generateExpenseInsights } from '@/app/actions/insights'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

interface Expense {
  id: string
  amount: number
  category: string
  description: string
  date: string
}

interface InsightsDashboardProps {
  expenses: Expense[]
}

export default function InsightsDashboard({ expenses }: InsightsDashboardProps) {
  const [insights, setInsights] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const generateInsights = async () => {
    setLoading(true)
    try {
      const expenseData = expenses.map((e) => ({
        amount: e.amount,
        category: e.category,
        description: e.description,
        date: e.date,
      }))

      const result = await generateExpenseInsights(expenseData)
      setInsights(result.insights)
    } catch (error) {
      console.error('Error generating insights:', error)
      alert('Failed to generate AI insights. Please ensure OPENAI_API_KEY is set.')
    } finally {
      setLoading(false)
    }
  }

  // Calculate category breakdown
  const categoryBreakdown = expenses.reduce(
    (acc: any, expense) => {
      const existing = acc.find((item: any) => item.name === expense.category)
      if (existing) {
        existing.value += expense.amount
      } else {
        acc.push({ name: expense.category, value: expense.amount })
      }
      return acc
    },
    []
  )

  // Calculate total and average
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
  const averageTransaction = totalSpent / expenses.length

  // Calculate trends by date
  const trendData = expenses.reduce(
    (acc: any, expense) => {
      const existing = acc.find((item: any) => item.date === expense.date)
      if (existing) {
        existing.amount += expense.amount
      } else {
        acc.push({ date: expense.date, amount: expense.amount })
      }
      return acc
    },
    []
  )

  if (!insights) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Click "Generate Insights" to see AI-powered analysis of your spending patterns.</p>
        <button
          onClick={generateInsights}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
        >
          {loading ? 'Generating...' : 'Generate AI Insights'}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Total Spent</p>
          <p className="text-2xl font-bold text-blue-600">${totalSpent.toFixed(2)}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Average Transaction</p>
          <p className="text-2xl font-bold text-green-600">${averageTransaction.toFixed(2)}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Total Transactions</p>
          <p className="text-2xl font-bold text-purple-600">{expenses.length}</p>
        </div>
      </div>

      {/* Category Breakdown Chart */}
      {categoryBreakdown.length > 0 && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categoryBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {categoryBreakdown.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Spending Trends */}
      {trendData.length > 0 && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Spending Trends</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" style={{ fontSize: '12px' }} />
              <YAxis style={{ fontSize: '12px' }} />
              <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
              <Line type="monotone" dataKey="amount" stroke="#3b82f6" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* AI Insights */}
      {insights && (
        <>
          {/* Patterns */}
          {insights.patterns && insights.patterns.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Spending Patterns</h3>
              <ul className="space-y-2">
                {insights.patterns.slice(0, 3).map((pattern: string, idx: number) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>{pattern}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {insights.recommendations && insights.recommendations.length > 0 && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Recommendations</h3>
              <ul className="space-y-2">
                {insights.recommendations.slice(0, 3).map((rec: string, idx: number) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Anomalies */}
          {insights.anomalies && insights.anomalies.length > 0 && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Unusual Spending</h3>
              <ul className="space-y-2">
                {insights.anomalies.slice(0, 2).map((anomaly: any, idx: number) => (
                  <li key={idx} className="text-sm">
                    <p className="font-medium text-gray-900">{anomaly.category} - ${anomaly.amount.toFixed(2)}</p>
                    <p className="text-xs text-gray-600">{anomaly.reason}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Budget Suggestions */}
          {insights.budgetSuggestions && (
            <div className="bg-white border border-gray-200 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Suggested Monthly Budget</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(insights.budgetSuggestions)
                  .slice(0, 6)
                  .map(([category, amount]: any) => (
                    <div key={category} className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-600">{category}</p>
                      <p className="text-sm font-bold text-blue-600">${amount.toFixed(2)}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
