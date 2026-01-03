import type { Robot, Maze, Block } from "./game-context"

export interface ExecutionResult {
  success: boolean
  message: string
  finalRobot: Robot
  steps: number
  stars: number
}

export interface DebugStep {
  blockIndex: number
  blockId: string
  blockType: string
  robotBefore: Robot
  robotAfter: Robot
  action: string
  success: boolean
  errorMessage?: string
}

function hasWallBetween(maze: Maze, fromX: number, fromY: number, toX: number, toY: number): boolean {
  if (fromX === toX) {
    // Moving vertically
    if (toY > fromY) {
      return maze.walls.has(`wall-h-${fromX}-${toY}`)
    } else {
      return maze.walls.has(`wall-h-${fromX}-${fromY}`)
    }
  } else if (fromY === toY) {
    // Moving horizontally
    if (toX > fromX) {
      return maze.walls.has(`wall-v-${toX}-${fromY}`)
    } else {
      return maze.walls.has(`wall-v-${fromX}-${fromY}`)
    }
  }
  return false
}

function canMoveTo(robot: Robot, maze: Maze, nextX: number, nextY: number): boolean {
  if (nextX < 0 || nextX >= maze.width || nextY < 0 || nextY >= maze.height) {
    return false
  }
  return !hasWallBetween(maze, robot.x, robot.y, nextX, nextY)
}

export async function executeProgram(
    initialRobot: Robot,
    maze: Maze,
    blocks: Block[],
    onStep?: (robot: Robot, stepIndex: number) => Promise<void>,
    debugMode?: boolean,
): Promise<ExecutionResult & { debugSteps?: DebugStep[] }> {

  const debugSteps: DebugStep[] = []
  let stepCount = 0
  const maxSteps = 1000

  async function runBlocks(robot: Robot, blockList: Block[]): Promise<Robot & { success: boolean }> {
    let currentRobot = { ...robot }
    let i = 0

    while (i < blockList.length && stepCount < maxSteps) {
      const block = blockList[i]
      const robotBefore = { ...currentRobot }

      if (block.type === "repeatStart") {
        const repeatCount = block.repeatCount ?? 2
        // găsește repeatEnd corespunzător
        let depth = 1
        let j = i + 1
        while (j < blockList.length && depth > 0) {
          if (blockList[j].type === "repeatStart") depth++
          if (blockList[j].type === "repeatEnd") depth--
          j++
        }
        const innerBlocks = blockList.slice(i + 1, j - 1)
        // execută blocurile interne de repeat de repeatCount ori
        for (let r = 0; r < repeatCount; r++) {
          const result = await runBlocks(currentRobot, innerBlocks)
          currentRobot = result
          if (!result.success) return { ...currentRobot, success: false }
        }
        i = j // sari peste blocurile repeat
        continue
      }

      if (block.type === "repeatEnd") {
        i++
        continue
      }


      switch (block.type) {
        case "forward": {
          const [nx, ny] =
              currentRobot.direction === "right" ? [currentRobot.x + 1, currentRobot.y] :
                  currentRobot.direction === "left" ? [currentRobot.x - 1, currentRobot.y] :
                      currentRobot.direction === "down" ? [currentRobot.x, currentRobot.y + 1] :
                          [currentRobot.x, currentRobot.y - 1]

          if (canMoveTo(currentRobot, maze, nx, ny)) {
            currentRobot = { ...currentRobot, x: nx, y: ny }
            if (debugMode) debugSteps.push({ blockIndex: i, blockId: block.id, blockType: block.type, robotBefore, robotAfter: currentRobot, action: `Moved forward to (${nx},${ny})`, success: true })
          } else {
            if (debugMode) debugSteps.push({ blockIndex: i, blockId: block.id, blockType: block.type, robotBefore, robotAfter: robotBefore, action: "Hit wall", success: false, errorMessage: "Hit wall" })
            return { ...currentRobot, success: false }
          }
          break
        }
        case "turnLeft":
          currentRobot.direction = currentRobot.direction === "up" ? "left" :
              currentRobot.direction === "left" ? "down" :
                  currentRobot.direction === "down" ? "right" : "up"
          if (debugMode) debugSteps.push({ blockIndex: i, blockId: block.id, blockType: block.type, robotBefore, robotAfter: { ...currentRobot }, action: `Turned left, now facing ${currentRobot.direction}`, success: true })
          break

        case "turnRight":
          currentRobot.direction = currentRobot.direction === "up" ? "right" :
              currentRobot.direction === "right" ? "down" :
                  currentRobot.direction === "down" ? "left" : "up"
          if (debugMode) debugSteps.push({ blockIndex: i, blockId: block.id, blockType: block.type, robotBefore, robotAfter: { ...currentRobot }, action: `Turned right, now facing ${currentRobot.direction}`, success: true })
          break

        case "wait":
          if (debugMode) debugSteps.push({ blockIndex: i, blockId: block.id, blockType: block.type, robotBefore, robotAfter: { ...currentRobot }, action: `Waited 1s`, success: true })
          break
      }

      stepCount++
      if (onStep) await onStep(currentRobot, stepCount)
      i++
    }

    return { ...currentRobot, success: true }
  }

  const finalRobot = await runBlocks(initialRobot, blocks)

  if (!finalRobot.success) {
    return { success: false, message: "Robot hit a wall!", finalRobot, steps: stepCount, stars: 0, debugSteps }
  }

  // calculează stele
  const optimalSteps = Math.abs(maze.goal.x - maze.start.x) + Math.abs(maze.goal.y - maze.start.y)
  const stars = stepCount <= optimalSteps + 2 ? 3 : stepCount <= optimalSteps + 5 ? 2 : stepCount <= optimalSteps + 10 ? 1 : 0

  const success = finalRobot.x === maze.goal.x && finalRobot.y === maze.goal.y

  return {
    success,
    message: success ? `Reached goal in ${stepCount} steps!` : "Goal not reached",
    finalRobot,
    steps: stepCount,
    stars: success ? stars : 0,
    debugSteps,
  }
}

