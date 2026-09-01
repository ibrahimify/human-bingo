import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const sessionName = body.name || `Round ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    const supabase = await createAdminClient()

    const { data, error } = await supabase
      .from('game_sessions')
      .insert({
        name: sessionName,
        join_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        status: 'draft'
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}
