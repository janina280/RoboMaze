"use client"

import { Star, Zap, BookOpen, ArrowRight, Lock, CheckCircle2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGame } from "@/lib/game-context"

interface LevelSelectorProps {
  onStartGame: (level: number) => void
  onBack?: () => void
}

export default function LevelSelector({ onStartGame, onBack }: LevelSelectorProps) {
  const { isLevelUnlocked, completedLevels } = useGame()
  const currentLevel = completedLevels.length + 1

  const fixedLevels = [
    { number: 1, name: "Getting Started", difficulty: "Easy", blocks: "3-4" },
    { number: 2, name: "Challenge Time", difficulty: "Medium", blocks: "5-6" },
    { number: 3, name: "Master Builder", difficulty: "Hard", blocks: "7-8" },
    { number: 4, name: "Maze Expert", difficulty: "Expert", blocks: "8-10" },
    { number: 5, name: "Ultimate Challenge", difficulty: "Legendary", blocks: "10+" },
  ]

  const dynamicLevels = Array.from({ length: Math.max(0, currentLevel - 5) }, (_, i) => ({
    number: 6 + i,
    name: "New Level",
    difficulty: "Hard",
    blocks: "-",
    isDynamic: true,
  }))

  const allLevels = [...fixedLevels, ...dynamicLevels]

  return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-background px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          {onBack && (
              <Button variant="outline" onClick={onBack} className="mb-6 bg-transparent flex items-center gap-2">
                <ArrowLeft size={16} />
                Back to Menu
              </Button>
          )}

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-4 leading-tight">
              RoboMaze
            </h1>
            <p className="text-lg text-muted-foreground mb-2 font-semibold">Learn Programming Through Robot Navigation</p>
            <p className="text-sm text-muted-foreground mb-6">
              Master fundamental programming concepts: sequences, control flow, loops, and algorithmic thinking through an interactive visual programming environment.
            </p>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mt-8 mb-8">
              <div className="bg-card/50 rounded-lg p-3 border border-border">
                <BookOpen size={20} className="text-primary mx-auto mb-2" />
                <p className="text-xs font-semibold text-foreground">Learn Coding</p>
                <p className="text-xs text-muted-foreground">No experience needed</p>
              </div>
              <div className="bg-card/50 rounded-lg p-3 border border-border">
                <Zap size={20} className="text-secondary mx-auto mb-2" />
                <p className="text-xs font-semibold text-foreground">Build Skills</p>
                <p className="text-xs text-muted-foreground">Real programming logic</p>
              </div>
              <div className="bg-card/50 rounded-lg p-3 border border-border">
                <Star size={20} className="text-accent mx-auto mb-2" />
                <p className="text-xs font-semibold text-foreground">Earn Badges</p>
                <p className="text-xs text-muted-foreground">Unlock achievements</p>
              </div>
            </div>
          </div>

          {/* Levels */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {allLevels.map((level) => {
              const unlocked = isLevelUnlocked(level.number) || (level.number <= currentLevel)
              const completed = completedLevels.includes(level.number)
              const isDynamic = (level as any).isDynamic

              return (
                  <button
                      key={level.number}
                      onClick={() => unlocked && onStartGame(level.number)}
                      disabled={!unlocked}
                      className={`group relative bg-gradient-to-br from-card to-card/80 border-2 rounded-xl p-6 transition-all text-left ${
                          unlocked
                              ? "border-border hover:border-primary hover:shadow-xl hover:scale-105 cursor-pointer"
                              : "border-border/50 opacity-50 cursor-not-allowed"
                      }`}
                  >
                    {!unlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-xl">
                          <div className="text-center">
                            <Lock size={32} className="text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground font-semibold">Complete Level {level.number - 1}</p>
                          </div>
                        </div>
                    )}

                    <div
                        className={`absolute inset-0 bg-primary/0 rounded-xl transition-colors ${unlocked ? "group-hover:bg-primary/5" : ""}`}
                    />

                    <div className="relative space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-4xl font-bold text-primary mb-1">Level {level.number}</div>
                          <h3 className="text-xl font-semibold text-foreground">{level.name} {isDynamic ? "(New Level)" : ""}</h3>
                        </div>
                        {completed ? (
                            <CheckCircle2 className="text-green-500 mt-1" size={24} fill="currentColor" />
                        ) : (
                            <Star className="text-secondary mt-1" size={24} fill="currentColor" />
                        )}
                      </div>

                      <div className="space-y-1 text-sm">
                        <p className="text-muted-foreground">
                          Difficulty: <span className="font-semibold text-foreground">{level.difficulty}</span>
                        </p>
                        <p className="text-muted-foreground">
                          Blocks: <span className="font-semibold text-foreground">{level.blocks}</span>
                        </p>
                      </div>

                      {unlocked && (
                          <div className="flex items-center gap-2 text-primary font-semibold text-sm pt-2 group-hover:gap-3 transition-all">
                            {completed ? "Play Again" : "Play"} <ArrowRight size={16} />
                          </div>
                      )}
                    </div>

                    <div
                        className={`absolute inset-0 rounded-xl border-2 border-transparent transition-colors pointer-events-none ${unlocked ? "group-hover:border-primary/50" : ""}`}
                    />
                  </button>
              )
            })}
          </div>
        </div>
      </div>
  )
}
