"use client"

import { useState } from "react"
import { useGame } from "@/lib/game-context"
import { generatePseudoCode, generatePython, generateJavaScript } from "@/lib/code-generator"
import { Button } from "@/components/ui/button"
import { Code2, Copy, Check } from "lucide-react"

type CodeLanguage = "pseudo" | "python" | "javascript"

export default function CodeViewer() {
  const { blocks } = useGame()
  const [language, setLanguage] = useState<CodeLanguage>("pseudo")
  const [copied, setCopied] = useState(false)

  const getCode = () => {
    switch (language) {
      case "pseudo":
        return generatePseudoCode(blocks)
      case "python":
        return generatePython(blocks)
      case "javascript":
        return generateJavaScript(blocks)
      default:
        return ""
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(getCode())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const code = getCode()

  return (
    <div className="bg-card rounded-lg border border-border shadow-lg p-4 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <Code2 size={20} className="text-primary" />
        <h2 className="text-lg font-bold text-foreground">Code View</h2>
      </div>

      {/* Language Selector */}
      <div className="flex gap-2 mb-4">
        {[
          { lang: "pseudo" as const, label: "Pseudo" },
          { lang: "python" as const, label: "Python" },
          { lang: "javascript" as const, label: "JavaScript" },
        ].map(({ lang, label }) => (
          <Button
            key={lang}
            onClick={() => setLanguage(lang)}
            variant={language === lang ? "default" : "outline"}
            size="sm"
            className={language === lang ? "bg-primary text-primary-foreground" : ""}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Code Display */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {blocks.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            <p>Add blocks to see generated code</p>
          </div>
        ) : (
          <>
            <div className="flex-1 bg-muted/50 rounded border border-border overflow-y-auto p-3 font-mono text-xs mb-3">
              <pre className="whitespace-pre-wrap break-words text-foreground">{code}</pre>
            </div>

            <Button onClick={handleCopy} variant="outline" size="sm" className="w-full bg-transparent">
              {copied ? (
                <>
                  <Check size={16} className="mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} className="mr-1" />
                  Copy Code
                </>
              )}
            </Button>
          </>
        )}
      </div>

      <div className="bg-primary/10 border border-primary/30 rounded p-2 text-xs mt-3">
        <p className="text-primary font-semibold mb-1">Learn to Code:</p>
        <p className="text-foreground">See how blocks translate to real programming languages!</p>
      </div>
    </div>
  )
}
