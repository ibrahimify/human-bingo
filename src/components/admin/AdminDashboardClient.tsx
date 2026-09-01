'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { calculateRanking, RankingPlayer } from '@/lib/ranking'
import { Button } from '@/components/ui/Button'
import { Users, Timer, CheckCircle, Activity } from 'lucide-react'
import { AdminAnswersDrawer } from './AdminAnswersDrawer'

export function AdminDashboardClient({ initialSessions }: { initialSessions: any[] }) {
  const supabase = createClient()
  const [sessions, setSessions] = useState(initialSessions)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(sessions[0]?.id || null)
  
  const [participants, setParticipants] = useState<any[]>([])
  const [missions, setMissions] = useState<any[]>([])
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)

  const activeSession = sessions.find(s => s.id === activeSessionId)

  // Actions
  const createSession = async () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    const name = `Group ${sessions.length + 1}`
    const { data } = await supabase.from('game_sessions').insert({
      name, join_code: code, status: 'draft'
    }).select().single()
    if (data) setSessions([data, ...sessions])
  }

  const updateSessionStatus = async (id: string, status: string) => {
    const updates: any = { status }
    if (status === 'active') updates.started_at = new Date().toISOString()
    if (status === 'closed') updates.stopped_at = new Date().toISOString()
    
    await supabase.from('game_sessions').update(updates).eq('id', id)
    setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  // Realtime & Data Fetching
  useEffect(() => {
    if (!activeSessionId) return

    const fetchData = async () => {
      const { data: pData } = await supabase.from('participants').select('*').eq('session_id', activeSessionId)
      if (pData) setParticipants(pData)
      
      const { data: mData } = await supabase.from('participant_missions')
        .select('*, participants!inner(session_id)')
        .eq('participants.session_id', activeSessionId)
      if (mData) setMissions(mData)
    }

    fetchData()

    const channel = supabase.channel(`session_${activeSessionId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'participants' }, (payload) => {
        setParticipants(prev => {
          const exists = prev.find(p => p.id === payload.new.id)
          if (exists) return prev.map(p => p.id === payload.new.id ? payload.new : p)
          return [...prev, payload.new]
        })
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'participant_missions' }, (payload) => {
        setMissions(prev => {
          const exists = prev.find(m => m.id === payload.new.id)
          if (exists) return prev.map(m => m.id === payload.new.id ? payload.new : m)
          return [...prev, payload.new]
        })
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [activeSessionId, supabase])

  // Ranking calculation
  const rankedPlayers = (): RankingPlayer[] => {
    const mapped = participants.map(p => {
      const pMissions = missions.filter(m => m.participant_id === p.id)
      const completed = pMissions.filter(m => m.completed)
      
      const lastSubmittedAt = completed.length > 0 
        ? completed.reduce((latest, m) => 
            new Date(m.submitted_at).getTime() > new Date(latest).getTime() ? m.submitted_at : latest
          , completed[0].submitted_at)
        : null

      return {
        id: p.id,
        name: p.name,
        completedCount: completed.length,
        startedAt: p.started_at,
        completedAt: p.completed_at,
        lastSubmittedAt
      }
    })
    return calculateRanking(mapped)
  }

  const leaderboard = rankedPlayers()
  const completedCount = leaderboard.filter(p => p.completedCount === 5).length
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-4">
        <Button onClick={createSession} className="w-full mb-4">Create Session</Button>
        <div className="space-y-2">
          {sessions.map(s => (
            <div 
              key={s.id} 
              onClick={() => setActiveSessionId(s.id)}
              className={`p-4 rounded-xl cursor-pointer border transition-colors ${activeSessionId === s.id ? 'border-black bg-white shadow-sm' : 'border-transparent hover:bg-gray-100'}`}
            >
              <div className="font-bold">{s.name}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">{s.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">
        {activeSession ? (
          <>
            <div className="card flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold">{activeSession.name}</h2>
                <div className="text-gray-500 flex items-center gap-2 mt-1">
                  Join Code: <strong className="text-black bg-gray-100 px-2 py-1 rounded">{activeSession.join_code}</strong>
                </div>
              </div>
              <div className="flex gap-2">
                {activeSession.status === 'draft' && (
                  <Button onClick={() => updateSessionStatus(activeSession.id, 'active')}>Activate</Button>
                )}
                {activeSession.status === 'active' && (
                  <Button onClick={() => updateSessionStatus(activeSession.id, 'closed')} className="bg-red-600 text-white">Stop Round</Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={<Users />} label="Players Joined" value={participants.length} />
              <StatCard icon={<CheckCircle />} label="Finished 5/5" value={completedCount} />
              <StatCard icon={<Activity />} label="Active" value={participants.length - completedCount} />
              <StatCard icon={<Timer />} label="Status" value={activeSession.status} />
            </div>

            <div className="card overflow-hidden">
              <h3 className="font-bold text-lg mb-4">Live Leaderboard</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs uppercase text-gray-500 border-b">
                      <th className="pb-3 px-2">Rank</th>
                      <th className="pb-3">Name</th>
                      <th className="pb-3 text-center">Progress</th>
                      <th className="pb-3">Time</th>
                      <th className="pb-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((p, idx) => {
                      const isTop = idx < 2 && p.completedCount > 0
                      const elapsedStr = p.completedAt 
                        ? Math.floor((new Date(p.completedAt).getTime() - new Date(p.startedAt).getTime()) / 1000) + 's'
                        : '-'
                      return (
                        <tr key={p.id} className={`border-b last:border-0 ${isTop ? 'bg-gray-50' : ''}`}>
                          <td className="py-3 px-2 font-bold">{idx + 1}</td>
                          <td className="py-3 font-medium">{p.name}</td>
                          <td className="py-3 text-center font-mono">{p.completedCount}/5</td>
                          <td className="py-3 text-sm text-gray-600">{elapsedStr}</td>
                          <td className="py-3">
                            <button onClick={() => setSelectedPlayerId(p.id)} className="text-sm font-semibold underline">Review</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {leaderboard.length === 0 && <div className="text-center text-gray-500 py-8">No players yet.</div>}
              </div>
            </div>
          </>
        ) : (
          <div className="card text-center py-12 text-gray-500">Select a session to view details</div>
        )}
      </div>

      {selectedPlayerId && (
        <AdminAnswersDrawer 
          playerId={selectedPlayerId} 
          participant={participants.find(p => p.id === selectedPlayerId)}
          missions={missions.filter(m => m.participant_id === selectedPlayerId)}
          onClose={() => setSelectedPlayerId(null)} 
        />
      )}
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: any, label: string, value: string | number }) {
  return (
    <div className="card flex items-center gap-4 !p-4">
      <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
      </div>
    </div>
  )
}
