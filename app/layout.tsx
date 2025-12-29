import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RoboMaze - Learn Programming with Robot Navigation",
  description:
    "An educational game where children learn programming logic by guiding a robot through mazes using visual programming blocks.",
  icons: {
    icon: [
      {
        url: "/robo.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/robo.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>{children}</body>
    </html>
  )
}
