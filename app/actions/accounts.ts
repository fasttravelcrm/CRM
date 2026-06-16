'use server'

import { revalidatePath } from 'next/cache'
import { isDemoMode } from '@/lib/is-demo'
import { demoStore } from '@/lib/demo-store'
import type { ExpenseType } from '@/lib/types'

export async function addPayment(formData: FormData) {
  const bookingId = formData.get('booking_id') as string
  const amount = Number(formData.get('amount_pkr'))
  const method = formData.get('method') as 'Cash' | 'Bank' | 'JazzCash' | 'EasyPaisa'
  const note = (formData.get('note') as string) || ''

  if (isDemoMode()) {
    const booking = demoStore.bookings.find(b => b.id === bookingId)
    if (!booking) return { error: 'Booking not found' }
    demoStore.addPayment({
      booking_id: bookingId,
      customer_name: booking.customer_name,
      amount_pkr: amount,
      method,
      note,
      payment_date: new Date().toISOString().split('T')[0],
    })
    revalidatePath('/accounts'); revalidatePath('/bookings')
    revalidatePath('/dashboard'); revalidatePath('/reports')
    return { success: true }
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { data: booking, error: bookingError } = await supabase
    .from('bookings').select('customer_name, total_pkr, paid_pkr').eq('id', bookingId).single()

  if (bookingError || !booking) return { error: 'Booking not found' }

  const { error: payError } = await supabase.from('payments').insert({
    booking_id: bookingId,
    customer_name: booking.customer_name,
    amount_pkr: amount, method, note,
    payment_date: new Date().toISOString().split('T')[0],
  })
  if (payError) return { error: payError.message }

  const newPaid = booking.paid_pkr + amount
  await supabase.from('bookings')
    .update({ paid_pkr: newPaid, remaining_pkr: Math.max(0, booking.total_pkr - newPaid) })
    .eq('id', bookingId)

  revalidatePath('/accounts'); revalidatePath('/bookings')
  revalidatePath('/dashboard'); revalidatePath('/reports')
  return { success: true }
}

export async function addExpense(formData: FormData) {
  const expenseType = formData.get('expense_type') as ExpenseType
  const supplier = (formData.get('supplier') as string).trim()
  const amount = Number(formData.get('amount_pkr'))
  const method = formData.get('method') as 'Cash' | 'Bank' | 'JazzCash' | 'EasyPaisa'
  const note = (formData.get('note') as string) || ''
  const expenseDate = (formData.get('expense_date') as string) || new Date().toISOString().split('T')[0]

  if (!supplier) return { error: 'Supplier / description is required' }
  if (amount <= 0) return { error: 'Amount must be greater than zero' }

  if (isDemoMode()) {
    demoStore.addExpense({ expense_type: expenseType, supplier, amount_pkr: amount, method, note, expense_date: expenseDate })
    revalidatePath('/accounts')
    return { success: true }
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { error } = await supabase.from('expenses').insert({
    expense_type: expenseType,
    supplier,
    amount_pkr: amount,
    method,
    note,
    expense_date: expenseDate,
  })
  if (error) return { error: error.message }

  revalidatePath('/accounts')
  return { success: true }
}
