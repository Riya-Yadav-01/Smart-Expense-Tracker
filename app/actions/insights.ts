'use server'

import { z } from 'zod'
import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'

const insightsSchema = z.object({
  totalSpent: z.number(),
  averageTransaction: z.number(),
  categoryBreakdown: z.record(z.number()),
  topCategories: z.array(z.object({
    category: z.string(),
    amount: z.number(),
    percentage: z.number(),
  })),
  spendingTrends: z.array(z.object({
    period: z.string(),
    amount: z.number(),
  })),
  patterns: z.array(z.string()),
  anomalies: z.array(z.object({
    date: z.string(),
    category: z.string(),
    amount: z.number(),
    reason: z.string(),
  })),
  recommendations: z.array(z.string()),
  budgetSuggestions: z.record(z.number()),
})

export type ExpenseInsights = z.infer<typeof insightsSchema>

export async function generateExpenseInsights(expenseData: Array<{
  amount: number
  category: string
  description?: string
  date: string
}>) {
  if (expenseData.length === 0) {
    return {
      message: 'No expenses to analyze yet.',
      insights: null,
    }
  }

  const prompt = `Analyze the following expense data and provide comprehensive financial insights:

${JSON.stringify(expenseData, null, 2)}

Generate detailed insights including:
1. Total spending and average transaction value
2. Category-wise breakdown with percentages
3. Spending trends over time
4. Identified spending patterns (recurring purchases, unusual behaviors)
5. Anomalies or unusual spending spikes
6. Personalized recommendations to reduce spending
7. Suggested budget limits per category based on spending history

Focus on actionable insights that help the user understand and optimize their spending habits.`

  try {
    const result = await generateObject({
      model: openai('gpt-4-turbo'),
      schema: insightsSchema,
      prompt,
      system: 'You are a financial advisor analyzing expense data. Provide detailed, actionable insights based on spending patterns.',
    })

    return {
      message: 'Insights generated successfully',
      insights: result.object,
    }
  } catch (error) {
    console.error('Error generating insights:', error)
    throw new Error('Failed to generate insights')
  }
}
