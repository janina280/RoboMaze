"use client"

import { useEffect, useState } from "react"
import GameContainer from "@/components/game/game-container"
import LevelSelector from "@/components/game/level-selector"
import MainMenu from "@/components/game/main-menu"
import HowToPlay from "@/components/game/how-to-play"
import BadgesPage from "@/components/game/badges-page"
import SettingsPage from "@/components/game/settings-page"
import TutorialOverlay from "@/components/game/tutorial-overlay"
import { GameProvider, useGame } from "@/lib/game-context"

type PageView =
    | "menu"
    | "howToPlay"
    | "levels"
    | "badges"
    | "settings"
    | "game"
    | "exit"

export default function HomeWrapper() {
  return (
      <GameProvider>
        <Home />
      </GameProvider>
  )
}

function Home() {
  const [currentPage, setCurrentPage] = useState<PageView>("menu")
  const [showTutorial, setShowTutorial] = useState(false)

  const { completedLevels, completeLevel } = useGame()

  const currentLevel =
      completedLevels.length > 0 ? Math.max(...completedLevels) + 1 : 1

  useEffect(() => {
    if (currentPage === "game" && currentLevel <= 5) {
      setShowTutorial(true)
    } else {
      setShowTutorial(false)
    }
  }, [currentPage, currentLevel])

  const handleNavigate = (
      page: "howToPlay" | "levels" | "badges" | "settings" | "exit",
  ) => {
    setCurrentPage(page)
  }

  const handleStartCurrentLevel = () => {
    setCurrentPage("game")
  }

  const handleBackToMenu = () => {
    setCurrentPage("menu")
    setShowTutorial(false)
  }

  const handleBackToLevels = () => {
    setCurrentPage("levels")
    setShowTutorial(false)
  }

  const handleNextLevel = () => {
    completeLevel(currentLevel)
    setCurrentPage("game")
  }

  const handleExitApp = () => {
    setCurrentPage("exit")
  }

  return (
      <main
          className="relative min-h-screen bg-cover bg-center"
          style={{ backgroundImage: "url('/robo.png')" }}
      >
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        {currentPage === "menu" && (
            <MainMenu
                onNavigate={handleNavigate}
                onStart={handleStartCurrentLevel}
                onExit={handleExitApp}
            />
        )}

        {currentPage === "howToPlay" && (
            <HowToPlay onBack={handleBackToMenu} />
        )}

        {currentPage === "levels" && (
            <LevelSelector onStartGame={handleStartCurrentLevel} />
        )}

        {currentPage === "badges" && (
            <BadgesPage onBack={handleBackToMenu} />
        )}

        {currentPage === "settings" && (
            <SettingsPage onBack={handleBackToMenu} />
        )}

        {currentPage === "game" && (
            <div className="relative">
              <GameContainer
                  level={currentLevel}
                  onBack={handleBackToLevels}
                  onNextLevel={handleNextLevel}
              />

              {showTutorial && currentLevel <= 5 && (
                  <TutorialOverlay
                      level={currentLevel}
                      onClose={() => setShowTutorial(false)}
                  />
              )}
            </div>
        )}

        {currentPage === "exit" && (
            <div className="flex items-center justify-center h-screen text-white text-3xl">
              Thanks for playing RoboMaze!
            </div>
        )}
      </main>
  )
}
