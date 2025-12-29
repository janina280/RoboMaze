export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: Date
  progress?: number
  maxProgress?: number
}

export const ACHIEVEMENTS: Omit<Achievement, "unlocked" | "unlockedAt" | "progress">[] = [
  {
    id: "first-run",
    name: "First Steps",
    description: "Complete your first level",
    icon: "🚀",
  },
  {
    id: "level-3-complete",
    name: "Path Finder",
    description: "Complete Level 3 - Master efficient paths",
    icon: "🧭",
  },
  {
    id: "level-5-complete",
    name: "Algorithm Master",
    description: "Complete Level 5 - The ultimate challenge",
    icon: "🏆",
  },
  {
    id: "efficient-solver",
    name: "Clean Code",
    description: "Solve a puzzle in less than 50% of max blocks",
    icon: "✨",
  },
  {
    id: "loop-master",
    name: "Loop Master",
    description: "Use repeat blocks in a solution",
    icon: "🔄",
  },
  {
    id: "quick-learner",
    name: "Quick Learner",
    description: "Complete first 3 levels in one session",
    icon: "⚡",
  },
  {
    id: "perfect-solver",
    name: "Perfect Solver",
    description: "Reach the goal on your first try",
    icon: "💎",
  },
  {
    id: "debugger-pro",
    name: "Debugger Pro",
    description: "Use the step debugger 10 times",
    icon: "🐛",
  },
]

export function checkAchievements(
  currentLevel: number,
  blocksUsed: number,
  maxBlocks: number,
  usedRepeatBlocks: boolean,
  usedDebugger: boolean,
  successOnFirstTry: boolean,
  levelsCompletedThisSession: number,
  debuggerUsageCount: number,
  previousAchievements: Achievement[],
): Achievement[] {
  const updated = [...previousAchievements]

  // First Run
  if (!previousAchievements.find((a) => a.id === "first-run")?.unlocked) {
    if (currentLevel >= 1) {
      const idx = updated.findIndex((a) => a.id === "first-run")
      if (idx >= 0) updated[idx].unlocked = true
    }
  }

  // Level 3 Complete
  if (!previousAchievements.find((a) => a.id === "level-3-complete")?.unlocked) {
    if (currentLevel >= 3) {
      const idx = updated.findIndex((a) => a.id === "level-3-complete")
      if (idx >= 0) updated[idx].unlocked = true
    }
  }

  // Level 5 Complete
  if (!previousAchievements.find((a) => a.id === "level-5-complete")?.unlocked) {
    if (currentLevel >= 5) {
      const idx = updated.findIndex((a) => a.id === "level-5-complete")
      if (idx >= 0) updated[idx].unlocked = true
    }
  }

  // Efficient Solver
  if (!previousAchievements.find((a) => a.id === "efficient-solver")?.unlocked) {
    if (blocksUsed < maxBlocks * 0.5) {
      const idx = updated.findIndex((a) => a.id === "efficient-solver")
      if (idx >= 0) updated[idx].unlocked = true
    }
  }

  // Loop Master
  if (!previousAchievements.find((a) => a.id === "loop-master")?.unlocked) {
    if (usedRepeatBlocks) {
      const idx = updated.findIndex((a) => a.id === "loop-master")
      if (idx >= 0) updated[idx].unlocked = true
    }
  }

  // Quick Learner
  if (!previousAchievements.find((a) => a.id === "quick-learner")?.unlocked) {
    if (levelsCompletedThisSession >= 3) {
      const idx = updated.findIndex((a) => a.id === "quick-learner")
      if (idx >= 0) updated[idx].unlocked = true
    }
  }

  // Perfect Solver
  if (!previousAchievements.find((a) => a.id === "perfect-solver")?.unlocked) {
    if (successOnFirstTry) {
      const idx = updated.findIndex((a) => a.id === "perfect-solver")
      if (idx >= 0) updated[idx].unlocked = true
    }
  }

  // Debugger Pro
  if (!previousAchievements.find((a) => a.id === "debugger-pro")?.unlocked) {
    if (debuggerUsageCount >= 10) {
      const idx = updated.findIndex((a) => a.id === "debugger-pro")
      if (idx >= 0) updated[idx].unlocked = true
    }
  }

  return updated
}
