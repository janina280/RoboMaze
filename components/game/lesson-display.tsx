"use client"

import { useGame } from "@/lib/game-context"
import { Lightbulb, BookOpen } from "lucide-react"

export default function LessonDisplay() {
  const { levelLessons, levelHint } = useGame()

  if (!levelLessons.length && !levelHint) return null

  return (
    <div className="space-y-3">
      {levelLessons.length > 0 && (
        <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
          <div className="flex items-start gap-2 mb-2">
            <BookOpen size={18} className="text-accent flex-shrink-0 mt-0.5" />
            <p className="font-semibold text-sm text-accent">Today's Lessons:</p>
          </div>
          <ul className="space-y-2 ml-7">
            {levelLessons.map((lesson, idx) => (
              <li key={idx} className="text-sm text-foreground">
                {lesson}
              </li>
            ))}
          </ul>
        </div>
      )}

      {levelHint && (
        <div className="flex items-start gap-3 bg-primary/10 border border-primary/30 rounded-lg p-3">
          <Lightbulb size={18} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-xs text-primary mb-1">HINT:</p>
            <p className="text-sm text-foreground">{levelHint}</p>
          </div>
        </div>
      )}
    </div>
  )
}
