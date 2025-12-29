import type { Maze } from "./game-context"

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
          // Border walls
          ...Array.from({ length: 6 }, (_, i) => `wall-h-${i}-0`),
          ...Array.from({ length: 6 }, (_, i) => `wall-h-${i}-5`),
          ...Array.from({ length: 5 }, (_, i) => `wall-v-0-${i}`),
          ...Array.from({ length: 5 }, (_, i) => `wall-v-6-${i}`),
          // Interior maze walls - create zigzag pattern
          "wall-v-2-0",
          "wall-v-2-1",
          "wall-h-3-2",
          "wall-h-4-2",
          "wall-v-4-2",
          "wall-v-4-3",
        ]),
      }

    case 4:
      return {
        width: 6,
        height: 6,
        start: { x: 0, y: 0 },
        goal: { x: 5, y: 5 },
        walls: new Set([
          // Border walls
          ...Array.from({ length: 6 }, (_, i) => `wall-h-${i}-0`),
          ...Array.from({ length: 6 }, (_, i) => `wall-h-${i}-6`),
          ...Array.from({ length: 6 }, (_, i) => `wall-v-0-${i}`),
          ...Array.from({ length: 6 }, (_, i) => `wall-v-6-${i}`),
          // Create U-shape obstacle
          "wall-v-3-1",
          "wall-v-3-2",
          "wall-v-3-3",
          "wall-v-3-4",
          "wall-h-2-3",
          "wall-h-4-3",
        ]),
      }

    case 5:
      return {
        width: 7,
        height: 7,
        start: { x: 0, y: 0 },
        goal: { x: 6, y: 6 },
        walls: new Set([
          // Border walls
          ...Array.from({ length: 7 }, (_, i) => `wall-h-${i}-0`),
          ...Array.from({ length: 7 }, (_, i) => `wall-h-${i}-7`),
          ...Array.from({ length: 7 }, (_, i) => `wall-v-0-${i}`),
          ...Array.from({ length: 7 }, (_, i) => `wall-v-7-${i}`),
          // Complex interior maze
          "wall-v-2-1",
          "wall-v-2-2",
          "wall-h-3-2",
          "wall-h-4-2",
          "wall-v-4-2",
          "wall-v-4-3",
          "wall-v-4-4",
          "wall-h-2-4",
          "wall-h-3-4",
          "wall-v-5-4",
          "wall-v-5-5",
          "wall-h-5-3",
        ]),
      }

    default:
      const size = Math.min(6 + level, 10)
      return {
        width: size,
        height: size,
        start: { x: 0, y: 0 },
        goal: { x: size - 1, y: size - 1 },
        walls: new Set([
          ...Array.from({ length: size }, (_, i) => `wall-h-${i}-0`),
          ...Array.from({ length: size }, (_, i) => `wall-h-${i}-${size}`),
          ...Array.from({ length: size }, (_, i) => `wall-v-0-${i}`),
          ...Array.from({ length: size }, (_, i) => `wall-v-${size}-${i}`),
          // Add some random interior walls
          ...Array.from({ length: Math.floor(size * 1.5) }, (_, i) => {
            const x = Math.floor(Math.random() * (size - 1)) + 1
            const y = Math.floor(Math.random() * (size - 1))
            return Math.random() > 0.5 ? `wall-h-${x}-${y}` : `wall-v-${x}-${y}`
          }),
        ]),
      }
  }
}

export function generateMazeWithDifficulty(level: number): Maze {
  return generateMazeForLevel(level)
}
