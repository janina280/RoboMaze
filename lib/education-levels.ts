export interface EducationLevel {
  id: number
  name: string
  description: string
  mazeSize: number
  wallDensity: number
  lessons?: string[]
  hint?: string
  objectives?: string[]
  requiredConcepts?: string[]
  successMessage?: string

  type?: "lesson" | "transition" | "procedural"
}


export const EDUCATION_LEVELS: EducationLevel[] = [
  {
    id: 1,
    name: "Meet the Robot",
    description: "Learn how the robot moves forward",
    mazeSize: 5,
    wallDensity: 0.1,
    lessons: [
      "🤖 The robot starts at the Start square",
      "⬆️ 'Move Forward' makes it go one step",
      "🎯 The goal is the sun square",
    ],
    hint: "Add 'Move Forward' blocks to reach the red square",
    objectives: ["Understanding sequences", "Basic movement"],
    requiredConcepts: ["forward"],
    successMessage: "Great! You guided the robot using sequences! Each block executes one after another.",
  },
  {
    id: 2,
    name: "Turning Around",
    description: "Master turning in different directions",
    mazeSize: 6,
    wallDensity: 0.15,
    lessons: [
      "↪️ 'Turn Left' rotates the robot 90 degrees left",
      "↫️ 'Turn Right' rotates the robot 90 degrees right",
      "The robot faces a direction when it turns!",
    ],
    hint: "Combine 'Move Forward', 'Turn Left', and 'Turn Right'",
    objectives: ["Directional thinking", "Combined commands"],
    requiredConcepts: ["forward", "turnLeft", "turnRight"],
    successMessage: "Excellent! You used multiple types of commands. This is the start of algorithm thinking!",
  },
  {
    id: 3,
    name: "Efficient Paths",
    description: "Find the shortest path to the goal",
    mazeSize: 7,
    wallDensity: 0.2,
    lessons: [
      "✨ Fewer blocks = more efficient code",
      "💡 Plan your path before adding blocks",
      "🧠 Think about the maze layout",
    ],
    hint: "Minimize the number of blocks for the most efficient solution",
    objectives: ["Optimization", "Planning"],
    requiredConcepts: ["forward", "turnLeft", "turnRight"],
    successMessage: "Perfect! You found an efficient solution! Great programmers write clean, minimal code.",
  },
  {
    id: 4,
    name: "Loops Unlocked",
    description: "Learn the power of repeating actions",
    mazeSize: 8,
    wallDensity: 0.25,
    lessons: [
      "🔄 'Repeat' blocks run commands multiple times",
      "Instead of: [Forward, Forward, Forward]",
      "Write: [Repeat 3x: Forward] - Same result, cleaner!",
    ],
    hint: "Use 'Repeat' blocks to avoid writing the same block multiple times",
    objectives: ["Understanding loops", "DRY principle"],
    requiredConcepts: ["forward", "repeatStart", "repeatEnd"],
    successMessage: "Fantastic! You used loops! This is a fundamental programming concept used in all real code.",
  },
  {
    id: 5,
    name: "Master Algorithm",
    description: "Combine all concepts in a complex maze",
    mazeSize: 10,
    wallDensity: 0.3,
    lessons: [
      "🎓 You now know: sequences, direction changes, and loops",
      "These are the foundation of ALL programming!",
      "Real programmers solve problems just like this",
    ],
    hint: "Plan carefully, use loops efficiently, think about directions",
    objectives: ["Complete algorithmic thinking", "Problem-solving strategy"],
    requiredConcepts: ["forward", "turnLeft", "turnRight", "repeatStart"],
    successMessage:
      "Amazing! You've mastered the basics of programming! These concepts power everything from games to apps!",
  },

  {
    id: 6,
    name: "Free Play Begins",
    description: "Continue your journey",
    mazeSize: 10,
    wallDensity: 0.3,
    type: "transition",
    lessons: [
      "🎉 Congratulations!",
      "You have learned all the core programming concepts:",
      "• Sequences",
      "• Turns",
      "• Loops",
      "",
      "From now on, levels will be generated dynamically.",
      "Each one will be harder than the last.",
    ],
    hint: "There is no single correct solution. Think, test, and improve.",
    successMessage: "Welcome to procedural challenges! 🚀",
  }

]
