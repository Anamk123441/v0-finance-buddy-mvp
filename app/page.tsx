"use client"

import { useEffect, useState } from "react"
import { Onboarding } from "@/components/onboarding"
import { MainApp } from "@/components/main-app"
import { useAppStore } from "@/lib/store"
import { PageWrapper } from "@/components/page-wrapper"

export default function Home() {
  const [isHydrated, setIsHydrated] = useState(false)
  const user = useAppStore((state) => state.user)
  const onboardingCompleted = user?.onboardingCompleted ?? false

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-500 rounded-full animate-pulse mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your financial buddy...</p>
          </div>
        </div>
      </PageWrapper>
    )
  }

  return <PageWrapper>{onboardingCompleted ? <MainApp /> : <Onboarding />}</PageWrapper>
}
