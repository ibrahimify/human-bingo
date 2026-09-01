import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createAdminClient()

    const { data, error } = await supabase
      .from('game_sessions')
      .insert({
        name: `Group ${Date.now()}`,
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
