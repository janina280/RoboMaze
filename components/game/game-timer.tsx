"use client"

import { useEffect, useState, useCallback } from "react"
import { Clock } from "lucide-react"

interface GameTimerProps {
  isRunning: boolean
  onTimeUpdate?: (seconds: number) => void
}

export default function GameTimer({ isRunning, onTimeUpdate }: GameTimerProps) {
  const [seconds, setSeconds] = useState(0)

  const handleTimeUpdate = useCallback(
    (newSeconds: number) => {
      onTimeUpdate?.(newSeconds)
    },
    [onTimeUpdate],
  )

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setSeconds((prev) => {
        const newSeconds = prev + 1
        handleTimeUpdate(newSeconds)
        return newSeconds
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, handleTimeUpdate])

  useEffect(() => {
    if (!isRunning) {
      setSeconds(0)
    }
  }, [isRunning])

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground px-4 py-2 rounded-lg font-semibold">
      <Clock size={20} />
      <span>{formatTime(seconds)}</span>
    </div>
  )
}
