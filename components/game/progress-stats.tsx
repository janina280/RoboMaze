"use client"

import { useGame } from "@/lib/game-context"
import { BarChart3, Zap, Target } from "lucide-react"

interface ProgressStatsProps {
  level: number
  blocksUsed: number
  maxBlocks: number
  successOnFirstTry: boolean
}

export default function ProgressStats({ level, blocksUsed, maxBlocks, successOnFirstTry }: ProgressStatsProps) {
  const { blocks } = useGame()

  const efficiency = Math.max(0, Math.round(((maxBlocks - blocksUsed) / maxBlocks) * 100))
  const usedLoops = blocks.some((b) => b.type === "repeatStart")

  return (
    <div className="bg-card rounded-lg border border-border shadow-lg p-4 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <BarChart3 size={20} className="text-accent" />
        <h2 className="text-lg font-bold text-foreground">Session Stats</h2>
      </div>

      {/* Level Progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold text-foreground">Current Level</p>
          <span className="text-2xl font-bold text-primary">{level}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div className="h-full bg-primary transition-all" style={{ width: `${(level / 5) * 100}%` }} />
        </div>
      </div>

      {/* Blocks Usage */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-orange-500" />
            <p className="text-sm font-semibold text-foreground">Blocks Used</p>
          </div>
          <span className="text-sm font-mono text-muted-foreground">
            {blocksUsed} / {maxBlocks}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all ${
              blocksUsed <= maxBlocks * 0.5
                ? "bg-green-500"
                : blocksUsed <= maxBlocks * 0.8
                  ? "bg-yellow-500"
                  : "bg-orange-500"
            }`}
            style={{ width: `${Math.min((blocksUsed / maxBlocks) * 100, 100)}%` }}
          />
        </div>
        {blocksUsed < maxBlocks && (
          <p className="text-xs text-muted-foreground">{maxBlocks - blocksUsed} blocks remaining</p>
        )}
      </div>

      {/* Efficiency Score */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-green-500" />
            <p className="text-sm font-semibold text-foreground">Efficiency</p>
          </div>
          <span className="text-sm font-bold text-green-600">{efficiency}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div className="h-full bg-green-500 transition-all" style={{ width: `${Math.min(efficiency, 100)}%` }} />
        </div>
      </div>

      {/* Bonuses */}
      <div className="space-y-2 pt-2 border-t border-border">
        <p className="text-xs font-semibold text-muted-foreground">BONUSES</p>
        <div className="flex flex-wrap gap-2">
          {successOnFirstTry && (
            <div className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded">
              Perfect First Try!
            </div>
          )}
          {usedLoops && (
            <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">Loop Master</div>
          )}
          {efficiency >= 80 && (
            <div className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">Efficient Code</div>
          )}
        </div>
      </div>
    </div>
  )
}
