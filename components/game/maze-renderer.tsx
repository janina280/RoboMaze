"use client"

import { useEffect, useRef } from "react"
import type { Robot, Maze } from "@/lib/game-context"

interface MazeRendererProps {
  maze: Maze
  robot: Robot
  solutionPath?: { x: number; y: number }[]
}

const CELL_SIZE = 50

export default function MazeRenderer({ maze, robot, solutionPath = []  }: MazeRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = maze.width * CELL_SIZE
    canvas.height = maze.height * CELL_SIZE

    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      Math.max(canvas.width, canvas.height),
    )
    gradient.addColorStop(0, "#1a0f2e")
    gradient.addColorStop(0.5, "#0f0820")
    gradient.addColorStop(1, "#050510")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = "#ffffff"
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 2
      ctx.globalAlpha = Math.random() * 0.8 + 0.2
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1

    ctx.strokeStyle = "#2d1b4e"
    ctx.lineWidth = 1
    for (let i = 0; i <= maze.width; i++) {
      ctx.beginPath()
      ctx.moveTo(i * CELL_SIZE, 0)
      ctx.lineTo(i * CELL_SIZE, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i <= maze.height; i++) {
      ctx.beginPath()
      ctx.moveTo(0, i * CELL_SIZE)
      ctx.lineTo(canvas.width, i * CELL_SIZE)
      ctx.stroke()
    }

    ctx.strokeStyle = "#8b5cf6"
    ctx.lineWidth = 6
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.shadowColor = "#8b5cf6"
    ctx.shadowBlur = 15

    console.log("[v0] Drawing walls:", Array.from(maze.walls))

    for (const wallId of maze.walls) {
      if (wallId.startsWith("wall-h-")) {
        // Horizontal wall - wall-h-X-Y is above cell (X, Y)
        const parts = wallId.split("-")
        const x = Number.parseInt(parts[2])
        const y = Number.parseInt(parts[3])
        const startX = x * CELL_SIZE
        const startY = y * CELL_SIZE
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(startX + CELL_SIZE, startY)
        ctx.stroke()
      } else if (wallId.startsWith("wall-v-")) {
        // Vertical wall - wall-v-X-Y is to the left of cell (X, Y)
        const parts = wallId.split("-")
        const x = Number.parseInt(parts[2])
        const y = Number.parseInt(parts[3])
        const startX = x * CELL_SIZE
        const startY = y * CELL_SIZE
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(startX, startY + CELL_SIZE)
        ctx.stroke()
      }
    }

    ctx.shadowColor = "transparent"
    ctx.shadowBlur = 0

    if (solutionPath.length > 0) {
      ctx.strokeStyle = "#22c55e"
      ctx.lineWidth = 4
      ctx.lineCap = "round"
      ctx.beginPath()
      solutionPath.forEach((cell, i) => {
        const x = cell.x * CELL_SIZE + CELL_SIZE / 2
        const y = cell.y * CELL_SIZE + CELL_SIZE / 2
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      })
      ctx.stroke()
    }
    const goalX = maze.goal.x * CELL_SIZE + CELL_SIZE / 2
    const goalY = maze.goal.y * CELL_SIZE + CELL_SIZE / 2

    const portalGradient = ctx.createRadialGradient(goalX, goalY, 5, goalX, goalY, 20)
    portalGradient.addColorStop(0, "#fbbf24")
    portalGradient.addColorStop(0.5, "#f59e0b")
    portalGradient.addColorStop(1, "#d97706")

    ctx.shadowColor = "#fbbf24"
    ctx.shadowBlur = 25
    ctx.fillStyle = portalGradient
    ctx.beginPath()
    ctx.arc(goalX, goalY, 18, 0, Math.PI * 2)
    ctx.fill()

    // Inner glow
    ctx.fillStyle = "#fef3c7"
    ctx.beginPath()
    ctx.arc(goalX, goalY, 8, 0, Math.PI * 2)
    ctx.fill()

    ctx.shadowColor = "transparent"
    ctx.shadowBlur = 0

    const robotX = robot.x * CELL_SIZE + CELL_SIZE / 2
    const robotY = robot.y * CELL_SIZE + CELL_SIZE / 2

    // Robot shadow/glow
    ctx.shadowColor = "#a78bfa"
    ctx.shadowBlur = 20

    // Robot body (metallic sphere)
    const robotGradient = ctx.createRadialGradient(robotX - 5, robotY - 5, 2, robotX, robotY, 15)
    robotGradient.addColorStop(0, "#c4b5fd")
    robotGradient.addColorStop(0.5, "#a78bfa")
    robotGradient.addColorStop(1, "#7c3aed")
    ctx.fillStyle = robotGradient
    ctx.beginPath()
    ctx.arc(robotX, robotY, 15, 0, Math.PI * 2)
    ctx.fill()

    ctx.shadowColor = "transparent"
    ctx.shadowBlur = 0

    // Robot antenna
    ctx.strokeStyle = "#c4b5fd"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(robotX, robotY - 15)
    ctx.lineTo(robotX, robotY - 22)
    ctx.stroke()

    ctx.fillStyle = "#fbbf24"
    ctx.beginPath()
    ctx.arc(robotX, robotY - 22, 3, 0, Math.PI * 2)
    ctx.fill()

    ctx.shadowColor = "#60a5fa"
    ctx.shadowBlur = 10

    const directionOffsets = {
      up: { x: 0, y: -20, angle: -Math.PI / 2 },
      down: { x: 0, y: 20, angle: Math.PI / 2 },
      left: { x: -20, y: 0, angle: Math.PI },
      right: { x: 20, y: 0, angle: 0 },
    }

    const direction = directionOffsets[robot.direction]

    // Draw thruster flame
    ctx.save()
    ctx.translate(robotX, robotY)
    ctx.rotate(direction.angle)

    const thrusterGradient = ctx.createLinearGradient(0, 0, 12, 0)
    thrusterGradient.addColorStop(0, "#60a5fa")
    thrusterGradient.addColorStop(0.5, "#3b82f6")
    thrusterGradient.addColorStop(1, "#1e40af")

    ctx.fillStyle = thrusterGradient
    ctx.beginPath()
    ctx.moveTo(15, 0)
    ctx.lineTo(22, -4)
    ctx.lineTo(22, 4)
    ctx.closePath()
    ctx.fill()

    ctx.restore()

    ctx.shadowColor = "transparent"
    ctx.shadowBlur = 0

    // Robot eye/sensor
    ctx.fillStyle = "#fef3c7"
    ctx.beginPath()
    ctx.arc(robotX, robotY - 2, 4, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "#0f0820"
    ctx.beginPath()
    ctx.arc(robotX, robotY - 2, 2, 0, Math.PI * 2)
    ctx.fill()
  }, [maze, robot, solutionPath])

  return (
    <canvas
      ref={canvasRef}
      className="w-100 h-full rounded-lg border-2 border-primary/30"
      style={{ maxWidth: "100%", maxHeight: "100%", boxShadow: "0 0 30px rgba(139, 92, 246, 0.3)" }}
    />
  )
}
