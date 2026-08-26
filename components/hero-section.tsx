import { Sparkles } from 'lucide-react'

export function HeroSection() {
  return (
    <header className="pt-10 pb-8 text-center sm:pt-14 sm:pb-10">
      <span className="border-border/70 bg-card/70 text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs tracking-tight">
        <Sparkles className="text-primary size-3.5" aria-hidden />
        AI 성향 · 운세 분석
      </span>

      <h1 className="mt-5 flex items-center justify-center gap-2 text-3xl font-bold tracking-tight sm:text-4xl">
        <span aria-hidden>🔮</span>
        <span className="font-serif">오늘의 사주</span>
      </h1>

      <p className="mt-4 text-pretty text-xl leading-relaxed font-medium sm:text-2xl">
        생년정보로 알아보는
        <br className="sm:hidden" /> 나의 성향과 오늘의 운세
      </p>

      <p className="text-muted-foreground mx-auto mt-3 max-w-sm text-pretty text-sm leading-relaxed sm:text-base">
        띠 · 별자리 · 사주를 AI가 한 번에 분석해드려요.
      </p>
    </header>
  )
}
