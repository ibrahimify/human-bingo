'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export default function Home() {
  const [code, setCode] = useState('')
  const router = useRouter()

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.trim()) {
      router.push(`/play/${code.trim().toUpperCase()}`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F7F7F5]">
      <div className="card max-w-sm w-full text-center p-8">
        <h1 className="text-3xl font-bold mb-2">Mission Roulette</h1>
        <p className="text-gray-600 mb-8">Enter your group code to join.</p>
        
        <form onSubmit={handleJoin} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-semibold mb-2">Join Code</label>
            <input 
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              className="input-field text-center font-bold tracking-widest text-xl" 
              placeholder="e.g. AB12CD"
              maxLength={6}
            />
          </div>
          <Button type="submit" className="w-full" disabled={!code.trim()}>Join Game</Button>
        </form>
      </div>
    </div>
  )
}
