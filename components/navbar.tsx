"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Film, Menu, X, LogOut } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { clearAuth } from "@/lib/api"

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/recommendations", label: "Recommendations" },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isLanding = pathname === "/"
  const isLogin = pathname === "/login"
  const isRegister = pathname === "/register"
  const showNav = !isLanding && !isLogin && !isRegister

  function handleSignOut() {
    clearAuth()
    router.replace("/login")
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Film className="h-5 w-5 text-primary" />
          <span className="font-serif text-lg font-semibold text-foreground">
            MC-RecSys
          </span>
        </Link>

        {showNav && (
          <>
            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="ml-2 text-muted-foreground hover:text-destructive"
              >
                <LogOut className="mr-1 h-4 w-4" />
                Sign out
              </Button>
            </nav>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </>
        )}
      </div>

      {/* Mobile menu */}
      {mobileOpen && showNav && (
        <nav className="border-t border-border bg-card px-4 pb-3 pt-2 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleSignOut}
            className="mt-1 flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </button>
        </nav>
      )}
    </header>
  )
}