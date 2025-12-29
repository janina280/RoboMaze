"use client"

import { useState } from "react"
import { useGame } from "@/lib/game-context"
import { executeProgram } from "@/lib/robot-engine"
import { checkAchievements } from "@/lib/achievements"
import { Button } from "@/components/ui/button"
import { Play, RotateCcw, Zap, Code2, Bug, Sparkles } from "lucide-react"

interface GameControlsProps {
  level?: number
  maxBlocks?: number
  onToggleCode?: () => void
  onToggleDebugger?: () => void
  onSuccess?: () => void
  onAttempt?: () => void
}

export default function GameControls({
  level = 1,
  maxBlocks = 10,
  onToggleCode,
  onToggleDebugger,
  onSuccess,
  onAttempt,
}: GameControlsProps) {
  const { blocks, robot, maze, setRobot, isExecuting, setIsExecuting, clearBlocks, achievements, addAchievement } =
    useGame()

  const [message, setMessage] = useState<string>("")
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info")
  const [execStats, setExecStats] = useState<{ steps: number } | null>(null)
  const [successOnFirstTry, setSuccessOnFirstTry] = useState(false)

  const executeProgram_ = async () => {
    if (isExecuting || blocks.length === 0) return

    onAttempt?.()
    setIsExecuting(true)
    setMessage("Running...")
    setMessageType("info")
    setExecStats(null)
    setSuccessOnFirstTry(robot.x === 0 && robot.y === 0)

    const result = await executeProgram(robot, maze, blocks, async (updatedRobot) => {
      setRobot(updatedRobot)
      await new Promise((resolve) => setTimeout(resolve, 300))
    })

    setExecStats({ steps: result.steps })
    setMessage(result.message)
    setMessageType(result.success ? "success" : "error")
    setRobot(result.finalRobot)

    if (result.success) {
      const usedRepeatBlocks = blocks.some((b) => b.type === "repeatStart")
      const newAchievements = checkAchievements(
        level,
        blocks.length,
        maxBlocks,
        usedRepeatBlocks,
        false,
        successOnFirstTry,
        level,
        0,
        achievements,
      )
      newAchievements.forEach((achievement) => {
        if (achievement.unlocked && !achievements.find((a) => a.id === achievement.id)?.unlocked) {
          addAchievement(achievement)
        }
      })
      setRobot({ x: maze.start.x, y: maze.start.y, direction: "right" })
      onSuccess?.()
    }
    else { setRobot({ x: maze.start.x, y: maze.start.y, direction: "right" }) }

    setIsExecuting(false)
  }

  const handleReset = () => {
    setRobot({ x: 0, y: 0, direction: "right" })
    setMessage("")
    setExecStats(null)
    setIsExecuting(false)
  }

  return (
    <div className="bg-card rounded-lg border border-border shadow-lg p-4">
      <div className="space-y-3">
        <Button
          onClick={executeProgram_}
          disabled={isExecuting || blocks.length === 0}
          className="w-full bg-primary text-primary-foreground font-bold text-base py-6 hover:bg-primary/90 disabled:opacity-50 transition-all"
        >
          <Play className="mr-2" size={20} />
          {isExecuting ? "Running..." : blocks.length === 0 ? "Add Blocks to Run" : "Run Program"}
        </Button>

        <div className="flex gap-2">
          <Button onClick={handleReset} variant="outline" className="flex-1 bg-transparent" disabled={isExecuting}>
            <RotateCcw className="mr-2" size={16} />
            Reset
          </Button>

          <Button
            onClick={clearBlocks}
            variant="outline"
            className="flex-1 text-destructive bg-transparent"
            disabled={isExecuting}
          >
            <Zap className="mr-2" size={16} />
            Clear
          </Button>
        </div>

        <div className="flex gap-2">
          {onToggleDebugger && (
            <Button
              onClick={onToggleDebugger}
              variant="outline"
              className="flex-1 text-accent hover:bg-accent/10 bg-transparent"
              disabled={blocks.length === 0}
              title="Step through your program one block at a time"
            >
              <Bug className="mr-1" size={16} />
              Debug
            </Button>
          )}

          {onToggleCode && (
            <Button
              onClick={onToggleCode}
              variant="outline"
              className="flex-1 text-accent hover:bg-accent/10 bg-transparent"
              disabled={blocks.length === 0}
              title="See your program in real programming languages"
            >
              <Code2 className="mr-1" size={16} />
              Code
            </Button>
          )}
        </div>

        {message && (
          <div
            className={`p-3 rounded text-sm font-semibold text-center transition-all ${
              messageType === "success"
                ? "bg-green-100 text-green-800 border border-green-300 space-y-2"
                : messageType === "error"
                  ? "bg-red-100 text-red-800 border border-red-300"
                  : "bg-blue-100 text-blue-800 border border-blue-300"
            }`}
          >
            {messageType === "success" && <Sparkles className="inline mr-2" size={16} />}
            {message}
            {execStats && <div className="text-xs mt-1 opacity-80">Completed in {execStats.steps} steps</div>}
          </div>
        )}

        <div className="bg-muted/50 rounded p-2 text-xs text-muted-foreground space-y-1">
          <p className="flex justify-between">
            <span>
              <span className="font-semibold">Blocks Used:</span> {blocks.length}
            </span>
            <span className="text-right">
              <span className="font-semibold">Max:</span> {maxBlocks}
            </span>
          </p>
          {blocks.length > 0 && (
            <p className="text-xs">Efficiency: {Math.round(((maxBlocks - blocks.length) / maxBlocks) * 100)}%</p>
          )}
        </div>
      </div>
    </div>
  )
}
