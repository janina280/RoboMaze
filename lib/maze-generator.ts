import type { Maze } from "./game-context"
import { generateMazeKruskal } from "./maze-kruskal"


// Wall naming convention:
// - horizontal wall "wall-h-X-Y" is ABOVE cell (X, Y)
// - vertical wall "wall-v-X-Y" is to the LEFT of cell (X, Y)

export function generateMazeForLevel(level: number): Maze {
  switch (level) {
    case 1:
      return {
        width: 5,
        height: 3,
        start: { x: 0, y: 1 },
        goal: { x: 4, y: 1 },
        walls: new Set([
          // Top border
          "wall-h-0-0",
          "wall-h-1-0",
          "wall-h-2-0",
          "wall-h-3-0",
          "wall-h-4-0",
          // Bottom border
          "wall-h-0-3",
          "wall-h-1-3",
          "wall-h-2-3",
          "wall-h-3-3",
          "wall-h-4-3",
          // Left border
          "wall-v-0-0",
          "wall-v-0-1",
          "wall-v-0-2",
          // Right border
          "wall-v-5-0",
          "wall-v-5-1",
          "wall-v-5-2",
          // Simple obstacle - block cell (2, 0) from above and below
          "wall-h-2-1", // Wall above middle cell in path
          "wall-h-2-3",
        ]),
      }

    case 2:
      return {
        width: 5,
        height: 4,
        start: { x: 0, y: 0 },
        goal: { x: 4, y: 3 },
        walls: new Set([
          // Border walls
          "wall-h-0-0",
          "wall-h-1-0",
          "wall-h-2-0",
          "wall-h-3-0",
          "wall-h-4-0",
          "wall-h-0-4",
          "wall-h-1-4",
          "wall-h-2-4",
          "wall-h-3-4",
          "wall-h-4-4",
          "wall-v-0-0",
          "wall-v-0-1",
          "wall-v-0-2",
          "wall-v-0-3",
          "wall-v-5-0",
          "wall-v-5-1",
          "wall-v-5-2",
          "wall-v-5-3",
          // Interior obstacles
          "wall-v-2-1", // Block middle path
          "wall-h-1-2",
          "wall-h-3-2",
        ]),
      }

    case 3:
      return {
        width: 6,
        height: 5,
        start: { x: 0, y: 0 },
        goal: { x: 5, y: 4 },
        walls: new Set([
          // Border
          ...Array.from({ length: 6 }, (_, i) => `wall-h-${i}-0`),
          ...Array.from({ length: 6 }, (_, i) => `wall-h-${i}-5`),
          ...Array.from({ length: 5 }, (_, i) => `wall-v-0-${i}`),
          ...Array.from({ length: 5 }, (_, i) => `wall-v-6-${i}`),

          // Vertical barriers
          "wall-v-2-0",
          "wall-v-2-1",
          "wall-v-2-2",

          "wall-v-4-2",
          "wall-v-4-3",
          "wall-v-4-4",

          // Horizontal connectors
          "wall-h-1-2",
          "wall-h-3-1",
          "wall-h-3-3",
        ]),
      }

    case 4:
      return {
        width: 6,
        height: 6,
        start: { x: 0, y: 0 },
        goal: { x: 5, y: 5 },
        walls: new Set([
          // Border
          ...Array.from({ length: 6 }, (_, i) => `wall-h-${i}-0`),
          ...Array.from({ length: 6 }, (_, i) => `wall-h-${i}-6`),
          ...Array.from({ length: 6 }, (_, i) => `wall-v-0-${i}`),
          ...Array.from({ length: 6 }, (_, i) => `wall-v-6-${i}`),

          // Room separators
          "wall-h-1-2",
          "wall-h-2-2",
          "wall-h-4-2",
          "wall-h-4-3",

          "wall-h-1-4",
          "wall-h-2-4",
          "wall-h-4-4",

          // Vertical traps
          "wall-v-2-1",
          "wall-v-2-3",
          "wall-v-2-6",
          "wall-v-2-7",

          "wall-v-4-2",
          "wall-v-4-4",
          "wall-v-4-5",
        ]),
      }

    case 5:
      return {
        width: 7,
        height: 7,
        start: { x: 0, y: 0 },
        goal: { x: 6, y: 6 },
        walls: new Set([
          // Border
          ...Array.from({ length: 7 }, (_, i) => `wall-h-${i}-0`),
          ...Array.from({ length: 7 }, (_, i) => `wall-h-${i}-7`),
          ...Array.from({ length: 7 }, (_, i) => `wall-v-0-${i}`),
          ...Array.from({ length: 7 }, (_, i) => `wall-v-7-${i}`),

          // Spiral core
          "wall-v-1-1",
          "wall-v-1-3",
          "wall-v-1-5",
          "wall-v-1-6",

          "wall-h-1-5",
          "wall-h-3-5",
          "wall-h-5-5",

          "wall-v-5-2",
          "wall-v-5-3",
          "wall-v-5-4",
          "wall-v-5-5",

          "wall-h-2-2",
          "wall-h-4-2",
        ]),
      }

    default:
      throw new Error(`No static maze defined for level ${level}`)
  }
}

  const MAX_STATIC_LEVEL = 5

  export function generateMazeWithDifficulty(level: number): Maze {
    if (level <= MAX_STATIC_LEVEL) {
      return generateMazeForLevel(level)
    }

    const size = Math.min(4 + level, 10)
    return generateMazeKruskal(size, size)
  }


