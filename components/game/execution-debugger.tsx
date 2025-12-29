"use client"

import { useState } from "react"
import { useGame } from "@/lib/game-context"
import { executeProgram, type DebugStep } from "@/lib/robot-engine"
import { Button } from "@/components/ui/button"
import { SkipBack, SkipForward, RotateCcw } from "lucide-react"

interface ExecutionDebuggerProps {
  visible: boolean
  onClose: () => void
}

export default function ExecutionDebugger({ visible, onClose }: ExecutionDebuggerProps) {
  const { blocks, robot, maze, setRobot, initialRobot } = useGame()
  const [debugSteps, setDebugSteps] = useState<DebugStep[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [debugMessage, setDebugMessage] = useState("")

  const startDebugger = async () => {
    if (blocks.length === 0) {
      setDebugMessage("Add blocks to start debugging")
      return
    }

    setIsRunning(true)
    setIsPaused(false)
    setCurrentStepIndex(-1)
    setDebugSteps([])

    const result = await executeProgram(
      initialRobot,
      maze,
      blocks,
      async () => {
        // No step animation in debug mode
      },
      true,
    )

    setDebugSteps(result.debugSteps || [])
    setDebugMessage(result.message)
    setIsRunning(false)
  }

  const moveToStep = (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= debugSteps.length) return

    const step = debugSteps[stepIndex]
    setCurrentStepIndex(stepIndex)
    setRobot(step.robotAfter)
  }

  const handleStepForward = () => {
    if (currentStepIndex < debugSteps.length - 1) {
      moveToStep(currentStepIndex + 1)
    }
  }

  const handleStepBackward = () => {
    if (currentStepIndex > 0) {
      moveToStep(currentStepIndex - 1)
    } else if (currentStepIndex === 0) {
      setCurrentStepIndex(-1)
      setRobot(initialRobot)
    }
  }

  const handleReset = () => {
    setCurrentStepIndex(-1)
    setRobot(initialRobot)
    setDebugSteps([])
    setDebugMessage("")
    setIsPaused(false)
  }

  const handlePlayPause = async () => {
    if (!isRunning && debugSteps.length === 0) {
      await startDebugger()
      return
    }

    setIsPaused(!isPaused)
  }

  const currentStep = currentStepIndex >= 0 ? debugSteps[currentStepIndex] : null

  if (!visible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-2xl max-w-2xl w-full border border-border max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-accent p-6 text-primary-foreground">
          <h2 className="text-2xl font-bold">Step-by-Step Debugger</h2>
          <p className="text-sm opacity-90">Execute your program one block at a time to see what happens</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Controls */}
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={startDebugger}
              disabled={isRunning}
              className="bg-primary text-primary-foreground flex-1 min-w-32"
            >
              Start Debug
            </Button>
            <Button
              onClick={handleStepBackward}
              disabled={currentStepIndex === -1 || isRunning}
              variant="outline"
              className="flex-1 min-w-32 bg-transparent"
            >
              <SkipBack size={16} className="mr-1" />
              Prev Step
            </Button>
            <Button
              onClick={handleStepForward}
              disabled={currentStepIndex >= debugSteps.length - 1 || isRunning}
              variant="outline"
              className="flex-1 min-w-32"
            >
              <SkipForward size={16} className="mr-1" />
              Next Step
            </Button>
            <Button
              onClick={handleReset}
              disabled={isRunning}
              variant="outline"
              className="flex-1 min-w-32 bg-transparent"
            >
              <RotateCcw size={16} className="mr-1" />
              Reset
            </Button>
          </div>

          {/* Status */}
          {debugMessage && (
            <div
              className={`p-4 rounded-lg text-sm font-semibold ${
                debugMessage.toLowerCase().includes("success")
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-blue-100 text-blue-800 border border-blue-300"
              }`}
            >
              {debugMessage}
            </div>
          )}

          {/* Current Step Info */}
          {currentStep && (
            <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-foreground">
                  Step {currentStepIndex + 1} / {debugSteps.length}
                </h3>
                <span
                  className={`px-3 py-1 rounded text-sm font-semibold ${
                    currentStep.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {currentStep.success ? "Success" : "Error"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card rounded p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">BEFORE</p>
                  <div className="space-y-1 text-sm">
                    <p>
                      Position: ({currentStep.robotBefore.x}, {currentStep.robotBefore.y})
                    </p>
                    <p>Direction: {currentStep.robotBefore.direction}</p>
                  </div>
                </div>

                <div className="bg-card rounded p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">AFTER</p>
                  <div className="space-y-1 text-sm">
                    <p>
                      Position: ({currentStep.robotAfter.x}, {currentStep.robotAfter.y})
                    </p>
                    <p>Direction: {currentStep.robotAfter.direction}</p>
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/30 rounded p-3">
                <p className="text-sm font-semibold text-primary mb-1">Action:</p>
                <p className="text-foreground">{currentStep.action}</p>
                {currentStep.errorMessage && (
                  <p className="text-sm text-destructive mt-2">Error: {currentStep.errorMessage}</p>
                )}
              </div>

              {/* Block Highlight */}
              <div className="bg-accent/10 border border-accent/30 rounded p-3">
                <p className="text-xs font-semibold text-accent mb-2">BLOCK EXECUTED</p>
                <p className="text-sm text-foreground font-mono">
                  Block #{currentStep.blockIndex + 1}: {currentStep.blockType}
                </p>
              </div>
            </div>
          )}

          {/* Steps List */}
          {debugSteps.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Step History</h3>
              <div className="bg-muted/50 rounded-lg p-3 max-h-48 overflow-y-auto space-y-1">
                {debugSteps.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => moveToStep(idx)}
                    className={`w-full text-left p-2 rounded text-sm transition-colors ${
                      currentStepIndex === idx
                        ? "bg-primary text-primary-foreground"
                        : step.success
                          ? "bg-card hover:bg-card/80 text-foreground"
                          : "bg-destructive/20 hover:bg-destructive/30 text-foreground"
                    }`}
                  >
                    <span className="font-mono text-xs">#{idx + 1}</span> - {step.action}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-muted/50 px-6 py-4 flex gap-3">
          <Button onClick={onClose} className="flex-1">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
