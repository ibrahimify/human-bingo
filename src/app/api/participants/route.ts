import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {
    const { session_id, name } = await request.json()
    const supabase = await createAdminClient()

    const { data, error } = await supabase
      .from('participants')
      .insert({
        id: uuidv4(),
        session_id,
        name
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to join session' },
      { status: 500 }
    )
  }
}
