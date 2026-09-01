'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getRandomMissions, MissionDef } from '@/config/missions'
import { Button } from '@/components/ui/Button'
import { Loader2 } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

type Step = 'join' | 'play' | 'finished' | 'closed'

export function PlaySessionClient({ session }: { session: any }) {
  const supabase = createClient()
  const [step, setStep] = useState<Step>('join')
  const [name, setName] = useState('')
  const [participantId, setParticipantId] = useState<string | null>(null)
  
  const [missions, setMissions] = useState<any[]>([])
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0)
  
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [timerStart, setTimerStart] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)

  // Timer loop
  useEffect(() => {
    let interval: any
    if (step === 'play' && timerStart) {
      interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - timerStart) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [step, timerStart])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const handleStart = async () => {
    if (!name.trim()) return
    setLoading(true)
    
    try {
      // Generate 5 missions
      const randomMissions = getRandomMissions()

      // Create participant + missions via API
      const response = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: session.id,
          name: name.trim(),
          missions: randomMissions
        })
      })
      
      const participant = await response.json()
      
      if (!participant.id) {
        alert("Something went wrong. Try again.")
        setLoading(false)
        return
      }

      setMissions(randomMissions)
      setParticipantId(participant.id)
      setTimerStart(Date.now())
      setStep('play')
      setLoading(false)
    } catch (error) {
      console.error(error)
      alert("Something went wrong. Try again.")
      setLoading(false)
    }
  }

  const handleNext = async () => {
    if (!participantId || !missions[currentMissionIndex]) return
    const mission = missions[currentMissionIndex]
    
    // Check required fields
    for (const f of mission.fields) {
      if (f.required && !answers[f.key]?.trim()) return
    }

    setLoading(true)
    
    // Submit answer
    await supabase.from('participant_missions')
      .update({
        completed: true,
        submitted_at: new Date().toISOString(),
        answers: answers
      })
      .eq('participant_id', participantId)
      .eq('mission_id', mission.id)

    if (currentMissionIndex === 4) {
      // Finished all
      await supabase.from('participants')
        .update({ completed_at: new Date().toISOString() })
        .eq('id', participantId)
      
      setStep('finished')
    } else {
      setCurrentMissionIndex(i => i + 1)
      setAnswers({})
    }
    setLoading(false)
  }

  if (step === 'join') {
    return (
      <div className="min-h-screen flex flex-col p-6 max-w-md mx-auto">
        <div className="flex-1 flex flex-col justify-center space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight">BME Mission Roulette</h1>
            <p className="text-gray-600 text-lg leading-tight">Meet people. Learn something useful. Finish your missions.</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">First Name</label>
              <input 
                value={name} 
                onChange={e => setName(e.target.value)}
                className="input-field" 
                placeholder="e.g. Maria"
                maxLength={20}
              />
            </div>
          </div>
        </div>

        <div className="pb-8 space-y-4 text-center">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Your timer starts when you press Start</p>
          <Button onClick={handleStart} disabled={loading || !name.trim()} className="w-full">
            {loading ? <Loader2 className="animate-spin" /> : "Start Missions"}
          </Button>
        </div>
      </div>
    )
  }

  if (step === 'finished') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="card w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-1">All missions complete</h2>
          <p className="text-gray-600 mb-6">5 / 5 completed</p>
          <div className="text-5xl font-bold tracking-tighter mb-6">{formatTime(elapsed)}</div>
          <p className="text-sm font-medium">Nice work. Head back to the mentors and wait for the results.</p>
        </div>
      </div>
    )
  }

  const currentMission = missions[currentMissionIndex]
  const isNextDisabled = currentMission?.fields.some((f: any) => f.required && !answers[f.key]?.trim())

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto p-6 bg-[#F7F7F5]">
      <div className="flex justify-between items-center mb-8">
        <div className="font-semibold text-sm tracking-wider uppercase">Mission {currentMissionIndex + 1} of 5</div>
        <div className="font-bold text-xl tabular-nums">{formatTime(elapsed)}</div>
      </div>

      <div className="card flex-1 flex flex-col mb-6">
        <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">{currentMission.category}</div>
        <p className="text-2xl font-medium leading-tight mb-10">{currentMission.prompt}</p>
        
        <div className="space-y-6 mt-auto">
          {currentMission.fields.map((f: any) => (
            <div key={f.key}>
              <label className="block text-sm font-semibold mb-2">{f.label}</label>
              <input 
                value={answers[f.key] || ''}
                onChange={e => setAnswers(prev => ({ ...prev, [f.key]: e.target.value }))}
                className="input-field" 
              />
            </div>
          ))}
        </div>
      </div>

      <div className="pb-8">
        <Button onClick={handleNext} disabled={loading || isNextDisabled} className="w-full">
          {loading ? <Loader2 className="animate-spin" /> : "Submit & next"}
        </Button>
      </div>
    </div>
  )
}
