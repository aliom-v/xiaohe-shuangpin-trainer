import { memo } from 'react'
import type { Achievement } from '@/lib/learning'

interface AchievementToastProps {
  achievements: Achievement[]
}

function AchievementToastComponent({ achievements }: AchievementToastProps) {
  if (achievements.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {achievements.map((a) => (
        <div
          key={a.id}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-3 rounded-xl shadow-lg animate-bounce"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">{a.icon}</span>
            <div>
              <div className="font-bold">🎉 成就解锁！</div>
              <div className="text-sm">{a.name} - {a.desc}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export const AchievementToast = memo(AchievementToastComponent)
