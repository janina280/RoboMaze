import type { Block } from "./game-context"

export function generatePseudoCode(blocks: Block[]): string {
  let code = "START\n"
  let indentLevel = 0

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    const indent = "  ".repeat(indentLevel)

    switch (block.type) {
      case "forward":
        code += `${indent}Move Forward\n`
        break

      case "turnLeft":
        code += `${indent}Turn Left 90°\n`
        break

      case "turnRight":
        code += `${indent}Turn Right 90°\n`
        break

      case "wait":
        code += `${indent}Wait 1 second\n`
        break

      case "repeatStart": {
        const repeatCount = block.repeatCount || 2
        code += `${indent}Repeat ${repeatCount} times:\n`
        indentLevel++
        break
      }

      case "repeatEnd":
        if (indentLevel > 0) {
          indentLevel--
        }
        break
    }
  }

  code += "END"
  return code
}

export function generatePython(blocks: Block[]): string {
  let code = "# RoboMaze Program\n\n"
  code += "def solve_maze():\n"
  let indentLevel = 1

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    const indent = "    ".repeat(indentLevel)

    switch (block.type) {
      case "forward":
        code += `${indent}move_forward()\n`
        break

      case "turnLeft":
        code += `${indent}turn_left()\n`
        break

      case "turnRight":
        code += `${indent}turn_right()\n`
        break

      case "wait":
        code += `${indent}wait(1)\n`
        break

      case "repeatStart": {
        const repeatCount = block.repeatCount || 2
        code += `${indent}for _ in range(${repeatCount}):\n`
        indentLevel++
        break
      }

      case "repeatEnd":
        if (indentLevel > 1) {
          indentLevel--
        }
        break
    }
  }

  code += "\n# Run the solution\nsolve_maze()\n"
  return code
}

export function generateJavaScript(blocks: Block[]): string {
  let code = "// RoboMaze Program\n\n"
  code += "function solveMaze() {\n"
  let indentLevel = 1

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    const indent = "  ".repeat(indentLevel)

    switch (block.type) {
      case "forward":
        code += `${indent}moveForward();\n`
        break

      case "turnLeft":
        code += `${indent}turnLeft();\n`
        break

      case "turnRight":
        code += `${indent}turnRight();\n`
        break

      case "wait":
        code += `${indent}wait(1);\n`
        break

      case "repeatStart": {
        const repeatCount = block.repeatCount || 2
        code += `${indent}for (let i = 0; i < ${repeatCount}; i++) {\n`
        indentLevel++
        break
      }

      case "repeatEnd":
        if (indentLevel > 1) {
          indentLevel--
          code += `${"  ".repeat(indentLevel)}}\n`
        }
        break
    }
  }

  code += "}\n\n// Run the solution\nsolveMaze();\n"
  return code
}

export function getBlockDescription(block: Block): string {
  switch (block.type) {
    case "forward":
      return "Move Forward - Takes one step in the current direction"
    case "turnLeft":
      return "Turn Left - Rotates 90° counterclockwise"
    case "turnRight":
      return "Turn Right - Rotates 90° clockwise"
    case "wait":
      return "Wait - Pauses for 1 second"
    case "repeatStart":
      return `Repeat ${block.repeatCount || 2}x - Executes blocks inside multiple times`
    case "repeatEnd":
      return "End Repeat - Marks the end of a repeat block"
    default:
      return "Unknown block"
  }
}
