"use client"

import { ArrowLeft, Volume2, VolumeX, Music, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface SettingsPageProps {
  onBack: () => void
}

export default function SettingsPage({ onBack }: SettingsPageProps) {
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [soundEffects, setSoundEffects] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-background px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Button variant="outline" onClick={onBack} className="mb-4 bg-transparent">
            <ArrowLeft size={16} className="mr-2" />
            Back to Menu
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-lg text-muted-foreground">Customize your RoboMaze experience</p>
        </div>

        {/* Audio Settings */}
        <div className="bg-gradient-to-r from-card to-card/80 border border-border rounded-xl p-8 mb-6 shadow-lg">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Volume2 size={24} className="text-primary" />
            Audio Settings
          </h2>

          <div className="space-y-6">
            {/* Background Music */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Music size={20} className="text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Background Music</h3>
                </div>
                <p className="text-sm text-muted-foreground">Play music during gameplay</p>
              </div>
              <Button
                variant={musicEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => setMusicEnabled(!musicEnabled)}
              >
                {musicEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </Button>
            </div>

            {/* Sound Effects */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Volume2 size={20} className="text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Sound Effects</h3>
                </div>
                <p className="text-sm text-muted-foreground">Play sounds for robot movements and actions</p>
              </div>
              <Button
                variant={soundEffects ? "default" : "outline"}
                size="sm"
                onClick={() => setSoundEffects(!soundEffects)}
              >
                {soundEffects ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </Button>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-gradient-to-r from-card to-card/80 border border-border rounded-xl p-8 mb-6 shadow-lg">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Palette size={24} className="text-primary" />
            Display Settings
          </h2>

          <div className="space-y-4">
            <p className="text-muted-foreground">Display settings coming soon! Features will include:</p>
            <ul className="space-y-2 text-sm text-muted-foreground ml-4">
              <li>• Theme customization (Light/Dark mode)</li>
              <li>• Animation speed controls</li>
              <li>• Grid size preferences</li>
              <li>• Color scheme options</li>
            </ul>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-gradient-to-r from-card to-card/80 border border-border rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-foreground mb-4">About RoboMaze</h2>
          <p className="text-muted-foreground mb-4">
            RoboMaze is an educational game designed to teach fundamental programming concepts through interactive
            gameplay. Learn sequences, loops, and algorithmic thinking while having fun!
          </p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Version: 1.0.0</p>
            <p>Built with Next.js and React</p>
          </div>
        </div>
      </div>
    </div>
  )
}
