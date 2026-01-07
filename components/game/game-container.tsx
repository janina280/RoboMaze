"use client"

import { useEffect, useState } from "react"
import { useGame } from "@/lib/game-context"
import { generateMazeWithDifficulty } from "@/lib/maze-generator"
import { EDUCATION_LEVELS } from "@/lib/education-levels"
import { checkAchievements } from "@/lib/achievements"
import MazeRenderer from "./maze-renderer"
import BlockEditor from "./block-editor"
import GameControls from "./game-controls"
import Header from "./header"
import LessonDisplay from "./lesson-display"
import CodeViewer from "./code-viewer"
import ExecutionDebugger from "./execution-debugger"
import AchievementsDisplay from "./achievements-display"
import ProgressStats from "./progress-stats"
import GameTimer from "./game-timer"
import MusicPlayer from "./music-player"
import GameInstructions from "./game-instructions"
import { CheckCircle2 } from "lucide-react"

interface GameContainerProps {
  level: number
  onBack: () => void
  onNextLevel?: () => void
}

export default function GameContainer({ level, onBack, onNextLevel }: GameContainerProps) {
  const {
    maze,
    setMaze,
    robot,
    setRobot,
    clearBlocks,
    setLevelLessons,
    setLevelHint,
    completeLevel,
    achievements,
    updateAchievements,
    blocks,
  } = useGame()
  const [showCode, setShowCode] = useState(false)
  const [showDebugger, setShowDebugger] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0)
  const [timerRunning, setTimerRunning] = useState(true)
  const [levelComplete, setLevelComplete] = useState(false)
  const [levelsThisSession, setLevelsThisSession] = useState(0)

  useEffect(() => {
    const newMaze = generateMazeWithDifficulty(level)
    setMaze(newMaze)
    setRobot({ x: newMaze.start.x, y: newMaze.start.y, direction: "right" })
    clearBlocks()
    setAttemptCount(0)
    setTimerRunning(true)
    setLevelComplete(false)

    const levelData = EDUCATION_LEVELS.find((l) => l.id === level)

    if (levelData && level <= 5) {
      setLevelLessons(levelData.lessons ?? [])
      setLevelHint(levelData.hint ?? "")
    } else if (level === 6) {
      setLevelLessons([
        "🎉 Congratulations!",
        "You’ve completed the guided lessons.",
        "",
        "From now on, levels are generated dynamically.",
        "Each challenge will be harder than the last.",
        "",
        "There is no single correct solution — only better ones.",
      ])
      setLevelHint("Click Run and see how far you can go 🚀")
    } else {
      setLevelLessons([])
      setLevelHint("")
    }
  }, [level, setMaze, setRobot, clearBlocks, setLevelLessons, setLevelHint])

  useEffect(() => {
    if (robot.x === maze.goal.x && robot.y === maze.goal.y && !levelComplete) {
      setLevelComplete(true)
      setTimerRunning(false)
      completeLevel(level)
      setRobot({ x: maze.start.x, y: maze.start.y, direction: "right" })
      setLevelsThisSession((prev) => prev + 1)

      const blocksUsed = blocks.length
      const maxBlocks = 20
      const usedRepeatBlocks = blocks.some((b) => b.type === "repeatStart" || b.type === "repeatEnd")
      const usedDebugger = false // Track this separately if needed
      const successOnFirstTry = attemptCount <= 1
      const debuggerUsageCount = 0 // Track this separately if needed

      const updatedAchievements = checkAchievements(
        level,
        blocksUsed,
        maxBlocks,
        usedRepeatBlocks,
        usedDebugger,
        successOnFirstTry,
        levelsThisSession + 1,
        debuggerUsageCount,
        achievements,
      )

      updateAchievements(updatedAchievements)

      setTimeout(() => {
        if (onNextLevel) {
          onNextLevel()
        }
      }, 5000)
    }
  }, [
    robot,
    maze.goal,
    level,
    completeLevel,
    levelComplete,
    onNextLevel,
    blocks,
    attemptCount,
    achievements,
    updateAchievements,
    levelsThisSession,
  ])

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <Header level={level} onBack={onBack} />
      <div className="bg-card border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <GameTimer isRunning={timerRunning} />
          <div className="text-sm text-muted-foreground">Level {level} • Maze Generated</div>
          {levelComplete && (
            <div className="flex items-center gap-2 text-green-500 font-semibold animate-in fade-in slide-in-from-left">
              <CheckCircle2 className="w-5 h-5" />
              <span>Level Complete!</span>
            </div>
          )}
        </div>
        <MusicPlayer isPlaying={timerRunning} />
      </div>

      <div className="flex-1 flex gap-6 p-6 overflow-hidden">
        {/* Main Game Area */}
        <div className="flex-1 flex flex-col gap-4 relative">
          <div className="flex-1 bg-card rounded-lg border border-border shadow-lg overflow-hidden flex items-center justify-center">
            <MazeRenderer maze={maze} robot={robot} />
          </div>

          <GameControls
            level={level}
            maxBlocks={10}
            onToggleCode={() => setShowCode(!showCode)}
            onToggleDebugger={() => setShowDebugger(true)}
            onAttempt={() => setAttemptCount(attemptCount + 1)}
          />
          <GameInstructions />
        </div>

        {/* Sidebar with Educational Content */}
        <div className="w-96 flex flex-col gap-4 overflow-y-auto">
          {/* Primary: Lessons */}
          <LessonDisplay />

          {/* Toggle: Code or Blocks */}
          {showCode ? <CodeViewer /> : <BlockEditor />}

          {/* Secondary: Achievements or Progress */}
          {showAchievements ? (
            <AchievementsDisplay />
          ) : (
            <ProgressStats
              level={level}
              blocksUsed={blocks.length}
              maxBlocks={20}
              successOnFirstTry={attemptCount <= 1}
            />
          )}

          {/* Info Toggle */}
          <button
            onClick={() => setShowAchievements(!showAchievements)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors text-center py-2"
          >
            {showAchievements ? "View Progress" : "View Achievements"}
          </button>
        </div>
      </div>

      <ExecutionDebugger visible={showDebugger} onClose={() => setShowDebugger(false)} />
    </div>
  )
}
