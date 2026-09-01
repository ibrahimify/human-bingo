import { X } from 'lucide-react'
import { missions as allMissions } from '@/config/missions'
export function AdminAnswersDrawer({ playerId, participant, missions, onClose }: any) {
  if (!participant) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto border-l flex flex-col animate-in slide-in-from-right duration-200">
        <div className="p-6 border-b flex justify-between items-center bg-[#F7F7F5]">
          <div>
            <h2 className="text-xl font-bold">{participant.name}</h2>
            <div className="text-sm text-gray-500">{missions.filter((m: any) => m.completed).length} / 5 completed</div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20}/></button>
        </div>
        <div className="p-6 space-y-6 flex-1">
          {missions.sort((a: any, b: any) => a.position - b.position).map((m: any, idx: number) => {
            const missionDef = allMissions.find(def => def.id === m.mission_id)
            
            return (
              <div key={m.id} className="border rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{m.category}</span>
                  {m.completed ? <span className="text-green-600 text-xs font-bold">Done</span> : <span className="text-gray-400 text-xs font-bold">Pending</span>}
                </div>
                
                {missionDef && (
                  <p className="font-medium text-sm text-gray-800 leading-snug mb-3">
                    {missionDef.prompt}
                  </p>
                )}
                
                {m.completed && m.answers ? (
                  <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                    {Object.entries(m.answers).map(([k, v]) => {
                      const fieldDef = missionDef?.fields.find(f => f.key === k)
                      const label = fieldDef ? fieldDef.label : k
                      return (
                        <div key={k}>
                          <div className="text-xs text-gray-500 uppercase">{label}</div>
                          <div className="font-semibold text-sm text-black">{String(v)}</div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-gray-400 italic">No answers yet</div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
