'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { expenses, expenseInsights } from '@/lib/db/schema'
import { eq, desc, and, gte, lte } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function addExpense(
  amount: string,
  category: string,
  description: string,
  date: string
) {
  const userId = await getUserId()

  await db.insert(expenses).values({
    userId,
    amount: amount,
    category,
    description,
    date: new Date(date),
  })

  revalidatePath('/dashboard')
  revalidatePath('/insights')
}

export async function getExpenses(startDate?: Date, endDate?: Date) {
  const userId = await getUserId()

  let query = db
    .select()
    .from(expenses)
    .where(eq(expenses.userId, userId))

  if (startDate && endDate) {
    query = db
      .select()
      .from(expenses)
      .where(
        and(
          eq(expenses.userId, userId),
          gte(expenses.date, startDate),
          lte(expenses.date, endDate)
        )
      )
  }

  return query.orderBy(desc(expenses.date))
}

export async function deleteExpense(id: number) {
  const userId = await getUserId()

  await db
    .delete(expenses)
    .where(and(eq(expenses.id, id), eq(expenses.userId, userId)))

  revalidatePath('/dashboard')
  revalidatePath('/insights')
}

export async function updateExpense(
  id: number,
  amount: string,
  category: string,
  description: string,
  date: string
) {
  const userId = await getUserId()

  await db
    .update(expenses)
    .set({
      amount,
      category,
      description,
      date: new Date(date),
      updatedAt: new Date(),
    })
    .where(and(eq(expenses.id, id), eq(expenses.userId, userId)))

  revalidatePath('/dashboard')
  revalidatePath('/insights')
}

export async function getRecentExpenses(days: number = 30) {
  const userId = await getUserId()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  return db
    .select()
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        gte(expenses.date, startDate)
      )
    )
    .orderBy(desc(expenses.date))
}
