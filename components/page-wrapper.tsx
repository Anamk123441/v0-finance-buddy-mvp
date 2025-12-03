"use client"

import type React from "react"

import { useEffect } from "react"

interface PageWrapperProps {
  children: React.ReactNode
}

export function PageWrapper({ children }: PageWrapperProps) {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth"
  }, [])

  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-50">{children}</div>
}
