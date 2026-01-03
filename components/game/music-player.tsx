"use client"

import { useEffect, useRef, useState } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MusicPlayerProps {
  isPlaying: boolean
}

export default function MusicPlayer({ isPlaying }: MusicPlayerProps) {
  const audioContextRef = useRef<AudioContext | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.2)
  const isPlayingRef = useRef(false)

  useEffect(() => {
    if (!isPlaying || isMuted) {
      isPlayingRef.current = false
      return
    }

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    audioContextRef.current = audioContext
    isPlayingRef.current = true

    const notes = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88] // C4–B4
    let noteIndex = 0

    const playAmbientNote = () => {
      if (!isPlayingRef.current) return
      const now = audioContext.currentTime
      const freq = notes[noteIndex % notes.length] + (Math.random() * 10 - 5) // mic random pitch

      // Main soft oscillator
      const osc = audioContext.createOscillator()
      const gain = audioContext.createGain()
      osc.connect(gain)
      gain.connect(audioContext.destination)
      osc.type = "sine"
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(volume * 0.1, now + 1.0)
      gain.gain.linearRampToValueAtTime(0, now + 3.0)
      osc.start(now)
      osc.stop(now + 3.0)

      // Long pad layer
      const padOsc = audioContext.createOscillator()
      const padGain = audioContext.createGain()
      padOsc.connect(padGain)
      padGain.connect(audioContext.destination)
      padOsc.type = "triangle"
      padOsc.frequency.value = freq / 2
      padGain.gain.setValueAtTime(0, now)
      padGain.gain.linearRampToValueAtTime(volume * 0.05, now + 2)
      padGain.gain.linearRampToValueAtTime(0, now + 6)
      padOsc.start(now)
      padOsc.stop(now + 6)

      noteIndex++
      setTimeout(playAmbientNote, 2500) // note lente, fiecare ~2.5 sec
    }

    playAmbientNote()

    return () => {
      isPlayingRef.current = false
      if (audioContext.state !== "closed") audioContext.close()
    }
  }, [isPlaying, isMuted, volume])

  const toggleMute = () => setIsMuted(!isMuted)

  return (
      <div className="flex items-center gap-2">
        <Button
            variant="outline"
            size="sm"
            onClick={toggleMute}
            className="flex items-center gap-2 bg-transparent"
            title={isMuted ? "Unmute music" : "Mute music"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          <span className="text-xs">{isMuted ? "Muted" : "Music"}</span>
        </Button>
        {!isMuted && (
            <input
                type="range"
                min="0"
                max="100"
                value={volume * 100}
                onChange={(e) => setVolume(Number(e.target.value) / 100)}
                className="w-20 h-2 bg-border rounded-lg appearance-none cursor-pointer"
                title="Volume"
            />
        )}
      </div>
  )
}
