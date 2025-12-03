"use client"

import { useAppStore } from "@/lib/store"
import { Card } from "@/components/ui/card"

export function AchievementsSection() {
  const achievements = useAppStore((state) => state.achievements)
  const expenses = useAppStore((state) => state.expenses)

  // Compute streak
  let streak = 0
  const now = new Date()
  const checkDate = new Date(now)
  while (streak < 365) {
    const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, "0")}-${String(checkDate.getDate()).padStart(2, "0")}`
    const hasExpense = expenses.some((exp) => exp.timestamp.startsWith(dateStr) && !exp.deleted)
    if (!hasExpense) break
    streak++
    checkDate.setDate(checkDate.getDate() - 1)
  }

  // Get recent achievements
  const recentAchievements = achievements
    .sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime())
    .slice(0, 5)

  if (recentAchievements.length === 0 && streak === 0) return null

  return (
    <Card className="border-0 shadow-lg">
      <div className="p-6 space-y-4">
        <h2 className="font-semibold">Your Achievements</h2>

        {streak > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 rounded-lg p-4">
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">Current Streak</p>
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-300 mt-1">{streak} days</p>
            <p className="text-xs text-amber-700 dark:text-amber-200 mt-1">Keep tracking daily!</p>
          </div>
        )}

        {recentAchievements.length > 0 && (
          <div className="space-y-2">
            {recentAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg"
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
