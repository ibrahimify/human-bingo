import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PlaySessionClient } from '@/components/player/PlaySessionClient'

export default async function PlayRoute(props: { params: Promise<{ code: string }> }) {
  const params = await props.params
  const supabase = await createClient()

  // 1. Fetch the active session by code
  const { data: session } = await supabase
    .from('game_sessions')
    .select('*')
    .eq('join_code', params.code.toUpperCase())
    .eq('status', 'active')
    .single()

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="card max-w-sm w-full">
          <h1 className="text-xl font-bold mb-2">Session Not Found</h1>
          <p className="text-sm text-gray-600">That round is not active yet or has finished.</p>
        </div>
      </div>
    )
  }

  return <PlaySessionClient session={session} />
}
