"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Star,
  ThumbsUp,
  Film,
  User,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getRole } from "@/lib/api"
import { useEffect, useState } from "react"

const baseLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/rate", label: "Rate Movies", icon: Star },
  { href: "/recommendations", label: "Recommendations", icon: ThumbsUp },
  { href: "/profile", label: "My Profile", icon: User },
]

const adminLink = { href: "/admin", label: "Admin", icon: Settings }

export function AppSidebar() {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    setIsAdmin(getRole() === "admin")
  }, [])

  const links = isAdmin ? [...baseLinks, adminLink] : baseLinks

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-card lg:block">
      <div className="flex h-full flex-col px-3 py-4">
        <div className="mb-6 flex items-center gap-2 px-3">
          <Film className="h-5 w-5 text-primary" />
          <span className="font-serif text-sm font-semibold text-foreground">
            Navigation
          </span>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname.startsWith(link.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            )
          })}
        </nav>
        <div className="mt-auto rounded-md border border-border bg-muted px-3 py-3">
          <p className="text-xs font-medium text-foreground">About</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Multi-Criteria Movie Recommender using Adaptive Genetic Algorithm
          </p>
        </div>
      </div>
    </aside>
  )
}