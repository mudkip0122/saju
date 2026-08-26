'use client'

import { Link2, Share2 } from 'lucide-react'

type Props = {
  onShare: () => void
  onCopy: () => void
}

export function ShareCard({ onShare, onCopy }: Props) {
  return (
    <section
      aria-labelledby="share-title"
      className="border-border/80 bg-card/85 rounded-3xl border p-6 text-center shadow-[0_18px_50px_-32px_oklch(0.4_0.12_292/0.45)] sm:p-7"
    >
      <h2 id="share-title" className="text-base font-bold tracking-tight">
        결과가 마음에 드셨나요?
      </h2>
      <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
        친구에게 내 성향 카드를 보내보세요.
      </p>

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onShare}
          className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring/40 flex h-14 items-center justify-center gap-2 rounded-2xl px-6 text-base font-bold tracking-tight shadow-[0_14px_34px_-16px_oklch(0.6_0.155_295/0.6)] transition-all duration-200 active:translate-y-px focus-visible:ring-4 focus-visible:outline-none sm:min-w-52"
        >
          <Share2 className="size-5" aria-hidden />
          결과 공유하기
        </button>
        <button
          type="button"
          onClick={onCopy}
          className="border-input text-secondary-foreground hover:border-primary/45 hover:bg-accent/50 focus-visible:ring-ring/30 flex h-14 items-center justify-center gap-2 rounded-2xl border px-6 text-sm font-bold transition-colors duration-200 focus-visible:ring-4 focus-visible:outline-none"
        >
          <Link2 className="size-4" aria-hidden />
          링크 복사
        </button>
      </div>
    </section>
  )
}
