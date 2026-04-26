"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { AppSidebar } from "@/components/app-sidebar"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("mcrs_token")
    if (!token) {
      router.replace("/login")
    } else {
      setAuthorized(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (authorized === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}