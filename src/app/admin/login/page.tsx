import { authenticateAdmin } from '@/lib/auth/admin'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export default function AdminLogin() {
  async function login(formData: FormData) {
    'use server'
    const passcode = formData.get('passcode') as string
    const ok = await authenticateAdmin(passcode)
    if (ok) {
      redirect('/admin')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F7F7F5]">
      <div className="card max-w-sm w-full p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Access</h1>
        <form action={login} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Passcode</label>
            <input 
              name="passcode" 
              type="password" 
              required
              className="input-field" 
              placeholder="Enter passcode"
            />
          </div>
          <Button type="submit" className="w-full">Sign In</Button>
        </form>
      </div>
    </div>
  )
}
