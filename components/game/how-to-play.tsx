"use client"

import { ArrowLeft, Zap, Target, Code, Bug, Trophy, Repeat } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HowToPlayProps {
  onBack: () => void
}

export default function HowToPlay({ onBack }: HowToPlayProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-background px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Button variant="outline" onClick={onBack} className="mb-4 bg-transparent">
            <ArrowLeft size={16} className="mr-2" />
            Back to Menu
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">How to Play RoboMaze</h1>
          <p className="text-lg text-muted-foreground">Learn everything you need to know to start your journey</p>
        </div>

        {/* Game Overview */}
        <div className="bg-gradient-to-r from-card to-card/80 border border-border rounded-xl p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Target size={24} className="text-primary" />
            Game Objective
          </h2>
          <p className="text-muted-foreground mb-4">
            Guide your robot through procedurally-generated mazes to reach the yellow goal square. Each level introduces
            new programming concepts and challenges.
          </p>
          <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4">
            <p className="text-secondary font-semibold">Your Goal:</p>
            <p className="text-foreground">
              Use visual programming blocks to create a sequence of commands that navigates the robot from the Start
              position to the yellow goal.
            </p>
          </div>
        </div>

        {/* Step-by-Step Guide */}
        <div className="bg-gradient-to-r from-card to-card/80 border border-border rounded-xl p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-foreground mb-6">Step-by-Step Guide</h2>

          <div className="space-y-6">
            {[
              {
                step: 1,
                icon: Target,
                title: "Select a Level",
                description: "Choose from 5 difficulty levels, each with unique maze sizes and programming challenges.",
              },
              {
                step: 2,
                icon: Code,
                title: "Read the Lessons",
                description: "Learn what each programming block does in the lesson panel on the right side.",
              },
              {
                step: 3,
                icon: Zap,
                title: "Build Your Program",
                description:
                  "Click programming blocks from the Block Editor to add them to your sequence. Available blocks include Move Forward, Turn Left, Turn Right, and Repeat loops.",
              },
              {
                step: 4,
                icon: Repeat,
                title: "Run Your Code",
                description:
                  "Click the 'Run Program' button to watch your robot execute each command step-by-step. The timer tracks how long you take.",
              },
              {
                step: 5,
                icon: Bug,
                title: "Debug if Needed",
                description:
                  "If your robot doesn't reach the goal, use the debugger to step through each command and find where it went wrong.",
              },
              {
                step: 6,
                icon: Trophy,
                title: "Earn Achievements",
                description:
                  "Complete levels efficiently, solve puzzles on the first try, and unlock badges as you progress.",
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={20} className="text-primary" />
                      <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Programming Blocks */}
        <div className="bg-gradient-to-r from-card to-card/80 border border-border rounded-xl p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-foreground mb-6">Available Programming Blocks</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: "Move Forward",
                color: "bg-blue-500",
                description: "Moves the robot one cell forward in its current direction",
              },
              {
                name: "Turn Left",
                color: "bg-green-500",
                description: "Rotates the robot 90 degrees counter-clockwise",
              },
              {
                name: "Turn Right",
                color: "bg-purple-500",
                description: "Rotates the robot 90 degrees clockwise",
              },
              {
                name: "Repeat Loop",
                color: "bg-orange-500",
                description: "Executes a sequence of blocks multiple times (advanced levels)",
              },
            ].map((block) => (
              <div key={block.name} className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                <div className={`w-4 h-4 rounded ${block.color} flex-shrink-0 mt-1`} />
                <div>
                  <p className="font-semibold text-foreground mb-1">{block.name}</p>
                  <p className="text-sm text-muted-foreground">{block.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips and Tricks */}
        <div className="bg-gradient-to-r from-card to-card/80 border border-border rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-foreground mb-4">Pro Tips</h2>
          <ul className="space-y-3">
            {[
              "Use fewer blocks to achieve higher efficiency scores",
              "Plan your path before adding blocks to avoid mistakes",
              "Use the Repeat block to write cleaner, more efficient code",
              "The debugger shows each step - use it to understand what went wrong",
              "Check the Code Viewer to see how your blocks translate to real programming syntax",
              "Listen to the background music or mute it in the top control bar",
              "Watch the timer to challenge yourself to complete levels faster",
            ].map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <Zap size={16} className="text-secondary flex-shrink-0 mt-1" />
                <p className="text-muted-foreground">{tip}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Ready to Play */}
        <div className="mt-8 text-center">
          <Button size="lg" onClick={onBack} className="bg-primary hover:bg-primary/90">
            Start Playing Now
          </Button>
        </div>
      </div>
    </div>
  )
}
