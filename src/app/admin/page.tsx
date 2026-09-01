import { isAdminAuthenticated } from '@/lib/auth/admin'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/server'
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient'

export default async function AdminPage() {
  const isAuth = await isAdminAuthenticated()
  if (!isAuth) {
    redirect('/admin/login')
  }

  const supabase = await createAdminClient()

  // Fetch sessions
  const { data: sessions } = await supabase
    .from('game_sessions')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#F7F7F5] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">BME Mission Roulette Admin</h1>
        </header>
        <AdminDashboardClient initialSessions={sessions || []} />
      </div>
    </div>
  )
}
