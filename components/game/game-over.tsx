"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, RotateCcw, Home, AlertCircle } from "lucide-react"

interface GameOverOverlayProps {
    hits: number
    maxHits: number
    onRetry: () => void
    onExit: () => void
}

export default function GameOverOverlay({ hits, maxHits, onRetry, onExit }: GameOverOverlayProps) {

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl shadow-2xl max-w-md w-full border border-border overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-500 to-red-700 p-6 text-white">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <AlertCircle size={24} />
                            <h2 className="text-2xl font-bold">Game Over</h2>
                        </div>
                        <button
                            onClick={onExit}
                            className="hover:bg-white/20 p-1 rounded transition-colors"
                            aria-label="Close game over"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <p className="text-sm opacity-90">
                        You hit the wall {hits} out of {maxHits} times.
                    </p>
                </div>

                {/* Content / Feedback */}
                <div className="p-6 space-y-6 text-center">
                    <p className="text-muted-foreground">
                        Don’t worry — each mistake helps you learn programming logic!
                    </p>

                    {/* Hit indicators */}
                    <div className="flex justify-center gap-2">
                        {[...Array(maxHits)].map((_, i) => (
                            <span
                                key={i}
                                className={`w-4 h-4 rounded-full ${
                                    i < hits ? "bg-red-500" : "bg-green-500"
                                }`}
                            />
                        ))}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 mt-4">
                        <Button
                            className="flex-1 flex items-center justify-center"
                            onClick={onRetry}
                        >
                            <RotateCcw size={16} className="mr-2" /> Retry
                        </Button>

                        <Button
                            variant="outline"
                            className="flex-1 flex items-center justify-center bg-transparent"
                            onClick={onExit}
                        >
                            <Home size={16} className="mr-2" /> Back to Levels
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
