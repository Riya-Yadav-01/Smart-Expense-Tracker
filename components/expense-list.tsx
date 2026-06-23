'use client'

interface Expense {
  id: string
  amount: number
  category: string
  description: string
  date: string
}

interface ExpenseListProps {
  expenses: Expense[]
  onDeleteExpense: (id: string) => void
}

const categoryIcons: { [key: string]: string } = {
  Groceries: '🛒',
  Dining: '🍽️',
  Transportation: '🚗',
  Entertainment: '🎬',
  Shopping: '🛍️',
  Utilities: '💡',
  Healthcare: '🏥',
  Education: '📚',
  Other: '📌',
}

export default function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {sortedExpenses.length === 0 ? (
        <p className="text-center text-gray-500 text-sm py-4">No expenses yet</p>
      ) : (
        sortedExpenses.map((expense) => (
          <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{categoryIcons[expense.category] || '📌'}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{expense.category}</p>
                  <p className="text-xs text-gray-500">{expense.date}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">${expense.amount.toFixed(2)}</p>
              {expense.description && <p className="text-xs text-gray-500 max-w-xs truncate">{expense.description}</p>}
            </div>
            <button
              onClick={() => onDeleteExpense(expense.id)}
              className="ml-3 text-red-500 hover:text-red-700 text-xs font-medium transition-colors"
            >
              ✕
            </button>
          </div>
        ))
      )}
    </div>
  )
}
