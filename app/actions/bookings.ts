'use server'

import { revalidatePath } from 'next/cache'
import { isDemoMode } from '@/lib/is-demo'
import { demoStore } from '@/lib/demo-store'

type BookingPayload = {
  customer_name: string; airline_name: string
  total_pkr: number; cost_pkr: number; profit_pkr: number
  advance_pkr: number; paid_pkr: number; remaining_pkr: number
  adult_count: number; child_count: number; infant_count: number
  makkah_hotel_name: string | null; makkah_hotel_location: string | null
  makkah_hotel_distance: string | null; makkah_room_type: string | null; makkah_nights: number | null
  madinah_hotel_name: string | null; madinah_hotel_location: string | null
  madinah_hotel_distance: string | null; madinah_room_type: string | null; madinah_nights: number | null
  booking_date?: string
}

export async function createBooking(payload: BookingPayload) {
  if (isDemoMode()) {
    demoStore.addBooking({ ...payload, booking_date: payload.booking_date ?? new Date().toISOString().split('T')[0] })
    revalidatePath('/bookings'); revalidatePath('/dashboard')
    revalidatePath('/accounts'); revalidatePath('/reports')
    revalidatePath('/customers'); revalidatePath('/invoices')
    return { success: true }
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { error } = await supabase.from('bookings').insert(payload)
  if (error) return { error: error.message }

  revalidatePath('/bookings'); revalidatePath('/dashboard')
  revalidatePath('/accounts'); revalidatePath('/reports')
  revalidatePath('/customers'); revalidatePath('/invoices')
  return { success: true }
}

export async function deleteBooking(id: string) {
  if (isDemoMode()) {
    demoStore.deleteBooking(id)
  } else {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    await supabase.from('bookings').delete().eq('id', id)
  }

  revalidatePath('/bookings'); revalidatePath('/dashboard')
  revalidatePath('/accounts'); revalidatePath('/reports')
  revalidatePath('/customers'); revalidatePath('/invoices')
  return { success: true }
}
