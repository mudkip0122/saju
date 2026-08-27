'use client'

import { MoonStar } from 'lucide-react'

export function LandingNav() {
  function scrollToAnalysis() {
    document.getElementById('analysis-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav aria-label="주요 탐색" className="sticky top-3 z-30 mx-auto mb-6 flex max-w-[72rem] items-center justify-between rounded-full border border-white/75 bg-white/70 px-3 py-2.5 shadow-[0_14px_35px_-22px_rgba(57,30,110,0.48)] backdrop-blur-xl sm:px-5">
      <a href="#top" className="flex min-h-11 items-center gap-2.5 rounded-full px-1 text-sm font-bold tracking-tight text-[#121c2a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6b38d4]/20 sm:text-base">
        <span className="flex size-9 items-center justify-center rounded-full bg-[#6b38d4] text-white shadow-sm">
          <MoonStar className="size-4" aria-hidden />
        </span>
        Astra Destiny
      </a>
      <button
        type="button"
        onClick={scrollToAnalysis}
        className="min-h-11 rounded-full bg-[#6b38d4] px-4 py-2 text-xs font-bold text-white shadow-[0_10px_24px_-12px_rgba(107,56,212,0.8)] transition hover:bg-[#5826bd] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6b38d4]/25 sm:px-5 sm:text-sm"
      >
        내 운세 분석하기
      </button>
    </nav>
  )
}
