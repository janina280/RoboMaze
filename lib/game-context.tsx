"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { ACHIEVEMENTS } from "./achievements"

export type BlockType =
  | "forward"
  | "turnLeft"
  | "turnRight"
  | "wait"
  | "repeatStart"
  | "repeatEnd"
  | "moveUp"
  | "moveDown"
  | "moveLeft"
  | "moveRight"

export interface Block {
  id: string
  type: BlockType
  repeatCount?: number
}

export interface Robot {
  x: number
  y: number
  direction: "up" | "down" | "left" | "right"
}

export interface Maze {
  width: number
  height: number
  start: { x: number; y: number }
  goal: { x: number; y: number }
  walls: Set<string>
}

export interface ExecutionStep {
  blockIndex: number
  action: string
  robotX: number
  robotY: number
  robotDirection: string
  success: boolean
  message: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: Date
}

interface GameContextType {
  blocks: Block[]
  addBlock: (block: Block) => void
  removeBlock: (id: string) => void
  clearBlocks: () => void
  robot: Robot
  setRobot: (robot: Robot) => void
  initialRobot: Robot
  maze: Maze
  setMaze: (maze: Maze) => void
  isExecuting: boolean
  setIsExecuting: (executing: boolean) => void
  executionSteps: ExecutionStep[]
  setExecutionSteps: (steps: ExecutionStep[]) => void
  currentStepIndex: number
  setCurrentStepIndex: (index: number) => void
  achievements: Achievement[]
  addAchievement: (achievement: Achievement) => void
  levelLessons: string[]
  setLevelLessons: (lessons: string[]) => void
  levelHint: string
  setLevelHint: (hint: string) => void
  completedLevels: number[]
  completeLevel: (level: number) => void
  isLevelUnlocked: (level: number) => boolean
  updateAchievements: (achievements: Achievement[]) => void // Added to context
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [blocks, setBlocks] = useState<Block[]>([])
  const initialRobotState = { x: 0, y: 0, direction: "right" as const }
  const [robot, setRobot] = useState<Robot>(initialRobotState)
  const [maze, setMaze] = useState<Maze>({
    width: 8,
    height: 8,
    start: { x: 0, y: 0 },
    goal: { x: 7, y: 7 },
    walls: new Set(),
  })
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [achievements, setAchievements] = useState<Achievement[]>(
    ACHIEVEMENTS.map((a) => ({
      ...a,
      unlocked: false,
    })),
  )
  const [levelLessons, setLevelLessons] = useState<string[]>([])
  const [levelHint, setLevelHint] = useState("")

  const [completedLevels, setCompletedLevels] = useState<number[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("robomaze-completed-levels")
    if (saved) {
      setCompletedLevels(JSON.parse(saved))
    }

    const savedAchievements = localStorage.getItem("robomaze-achievements")
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements))
    }
  }, [])

  const completeLevel = useCallback((level: number) => {
    setCompletedLevels((prev) => {
      if (prev.includes(level)) return prev
      const updated = [...prev, level]
      localStorage.setItem("robomaze-completed-levels", JSON.stringify(updated))
      return updated
    })
  }, [])

  const isLevelUnlocked = useCallback(
    (level: number) => {
      // Level 1 is always unlocked
      if (level === 1) return true
      // Other levels require previous level to be completed
      return completedLevels.includes(level - 1)
    },
    [completedLevels],
  )

  const addBlock = useCallback((block: Block) => {
    setBlocks((prev) => [...prev, block])
  }, [])

  const removeBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id))
  }, [])

  const clearBlocks = useCallback(() => {
    setBlocks([])
  }, [])

  const addAchievement = useCallback((achievement: Achievement) => {
    setAchievements((prev) => {
      const updated = [...prev.filter((a) => a.id !== achievement.id), achievement]
      localStorage.setItem("robomaze-achievements", JSON.stringify(updated))
      return updated
    })
  }, [])

  const updateAchievements = useCallback((updatedAchievements: Achievement[]) => {
    setAchievements(updatedAchievements)
    localStorage.setItem("robomaze-achievements", JSON.stringify(updatedAchievements))
  }, [])

  return (
    <GameContext.Provider
      value={{
        blocks,
        addBlock,
        removeBlock,
        clearBlocks,
        robot,
        setRobot,
        initialRobot: initialRobotState,
        maze,
        setMaze,
        isExecuting,
        setIsExecuting,
        executionSteps,
        setExecutionSteps,
        currentStepIndex,
        setCurrentStepIndex,
        achievements,
        addAchievement,
        levelLessons,
        setLevelLessons,
        levelHint,
        setLevelHint,
        completedLevels,
        completeLevel,
        isLevelUnlocked,
        updateAchievements, // Added to context
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
