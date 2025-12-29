"use client"

import { ArrowLeft, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGame } from "@/lib/game-context"

interface BadgesPageProps {
  onBack: () => void
}

export default function BadgesPage({ onBack }: BadgesPageProps) {
  const { achievements } = useGame()

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalCount = achievements.length
  const progressPercent = (unlockedCount / totalCount) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-background px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Button variant="outline" onClick={onBack} className="mb-4 bg-transparent">
            <ArrowLeft size={16} className="mr-2" />
            Back to Menu
          </Button>
          <div className="flex items-center gap-4 mb-4">
            <Trophy size={48} className="text-secondary" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">Your Badges</h1>
              <p className="text-lg text-muted-foreground">
                {unlockedCount} of {totalCount} achievements unlocked
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-secondary via-accent to-primary transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-right font-semibold">{progressPercent.toFixed(0)}%</p>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`bg-gradient-to-br border-2 rounded-xl p-6 transition-all ${
                achievement.unlocked
                  ? "from-card to-card/80 border-secondary shadow-lg hover:shadow-xl hover:scale-105"
                  : "from-muted/30 to-muted/10 border-border opacity-60"
              }`}
            >
              <div className="text-center space-y-3">
                {/* Icon */}
                <div className={`text-5xl mb-2 ${achievement.unlocked ? "grayscale-0" : "grayscale opacity-50"}`}>
                  {achievement.icon}
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold text-foreground">{achievement.name}</h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground">{achievement.description}</p>

                {/* Status Badge */}
                {achievement.unlocked ? (
                  <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary rounded-full px-4 py-1">
                    <Trophy size={14} className="text-secondary" />
                    <span className="text-xs font-semibold text-secondary">Unlocked</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 bg-muted border border-border rounded-full px-4 py-1">
                    <span className="text-xs font-semibold text-muted-foreground">Locked</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Motivational Message */}
        {unlockedCount < totalCount && (
          <div className="mt-12 bg-gradient-to-r from-secondary/10 to-accent/10 border border-secondary/30 rounded-xl p-6 text-center">
            <Trophy size={32} className="text-secondary mx-auto mb-3" />
            <h3 className="text-xl font-bold text-foreground mb-2">Keep Going!</h3>
            <p className="text-muted-foreground">
              You have {totalCount - unlockedCount} more {totalCount - unlockedCount === 1 ? "badge" : "badges"} to
              unlock. Complete more levels and challenges!
            </p>
          </div>
        )}

        {unlockedCount === totalCount && (
          <div className="mt-12 bg-gradient-to-r from-secondary to-accent border-2 border-secondary rounded-xl p-8 text-center">
            <Trophy size={48} className="text-white mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Congratulations!</h3>
            <p className="text-white/90 text-lg">You've unlocked all achievements! You're a RoboMaze master! 🎉</p>
          </div>
        )}
      </div>
    </div>
  )
}
