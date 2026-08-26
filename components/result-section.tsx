'use client'

import { Compass, Focus, Sparkle } from 'lucide-react'
import { ShareCard } from '@/components/share-card'
import { TodayFortuneCard } from '@/components/today-fortune-card'
import { formatKoreanDate, formatKoreanTime, type FortuneResult } from '@/lib/mock-fortune'

const TRAIT_ICONS = [Focus, Compass, Sparkle]

type Props = {
  result: FortuneResult
  birthDate: string
  birthTime: string
  unknownTime: boolean
  onShare: () => void
  onCopy: () => void
}

export function ResultSection({
  result,
  birthDate,
  birthTime,
  unknownTime,
  onShare,
  onCopy,
}: Props) {
  const birthLine = [
    formatKoreanDate(birthDate),
    unknownTime ? '태어난 시간 모름' : `${formatKoreanTime(birthTime)}`,
  ].join(' · ')

  return (
    <div className="mt-6 flex flex-col gap-5 sm:gap-6">
      {/* 결과 Hero 카드 */}
      <section
        aria-labelledby="result-type"
        className="animate-rise-in relative overflow-hidden rounded-3xl px-6 py-9 text-center shadow-[0_26px_60px_-28px_oklch(0.3_0.1_292/0.6)] sm:px-10 sm:py-11"
        style={{
          background:
            'radial-gradient(120% 90% at 50% -10%, oklch(0.46 0.15 292) 0%, oklch(0.3 0.1 288) 55%, oklch(0.24 0.07 285) 100%)',
        }}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {[
            { top: '14%', left: '12%', size: 3, delay: '0s' },
            { top: '22%', left: '84%', size: 2, delay: '0.8s' },
            { top: '68%', left: '8%', size: 2, delay: '1.4s' },
            { top: '78%', left: '88%', size: 3, delay: '0.4s' },
            { top: '40%', left: '94%', size: 2, delay: '2s' },
          ].map((star, i) => (
            <span
              key={i}
              className="animate-twinkle absolute rounded-full bg-white"
              style={{
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                animationDelay: star.delay,
              }}
            />
          ))}
        </div>

        <p className="relative text-[11px] font-medium tracking-[0.2em] text-white/55 uppercase">
          오늘의 사주
        </p>
        <p className="relative mt-2 text-xs text-white/60">{birthLine}</p>

        <div className="relative mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
            <span aria-hidden>{result.zodiacAnimal.emoji}</span> {result.zodiacAnimal.label}
          </span>
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
            <span aria-hidden>{result.starSign.emoji}</span> {result.starSign.label}
          </span>
          {unknownTime && (
            <span className="rounded-full border border-amber-300/30 bg-amber-400/15 px-3 py-1 text-xs font-medium text-amber-200">
              ⚡ 태어난 시간 없이 간략 분석
            </span>
          )}
        </div>

        <h2
          id="result-type"
          className="relative mt-5 font-serif text-4xl leading-tight font-bold tracking-tight text-white text-balance sm:text-5xl"
        >
          {result.typeName}
        </h2>
        <p className="relative mx-auto mt-4 max-w-md text-sm leading-relaxed text-pretty text-white/70 sm:text-base">
          {result.typeDescription}
        </p>
      </section>

      {/* 핵심 성향 */}
      <section
        aria-labelledby="traits-title"
        className="animate-rise-in"
        style={{ animationDelay: '80ms' }}
      >
        <h2 id="traits-title" className="px-1 text-lg font-bold tracking-tight sm:text-xl">
          나의 핵심 성향
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {result.traits.map((trait, i) => {
            const Icon = TRAIT_ICONS[i % TRAIT_ICONS.length]
            return (
              <li
                key={trait.title}
                className="border-border/80 bg-card/85 flex flex-col gap-2 rounded-2xl border p-5 shadow-[0_14px_36px_-30px_oklch(0.4_0.12_292/0.6)]"
              >
                <span className="bg-accent/70 text-accent-foreground flex size-9 items-center justify-center rounded-xl">
                  <Icon className="size-4.5" aria-hidden />
                </span>
                <p className="text-base font-bold tracking-tight">{trait.title}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {trait.description}
                </p>
              </li>
            )
          })}
        </ul>
      </section>

      {/* 상세 성향 */}
      <section
        aria-labelledby="details-title"
        className="animate-rise-in"
        style={{ animationDelay: '140ms' }}
      >
        <h2 id="details-title" className="sr-only">
          상세 성향
        </h2>
        <ul className="flex flex-col gap-3">
          {result.details.map((detail) => (
            <li
              key={detail.title}
              className="border-border/80 bg-card/85 flex items-start gap-4 rounded-2xl border p-5 shadow-[0_14px_36px_-30px_oklch(0.4_0.12_292/0.6)]"
            >
              <span
                aria-hidden
                className="bg-accent/60 flex size-10 shrink-0 items-center justify-center rounded-xl text-lg"
              >
                {detail.emoji}
              </span>
              <div className="flex-1">
                <p className="text-base font-bold tracking-tight">{detail.title}</p>
                <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed text-pretty">
                  {detail.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 한 줄 총평 */}
      <section
        aria-labelledby="oneliner-title"
        className="border-primary/20 bg-accent/45 animate-rise-in rounded-3xl border p-6 sm:p-8"
        style={{ animationDelay: '200ms' }}
      >
        <h2
          id="oneliner-title"
          className="text-accent-foreground text-xs font-bold tracking-[0.15em]"
        >
          한 줄 총평
        </h2>
        <blockquote className="mt-3 font-serif text-xl leading-relaxed font-bold tracking-tight text-balance sm:text-2xl">
          “{result.oneLiner}”
        </blockquote>
      </section>

      {/* 오늘의 운세 */}
      <div className="animate-rise-in" style={{ animationDelay: '260ms' }}>
        <TodayFortuneCard today={result.today} />
      </div>

      {/* 공유 */}
      <div className="animate-rise-in" style={{ animationDelay: '320ms' }}>
        <ShareCard onShare={onShare} onCopy={onCopy} />
      </div>
    </div>
  )
}
