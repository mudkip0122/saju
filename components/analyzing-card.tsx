const SPARKS = [
  { left: '18%', top: '30%', delay: '0s' },
  { left: '38%', top: '62%', delay: '0.35s' },
  { left: '52%', top: '22%', delay: '0.7s' },
  { left: '68%', top: '55%', delay: '1.05s' },
  { left: '84%', top: '34%', delay: '1.4s' },
]

export function AnalyzingCard() {
  return (
    <section
      aria-live="polite"
      className="border-border/80 bg-card/85 animate-rise-in mt-5 rounded-3xl border p-7 text-center shadow-[0_18px_50px_-30px_oklch(0.4_0.12_292/0.45)] sm:p-9"
    >
      <div className="relative mx-auto h-16 w-44">
        {SPARKS.map((spark, i) => (
          <span
            key={i}
            className="animate-twinkle bg-primary absolute size-2 rounded-full"
            style={{ left: spark.left, top: spark.top, animationDelay: spark.delay }}
            aria-hidden
          />
        ))}
        <span
          aria-hidden
          className="animate-twinkle absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl"
          style={{ animationDuration: '2.2s' }}
        >
          ✨
        </span>
      </div>

      <p className="mt-2 text-lg font-bold tracking-tight">당신의 운세를 분석하고 있어요...</p>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
        띠 · 별자리 · 사주를 종합하고 있습니다.
      </p>

      <div className="bg-muted mt-6 h-1.5 w-full overflow-hidden rounded-full">
        <div className="via-primary animate-sweep h-full w-1/3 rounded-full bg-gradient-to-r from-transparent to-transparent" />
      </div>
    </section>
  )
}
