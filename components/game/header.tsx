"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, RotateCw, BookOpen } from "lucide-react"

interface HeaderProps {
  level: number
  onBack: () => void
  onShowTutorial?: () => void
}

export default function Header({ level, onBack, onShowTutorial }: HeaderProps) {
  const levelInfo = [
    { difficulty: "Easy", color: "text-green-600" },
    { difficulty: "Medium", color: "text-blue-600" },
    { difficulty: "Hard", color: "text-orange-600" },
    { difficulty: "Expert", color: "text-red-600" },
    { difficulty: "Legendary", color: "text-purple-600" },
  ]

  return (
    <header className="bg-card border-b border-border shadow-md sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="ghost" size="icon" className="hover:bg-primary/10">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              RoboMaze
            </h1>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-muted-foreground">Level {level}</span>
              <span className={`font-semibold ${levelInfo[level - 1]?.color}`}>{levelInfo[level - 1]?.difficulty}</span>

              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= level ? "bg-primary" : "bg-muted"}`} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-6">

          {onShowTutorial && (
            <Button
              onClick={onShowTutorial}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-transparent"
            >
              <BookOpen size={16} />
              Tutorial
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
