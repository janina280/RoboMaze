"use client"

import { useGame } from "@/lib/game-context"
import { Trophy, Lock, Unlock } from "lucide-react"

export default function AchievementsDisplay() {
  const { achievements } = useGame()

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalCount = achievements.length

  return (
    <div className="bg-card rounded-lg border border-border shadow-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Trophy size={20} className="text-secondary" />
        <h2 className="text-lg font-bold text-foreground">Achievements</h2>
        <span className="ml-auto text-sm font-semibold text-muted-foreground">
          {unlockedCount}/{totalCount}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-secondary to-accent transition-all duration-300"
          style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
        />
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-2">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-3 rounded-lg border transition-all ${
              achievement.unlocked
                ? "bg-secondary/10 border-secondary/50 hover:bg-secondary/20"
                : "bg-muted/50 border-muted opacity-60"
            }`}
            title={achievement.description}
          >
            <div className="flex items-start gap-2">
              <span className="text-xl">{achievement.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{achievement.name}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{achievement.description}</p>
              </div>
              {achievement.unlocked ? (
                <Unlock size={14} className="text-secondary flex-shrink-0 mt-1" />
              ) : (
                <Lock size={14} className="text-muted-foreground flex-shrink-0 mt-1" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-secondary/10 border border-secondary/30 rounded p-2 text-xs">
        <p className="text-secondary font-semibold mb-1">Keep Playing:</p>
        <p className="text-foreground">Complete levels and challenges to unlock achievements!</p>
      </div>
    </div>
  )
}
