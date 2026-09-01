import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json()
    const supabase = await createAdminClient()

    const updates: any = { status }
    if (status === 'active') updates.started_at = new Date().toISOString()
    if (status === 'closed') updates.stopped_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('game_sessions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const supabase = await createAdminClient();
    
    const { error } = await supabase
      .from('game_sessions')
      .delete()
      .eq('id', params.id);

    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
