"use client"

import { useState } from "react"
import { useGame, type BlockType } from "@/lib/game-context"
import { Button } from "@/components/ui/button"
import { X, GripVertical, HelpCircle } from "lucide-react"
import { getBlockDescription } from "@/lib/code-generator"

const BLOCK_TYPES: { type: BlockType; label: string; color: string; icon: string; description: string }[] = [
  {
    type: "forward",
    label: "Move Forward",
    color: "bg-emerald-500",
    icon: "▲",
    description: "Move one step in the direction robot is facing",
  },
  {
    type: "turnLeft",
    label: "Turn Left",
    color: "bg-orange-500",
    icon: "↺",
    description: "Rotates the robot 90 degrees counterclockwise",
  },
  {
    type: "turnRight",
    label: "Turn Right",
    color: "bg-amber-500",
    icon: "↻",
    description: "Rotates the robot 90 degrees clockwise",
  },
  {
    type: "repeatStart",
    label: "Repeat x2",
    color: "bg-purple-500",
    icon: "🔄",
    description: "Repeats the following blocks multiple times",
  },
  {
    type: "repeatEnd",
    label: "End Repeat",
    color: "bg-purple-700",
    icon: "⏹",
    description: "Ends the repeat block",
  },
]

export default function BlockEditor() {
  const { blocks, addBlock, removeBlock, clearBlocks } = useGame()
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null)
  const [hoveredType, setHoveredType] = useState<BlockType | null>(null)

  const handleAddBlock = (type: BlockType) => {
    addBlock({
      id: `${type}-${Date.now()}-${Math.random()}`,
      type,
      repeatCount: type === "repeatStart" ? 2 : undefined,
    })
  }

  const handleDragStart = (id: string) => {
    setDraggedId(id)
  }

  return (
    <div className="bg-card rounded-lg border border-border shadow-lg p-4 flex flex-col gap-4 h-full">
      <div>
        <h2 className="text-lg font-bold text-foreground mb-1">Program Blocks</h2>
        <p className="text-xs text-muted-foreground mb-3">Click blocks to build your program</p>

        <div className="grid grid-cols-2 gap-2">
          {BLOCK_TYPES.map(({ type, label, color, description }) => (
            <div
              key={type}
              className="relative group"
              onMouseEnter={() => setHoveredType(type)}
              onMouseLeave={() => setHoveredType(null)}
            >
              <Button
                onClick={() => handleAddBlock(type)}
                className={`${color} text-white font-semibold hover:opacity-90 transition-opacity text-xs py-2 w-full h-auto min-h-[2.5rem]`}
                title={description}
              >
                {label}
              </Button>

              {hoveredType === type && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-black text-white text-xs p-2 rounded whitespace-normal pointer-events-none z-50 group-hover:visible">
                  {description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-4 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-foreground text-sm">Your Program</h3>
          {blocks.length > 0 && (
            <Button onClick={clearBlocks} variant="ghost" size="sm" className="text-destructive text-xs">
              Clear All
            </Button>
          )}
        </div>

        <div className="space-y-1 flex-1 overflow-y-auto pr-2">
          {blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-xs py-8 space-y-2">
              <HelpCircle size={24} className="opacity-50" />
              <p className="text-center">Click buttons above to add programming blocks!</p>
              <p className="text-center text-xs opacity-75">Each block represents one action.</p>
            </div>
          ) : (
            blocks.map((block, index) => {
              const blockInfo = BLOCK_TYPES.find((b) => b.type === block.type)
              const description = getBlockDescription(block)

              return (
                <div
                  key={block.id}
                  draggable
                  onDragStart={() => handleDragStart(block.id)}
                  onMouseEnter={() => setHoveredBlockId(block.id)}
                  onMouseLeave={() => setHoveredBlockId(null)}
                  className={`${blockInfo?.color} text-white p-2 rounded flex items-center justify-between text-xs cursor-grab active:cursor-grabbing hover:opacity-90 transition-opacity relative group`}
                  title={description}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <GripVertical size={14} className="opacity-60" />
                    <span className="font-semibold">{index + 1}.</span>
                    <span>{blockInfo?.label}</span>
                  </div>
                  <button onClick={() => removeBlock(block.id)} className="hover:opacity-75 transition-opacity p-1">
                    <X size={14} />
                  </button>

                  {hoveredBlockId === block.id && (
                    <div className="absolute bottom-full left-0 mb-2 bg-black text-white text-xs p-2 rounded whitespace-nowrap pointer-events-none z-50">
                      {description}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      <div className="bg-primary/10 border border-primary/30 rounded p-3 text-xs space-y-1">
        <p className="font-semibold text-primary">Tips for Success:</p>
        <ul className="text-foreground space-y-1 text-xs">
          <li>• Plan your path before adding blocks</li>
          <li>• Use fewer blocks for efficiency</li>
          <li>• Repeat blocks reduce code duplication</li>
        </ul>
      </div>
    </div>
  )
}
