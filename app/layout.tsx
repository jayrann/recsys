import type { Metadata, Viewport } from "next"
import { Inter, Merriweather } from "next/font/google"

import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-merriweather",
})

export const metadata: Metadata = {
  title: "MC-RecSys | Multi-Criteria Movie Recommender",
  description:
    "A Multi-Criteria Movie Recommender System using Adaptive Genetic Algorithm — Final Year Project",
}

export const viewport: Viewport = {
  themeColor: "#2563a8",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${merriweather.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
