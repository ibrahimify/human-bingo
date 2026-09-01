import { cookies } from 'next/headers'

const ADMIN_COOKIE_NAME = 'bme_admin_session'

export async function isAdminAuthenticated() {
  const cookieStore = await cookies()
  const val = cookieStore.get(ADMIN_COOKIE_NAME)?.value
  return val === process.env.ADMIN_SESSION_SECRET
}

export async function authenticateAdmin(passcode: string) {
  if (passcode === 'bluehorse') {
    const cookieStore = await cookies()
    cookieStore.set(ADMIN_COOKIE_NAME, process.env.ADMIN_SESSION_SECRET!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })
    return true
  }
  return false
}

export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE_NAME)
}
