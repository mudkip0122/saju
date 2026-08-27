import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { todayLabel, type FortuneResult } from '@/lib/mock-fortune'

export function TodayFortuneCard({ today }: { today: FortuneResult['today'] }) {
  return (
    <section
      aria-labelledby="today-title"
      className="border-primary/25 from-accent/70 via-card to-card rounded-3xl border bg-gradient-to-br p-6 shadow-[0_18px_50px_-32px_oklch(0.4_0.12_292/0.5)] sm:p-7"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="today-title" className="text-lg font-bold tracking-tight sm:text-xl">
          <span aria-hidden>☀️</span> 오늘의 운세
        </h2>
        <p className="text-muted-foreground text-xs">{todayLabel()}</p>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <div className="flex items-center gap-1" aria-hidden>
          {Array.from({ length: today.max }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                'size-6 sm:size-7',
                i < today.score ? 'fill-primary text-primary' : 'text-primary/25',
              )}
              strokeWidth={1.5}
            />
          ))}
        </div>
        <p className="text-base font-bold tracking-tight">
          <span className="text-primary text-xl">{today.score}</span>
          <span className="text-muted-foreground"> / {today.max}</span>
        </p>
      </div>

      <div className="border-border/70 mt-5 border-t pt-5">
        <p className="text-muted-foreground text-xs font-medium">오늘의 한마디</p>
        <p className="mt-2 text-pretty text-base leading-relaxed font-medium sm:text-lg">
          {today.message}
        </p>
      </div>

      <ul className="mt-5 flex flex-wrap gap-2">
        {today.keywords.map((keyword) => (
          <li
            key={keyword}
            className="border-primary/20 bg-card/80 text-secondary-foreground rounded-full border px-3 py-1.5 text-xs font-medium"
          >
            #{keyword}
          </li>
        ))}
      </ul>

      <div className="border-primary/20 bg-card/70 mt-5 rounded-2xl border p-4">
        <p className="text-primary text-xs font-bold">오늘의 작은 실천</p>
        <p className="mt-1.5 text-sm leading-relaxed font-medium">{today.action}</p>
      </div>
    </section>
  )
}
