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
  const [volume, setVolume] = useState(0.3)
  const isPlayingRef = useRef(false)

  useEffect(() => {
    if (!isPlaying || isMuted) {
      isPlayingRef.current = false
      return
    }

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    audioContextRef.current = audioContext
    isPlayingRef.current = true

    // Space ambient music with multiple layers
    const notes = [
      { freq: 261.63, duration: 1.5 }, // C4
      { freq: 329.63, duration: 1.5 }, // E4
      { freq: 392.0, duration: 1.5 }, // G4
      { freq: 523.25, duration: 1.5 }, // C5
      { freq: 493.88, duration: 1.5 }, // B4
      { freq: 440.0, duration: 1.5 }, // A4
      { freq: 392.0, duration: 1.5 }, // G4
      { freq: 329.63, duration: 2.0 }, // E4
    ]

    let currentNoteIndex = 0

    const playAmbientNote = () => {
      if (!isPlayingRef.current) return

      const note = notes[currentNoteIndex % notes.length]
      const now = audioContext.currentTime

      // Main melody oscillator
      const osc = audioContext.createOscillator()
      const gain = audioContext.createGain()
      const filter = audioContext.createBiquadFilter()

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(audioContext.destination)

      osc.frequency.value = note.freq
      osc.type = "sine"
      filter.type = "lowpass"
      filter.frequency.value = 800

      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(volume * 0.15, now + 0.3)
      gain.gain.linearRampToValueAtTime(volume * 0.12, now + note.duration * 0.7)
      gain.gain.linearRampToValueAtTime(0, now + note.duration)

      osc.start(now)
      osc.stop(now + note.duration)

      // Ambient pad layer
      const padOsc = audioContext.createOscillator()
      const padGain = audioContext.createGain()

      padOsc.connect(padGain)
      padGain.connect(audioContext.destination)

      padOsc.frequency.value = note.freq / 2
      padOsc.type = "triangle"

      padGain.gain.setValueAtTime(0, now)
      padGain.gain.linearRampToValueAtTime(volume * 0.08, now + 0.5)
      padGain.gain.linearRampToValueAtTime(volume * 0.05, now + note.duration * 0.8)
      padGain.gain.linearRampToValueAtTime(0, now + note.duration)

      padOsc.start(now)
      padOsc.stop(now + note.duration)

      currentNoteIndex++
      setTimeout(playAmbientNote, note.duration * 1000)
    }

    playAmbientNote()

    return () => {
      isPlayingRef.current = false
      if (audioContext.state !== "closed") {
        audioContext.close()
      }
    }
  }, [isPlaying, isMuted, volume])

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

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
