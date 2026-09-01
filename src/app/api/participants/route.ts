import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {
    const { session_id, name, missions } = await request.json()
    const supabase = await createAdminClient()

    const participantId = uuidv4()

    // Insert participant
    const { data: participant, error: partError } = await supabase
      .from('participants')
      .insert({
        id: participantId,
        session_id,
        name
      })
      .select()
      .single()

    if (partError || !participant) {
      return NextResponse.json({ error: partError?.message || 'Failed to create participant' }, { status: 400 })
    }

    // Insert missions if provided
    if (missions && missions.length > 0) {
      const missionInserts = missions.map((m: any, i: number) => ({
        participant_id: participantId,
        mission_id: m.id,
        category: m.category,
        position: i,
        completed: false,
      }))

      const { error: missError } = await supabase
        .from('participant_missions')
        .insert(missionInserts)

      if (missError) {
        return NextResponse.json({ error: missError.message }, { status: 400 })
      }
    }

    return NextResponse.json(participant)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to join session' },
      { status: 500 }
    )
  }
}
