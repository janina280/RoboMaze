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
  console.log(`[v0] Checking wall from (${fromX},${fromY}) to (${toX},${toY})`)

  if (fromX === toX) {
    // Moving vertically
    if (toY > fromY) {
      // Moving down: check horizontal wall above the destination cell
      const wallId = `wall-h-${fromX}-${toY}`
      const hasWall = maze.walls.has(wallId)
      console.log(`[v0] Checking down: ${wallId} exists: ${hasWall}`)
      return hasWall
    } else {
      // Moving up: check horizontal wall above the source cell
      const wallId = `wall-h-${fromX}-${fromY}`
      const hasWall = maze.walls.has(wallId)
      console.log(`[v0] Checking up: ${wallId} exists: ${hasWall}`)
      return hasWall
    }
  } else if (fromY === toY) {
    // Moving horizontally
    if (toX > fromX) {
      // Moving right: check vertical wall to the left of destination cell
      const wallId = `wall-v-${toX}-${fromY}`
      const hasWall = maze.walls.has(wallId)
      console.log(`[v0] Checking right: ${wallId} exists: ${hasWall}`)
      return hasWall
    } else {
      // Moving left: check vertical wall to the left of source cell
      const wallId = `wall-v-${fromX}-${fromY}`
      const hasWall = maze.walls.has(wallId)
      console.log(`[v0] Checking left: ${wallId} exists: ${hasWall}`)
      return hasWall
    }
  }

  return false
}

function canMoveTo(robot: Robot, maze: Maze, nextX: number, nextY: number): boolean {
  // Check bounds
  if (nextX < 0 || nextX >= maze.width || nextY < 0 || nextY >= maze.height) {
    return false
  }

  // Check wall between current position and next position
  return !hasWallBetween(maze, robot.x, robot.y, nextX, nextY)
}

export async function executeProgram(
  initialRobot: Robot,
  maze: Maze,
  blocks: Block[],
  onStep?: (robot: Robot, stepIndex: number) => Promise<void>,
  debugMode?: boolean,
): Promise<ExecutionResult & { debugSteps?: DebugStep[] }> {
  let currentRobot = { ...initialRobot }
  let stepCount = 0
  const maxSteps = 1000
  const debugSteps: DebugStep[] = []

  for (let i = 0; i < blocks.length && stepCount < maxSteps; i++) {
    const block = blocks[i]
    const robotBefore = { ...currentRobot }

    switch (block.type) {
      case "forward": {
        // Calculate next position based on direction
        const [nextX, nextY] =
          currentRobot.direction === "right"
            ? [currentRobot.x + 1, currentRobot.y]
            : currentRobot.direction === "left"
              ? [currentRobot.x - 1, currentRobot.y]
              : currentRobot.direction === "down"
                ? [currentRobot.x, currentRobot.y + 1]
                : [currentRobot.x, currentRobot.y - 1]

        if (canMoveTo(currentRobot, maze, nextX, nextY)) {
          currentRobot = { ...currentRobot, x: nextX, y: nextY }
          if (debugMode) {
            debugSteps.push({
              blockIndex: i,
              blockId: block.id,
              blockType: block.type,
              robotBefore,
              robotAfter: { ...currentRobot },
              action: `Moved forward to (${currentRobot.x}, ${currentRobot.y})`,
              success: true,
            })
          }
        } else {
          if (debugMode) {
            debugSteps.push({
              blockIndex: i,
              blockId: block.id,
              blockType: block.type,
              robotBefore,
              robotAfter: robotBefore,
              action: "Attempted to move forward",
              success: false,
              errorMessage: "Hit a wall!",
            })
          }
          return {
            success: false,
            message: "Robot hit a wall! Try a different path.",
            finalRobot: currentRobot,
            steps: stepCount,
            stars: 0,
            debugSteps,
          }
        }
        break
      }

      case "turnLeft":
        currentRobot = {
          ...currentRobot,
          direction:
            currentRobot.direction === "up"
              ? "left"
              : currentRobot.direction === "left"
                ? "down"
                : currentRobot.direction === "down"
                  ? "right"
                  : "up",
        }
        if (debugMode) {
          debugSteps.push({
            blockIndex: i,
            blockId: block.id,
            blockType: block.type,
            robotBefore,
            robotAfter: { ...currentRobot },
            action: `Turned left, now facing ${currentRobot.direction}`,
            success: true,
          })
        }
        break

      case "turnRight":
        currentRobot = {
          ...currentRobot,
          direction:
            currentRobot.direction === "up"
              ? "right"
              : currentRobot.direction === "right"
                ? "down"
                : currentRobot.direction === "down"
                  ? "left"
                  : "up",
        }
        if (debugMode) {
          debugSteps.push({
            blockIndex: i,
            blockId: block.id,
            blockType: block.type,
            robotBefore,
            robotAfter: { ...currentRobot },
            action: `Turned right, now facing ${currentRobot.direction}`,
            success: true,
          })
        }
        break

      case "wait":
        if (debugMode) {
          debugSteps.push({
            blockIndex: i,
            blockId: block.id,
            blockType: block.type,
            robotBefore,
            robotAfter: { ...currentRobot },
            action: "Waited 1 second",
            success: true,
          })
        }
        break

      case "repeatStart":
      case "repeatEnd":
        break
    }

    stepCount++

    if (onStep) {
      await onStep(currentRobot, stepCount)
    }
  }

  if (stepCount >= maxSteps) {
    return {
      success: false,
      message: "Program too long! Check for infinite loops.",
      finalRobot: currentRobot,
      steps: stepCount,
      stars: 0,
      debugSteps,
    }
  }

  // Check if goal reached
  if (currentRobot.x === maze.goal.x && currentRobot.y === maze.goal.y) {
    // Calculate stars based on efficiency
    const optimalSteps = Math.abs(maze.goal.x - maze.start.x) + Math.abs(maze.goal.y - maze.start.y)
    const stars =
      stepCount <= optimalSteps + 2 ? 3 : stepCount <= optimalSteps + 5 ? 2 : stepCount <= optimalSteps + 10 ? 1 : 0

    return {
      success: true,
      message: `Success! You reached the goal in ${stepCount} steps!`,
      finalRobot: currentRobot,
      steps: stepCount,
      stars,
      debugSteps,
    }
  }

  return {
    success: false,
    message: "You did not reach the goal. Try again!",
    finalRobot: currentRobot,
    steps: stepCount,
    stars: 0,
    debugSteps,
  }
}
