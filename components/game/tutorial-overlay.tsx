"use client"

import { useState, useEffect } from "react"
import { useGame } from "@/lib/game-context"
import { EDUCATION_LEVELS } from "@/lib/education-levels"
import { Button } from "@/components/ui/button"
import { X, ChevronRight, Lightbulb } from "lucide-react"

interface TutorialOverlayProps {
  level?: number
  onClose?: () => void
}

export default function TutorialOverlay({ level = 1, onClose }: TutorialOverlayProps) {
  const { setLevelLessons, setLevelHint } = useGame()
  const [isVisible, setIsVisible] = useState(true)
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)

  const levelData = EDUCATION_LEVELS.find((l) => l.id === level)

  useEffect(() => {
    if (levelData) {
      setLevelLessons(levelData.lessons)
      setLevelHint(levelData.hint)
    }
  }, [level, levelData, setLevelLessons, setLevelHint])

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  const handleNextLesson = () => {
    if (levelData && currentLessonIndex < levelData.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1)
    } else {
      handleClose()
    }
  }

  if (!isVisible || !levelData) return null

  const currentLesson = levelData.lessons[currentLessonIndex]
  const isLastLesson = currentLessonIndex === levelData.lessons.length - 1

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-2xl max-w-md w-full border border-border overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-accent p-6 text-primary-foreground">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-2xl font-bold">Level {level}</h2>
              <p className="text-sm opacity-90">{levelData.name}</p>
            </div>
            <button
              onClick={handleClose}
              className="hover:bg-white/20 p-1 rounded transition-colors"
              aria-label="Close tutorial"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <p className="text-sm text-muted-foreground">{levelData.description}</p>
          </div>

          {/* Lesson */}
          <div className="space-y-4">
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <p className="text-lg font-semibold text-foreground mb-2">Lesson {currentLessonIndex + 1}:</p>
              <p className="text-foreground text-base">{currentLesson}</p>
            </div>

            {/* Hint */}
            <div className="flex items-start gap-3 bg-secondary/10 border border-secondary/30 rounded-lg p-4">
              <Lightbulb size={20} className="text-secondary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-secondary mb-1">Hint:</p>
                <p className="text-sm text-foreground">{levelData.hint}</p>
              </div>
            </div>
          </div>

          {/* Learning Objectives */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">You'll Learn:</p>
            <ul className="space-y-1">
              {levelData.objectives.map((obj, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  {obj}
                </li>
              ))}
            </ul>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
            <div className="flex-1 flex gap-1">
              {levelData.lessons.map((_, idx) => (
                <div
                  key={idx}
                  className={`flex-1 h-1 rounded-full transition-colors ${
                    idx <= currentLessonIndex ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-muted-foreground">
              {currentLessonIndex + 1}/{levelData.lessons.length}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-muted/50 px-6 py-4 flex gap-3">
          <Button onClick={handleClose} variant="outline" className="flex-1 bg-transparent">
            Skip
          </Button>
          <Button onClick={handleNextLesson} className="flex-1 bg-primary text-primary-foreground">
            {isLastLesson ? "Start!" : "Next"}
            {!isLastLesson && <ChevronRight size={16} className="ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
