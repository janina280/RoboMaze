"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, ChevronUp } from "lucide-react"

export default function GameInstructions() {
  const [isExpanded, setIsExpanded] = useState(true)

  if (!isExpanded) {
    return (
      <Button
        onClick={() => setIsExpanded(true)}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 absolute bottom-4 right-4"
      >
        <ChevronUp size={16} />
        Show Instructions
      </Button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-card rounded-lg border border-border shadow-2xl p-4 z-40">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg text-foreground">How to Play</h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="hover:bg-muted p-1 rounded transition-colors"
          aria-label="Close instructions"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-3 text-sm text-foreground">
        <div className="bg-primary/10 border border-primary/30 rounded p-3">
          <p className="font-semibold text-primary mb-1">Goal:</p>
          <p>Guide the robot (purple circle) from the start to the goal (yellow square) without hitting walls.</p>
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-foreground">Step 1: Plan Your Path</p>
          <p className="text-muted-foreground">
            Look at the maze and think about which direction the robot needs to go.
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-foreground">Step 2: Add Programming Blocks</p>
          <ul className="space-y-1 text-muted-foreground ml-2">
            <li>
              • <span className="font-semibold text-blue-500">Move Forward</span> - Go one step in current direction
            </li>
            <li>
              • <span className="font-semibold text-emerald-500">Turn Left</span> - Rotate 90° counterclockwise
            </li>
            <li>
              • <span className="font-semibold text-orange-500">Turn Right</span> - Rotate 90° clockwise
            </li>
            <li>
              • <span className="font-semibold text-purple-500">Repeat</span> - Run blocks multiple times
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-foreground">Step 3: Run Your Program</p>
          <p className="text-muted-foreground">Click "Run Program" to watch the robot follow your instructions!</p>
        </div>

        <div className="bg-secondary/10 border border-secondary/30 rounded p-3">
          <p className="font-semibold text-secondary mb-1">Tips for Success:</p>
          <ul className="text-muted-foreground space-y-1 text-xs">
            <li>• The white dot on the robot shows which direction it's facing</li>
            <li>• Purple lines are walls - don't crash into them!</li>
            <li>• Use fewer blocks for better efficiency</li>
            <li>• Take your time planning before running</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
