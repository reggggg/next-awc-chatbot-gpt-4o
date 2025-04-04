import React from 'react'

export default function LimitWarning() {
  return (
    <div className="sticky top-0 left-0 w-full py-2 text-center bg-orange-500 text-background">
      <p className="text-xs sm:text-sm">⚠️ Heads up! This is powered by GPT-4o (Free Tier) — capped at 50 requests per day. Use wisely!</p>
    </div>
  )
}

