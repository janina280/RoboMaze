"use client"

import { useState } from "react"
import GameContainer from "@/components/game/game-container"
import LevelSelector from "@/components/game/level-selector"
import MainMenu from "@/components/game/main-menu"
import HowToPlay from "@/components/game/how-to-play"
import BadgesPage from "@/components/game/badges-page"
import SettingsPage from "@/components/game/settings-page"
import TutorialOverlay from "@/components/game/tutorial-overlay"
import { GameProvider } from "@/lib/game-context"

type PageView = "menu" | "howToPlay" | "levels" | "badges" | "settings" | "game"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageView>("menu")
  const [selectedLevel, setSelectedLevel] = useState(1)
  const [showTutorial, setShowTutorial] = useState(true)

  const handleNavigate = (page: "start" | "howToPlay" | "levels" | "badges" | "settings") => {
    const pageMap: Record<typeof page, PageView> = {
      start: "levels",
      howToPlay: "howToPlay",
      levels: "levels",
      badges: "badges",
      settings: "settings",
    }
    setCurrentPage(pageMap[page])
  }

  const handleStartGame = (level: number) => {
    setSelectedLevel(level)
    setCurrentPage("game")
    setShowTutorial(true)
  }

  const handleBackToMenu = () => {
    setCurrentPage("menu")
    setShowTutorial(false)
  }

  const handleBackToLevels = () => {
    setCurrentPage("levels")
  }

  const handleNextLevel = () => {
    setSelectedLevel((prev) => prev + 1)
    setShowTutorial(false)
  }

  return (
    <GameProvider>
      <main className="relative min-h-screen bg-cover bg-center"
            style={{
              backgroundImage: "url('/robo.png')",
            }}
      >
        <div className="absolute inset-0 bg-black/20" />
        {currentPage === "menu" && <MainMenu onNavigate={handleNavigate} />}
        {currentPage === "howToPlay" && <HowToPlay onBack={handleBackToMenu} />}
        {currentPage === "levels" && <LevelSelector onStartGame={handleStartGame} />}
        {currentPage === "badges" && <BadgesPage onBack={handleBackToMenu} />}
        {currentPage === "settings" && <SettingsPage onBack={handleBackToMenu} />}
        {currentPage === "game" && (
          <div>
            <GameContainer level={selectedLevel} onBack={handleBackToLevels} onNextLevel={handleNextLevel} />
            {showTutorial && <TutorialOverlay />}
          </div>
        )}
      </main>
    </GameProvider>
  )
}
