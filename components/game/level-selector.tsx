"use client"
import { Star, Zap, BookOpen, ArrowRight, Lock, CheckCircle2 } from "lucide-react"
import { useGame } from "@/lib/game-context"

interface LevelSelectorProps {
  onStartGame: (level: number) => void
}

export default function LevelSelector({ onStartGame }: LevelSelectorProps) {
  const { isLevelUnlocked, completedLevels } = useGame()

  const levels = [
    { number: 1, name: "Getting Started", difficulty: "Easy", blocks: "3-4" },
    { number: 2, name: "Challenge Time", difficulty: "Medium", blocks: "5-6" },
    { number: 3, name: "Master Builder", difficulty: "Hard", blocks: "7-8" },
    { number: 4, name: "Maze Expert", difficulty: "Expert", blocks: "8-10" },
    { number: 5, name: "Ultimate Challenge", difficulty: "Legendary", blocks: "10+" },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-background via-primary/10 to-background">
      <div className="text-center mb-12 max-w-3xl">
        <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-4 leading-tight">
          RoboMaze
        </h1>
        <p className="text-lg text-muted-foreground mb-2 font-semibold">Learn Programming Through Robot Navigation</p>
        <p className="text-sm text-muted-foreground mb-6">
          Master fundamental programming concepts: sequences, control flow, loops, and algorithmic thinking through an
          interactive visual programming environment.
        </p>

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl w-full mb-12">
        {levels.map((level) => {
          const unlocked = isLevelUnlocked(level.number)
          const completed = completedLevels.includes(level.number)

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
                    <h3 className="text-xl font-semibold text-foreground">{level.name}</h3>
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

      <div className="bg-gradient-to-r from-card to-card/80 border border-border rounded-xl p-8 max-w-2xl w-full shadow-lg">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Zap size={24} className="text-primary" />
          How to Play
        </h2>

        <div className="space-y-4">
          {[
            { step: 1, text: "Select a level to begin your adventure", icon: "1" },
            { step: 2, text: "Read the lessons and learn what each block does", icon: "2" },
            { step: 3, text: "Drag blocks to build your program", icon: "3" },
            { step: 4, text: "Click 'Run Program' to watch your robot execute", icon: "4" },
            { step: 5, text: "Guide the robot to reach the yellow goal square", icon: "5" },
            { step: 6, text: "Use the debugger to step through code if stuck", icon: "6" },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                {item.icon}
              </div>
              <p className="text-muted-foreground pt-0.5">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-border space-y-2">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Pro Tips:</span>
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Use fewer blocks for higher efficiency scores</li>
            <li>• Repeat blocks help write cleaner code</li>
            <li>• The debugger helps you understand what's happening</li>
            <li>• Check the code view to see real programming syntax</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
