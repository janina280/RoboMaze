"use client"

import { Home, BookOpen, Target, Trophy, Settings } from "lucide-react"

interface MainMenuProps {
  onNavigate: (page: "start" | "howToPlay" | "levels" | "badges" | "settings") => void
}

export default function MainMenu({ onNavigate }: MainMenuProps) {
  const menuItems = [
    {
      id: "start" as const,
      icon: Home,
      label: "Start Game",
      description: "Begin your RoboMaze adventure",
      color: "from-primary to-primary/80",
    },
    {
      id: "howToPlay" as const,
      icon: BookOpen,
      label: "How to Play",
      description: "Learn the game mechanics",
      color: "from-secondary to-secondary/80",
    },
    {
      id: "levels" as const,
      icon: Target,
      label: "Select Level",
      description: "Choose your difficulty",
      color: "from-accent to-accent/80",
    },
    {
      id: "badges" as const,
      icon: Trophy,
      label: "Badges",
      description: "View your achievements",
      color: "from-secondary to-accent",
    },
    {
      id: "settings" as const,
      icon: Settings,
      label: "Settings",
      description: "Customize your experience",
      color: "from-muted-foreground to-muted-foreground/80",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-background via-primary/10 to-background">
      {/* Header */}
      <div className="text-center mb-12 max-w-3xl">
        <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-4 leading-tight">
          RoboMaze
        </h1>
        <p className="text-lg text-muted-foreground font-semibold">Learn Programming Through Robot Navigation</p>
      </div>

      {/* Menu Buttons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="group relative bg-gradient-to-br from-card to-card/80 border-2 border-border hover:border-primary rounded-xl p-8 transition-all hover:shadow-xl hover:scale-105"
            >
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 rounded-xl transition-colors" />

              <div className="relative flex flex-col items-center text-center space-y-4">
                <div className={`bg-gradient-to-r ${item.color} p-4 rounded-full`}>
                  <Icon size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">{item.label}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-12 text-center max-w-xl">
        <p className="text-sm text-muted-foreground">
          Master fundamental programming concepts: sequences, control flow, loops, and algorithmic thinking through an
          interactive visual programming environment.
        </p>
      </div>
    </div>
  )
}
