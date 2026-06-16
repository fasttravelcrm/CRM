'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { isDemoMode } from '@/lib/is-demo'

export async function login(formData: FormData) {
  if (isDemoMode()) {
    // Demo login not used (handled client-side via cookie)
    return { error: 'Demo mode active — use the demo login button.' }
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }

  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: staffUser } = await supabase
      .from('staff_users').select('status').eq('id', user.id).single()
    if (staffUser?.status === 'Inactive') {
      await supabase.auth.signOut()
      return { error: 'Your account is inactive. Contact admin.' }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  if (isDemoMode()) {
    // Clear demo session cookie server-side
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    cookieStore.delete('demo_session')
  } else {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    await supabase.auth.signOut()
  }
  revalidatePath('/', 'layout')
  redirect('/login')
}
