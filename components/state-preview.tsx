'use client'

import { cn } from '@/lib/utils'

type Props = {
  simulateFailure: boolean
  simulateTimeout: boolean
  simulateShareFailure: boolean
  onToggleFailure: (value: boolean) => void
  onToggleTimeout: (value: boolean) => void
  onToggleShareFailure: (value: boolean) => void
  onFillMockInput: () => void
  onUnknownTime: () => void
  onReset: () => void
}

export function StatePreview({
  simulateFailure,
  simulateTimeout,
  simulateShareFailure,
  onToggleFailure,
  onToggleTimeout,
  onToggleShareFailure,
  onFillMockInput,
  onUnknownTime,
  onReset,
}: Props) {
  const chip =
    'h-9 rounded-full border px-3.5 text-xs font-medium transition-colors duration-200 focus-visible:ring-4 focus-visible:ring-ring/25 focus-visible:outline-none'

  return (
    <section
      aria-labelledby="preview-title"
      className="border-border/70 bg-card/55 mt-10 rounded-2xl border border-dashed p-5"
    >
      <h2 id="preview-title" className="text-muted-foreground text-xs font-bold tracking-tight">
        프로토타입 상태 미리보기
      </h2>
      <p className="text-muted-foreground/80 mt-1 text-xs leading-relaxed">
        목업 데이터로 각 UI 상태를 확인할 수 있어요.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onFillMockInput}
          className={cn(chip, 'border-input hover:border-primary/45 hover:bg-accent/50')}
        >
          목업 생년정보 채우기
        </button>
        <button
          type="button"
          onClick={onUnknownTime}
          className={cn(chip, 'border-input hover:border-primary/45 hover:bg-accent/50')}
        >
          시간 모름 상태
        </button>
        <button
          type="button"
          onClick={onReset}
          className={cn(chip, 'border-input hover:border-primary/45 hover:bg-accent/50')}
        >
          초기 상태로
        </button>
        <button
          type="button"
          aria-pressed={simulateFailure}
          onClick={() => onToggleFailure(!simulateFailure)}
          className={cn(
            chip,
            simulateFailure
              ? 'border-destructive/45 bg-destructive/10 text-destructive'
              : 'border-input hover:border-primary/45 hover:bg-accent/50',
          )}
        >
          분석 실패 {simulateFailure ? 'ON' : 'OFF'}
        </button>
        <button
          type="button"
          aria-pressed={simulateTimeout}
          onClick={() => onToggleTimeout(!simulateTimeout)}
          className={cn(
            chip,
            simulateTimeout
              ? 'border-amber-500/45 bg-amber-500/10 text-amber-600 dark:text-amber-400'
              : 'border-input hover:border-primary/45 hover:bg-accent/50',
          )}
        >
          10초 타임아웃 {simulateTimeout ? 'ON' : 'OFF'}
        </button>
        <button
          type="button"
          aria-pressed={simulateShareFailure}
          onClick={() => onToggleShareFailure(!simulateShareFailure)}
          className={cn(
            chip,
            simulateShareFailure
              ? 'border-destructive/45 bg-destructive/10 text-destructive'
              : 'border-input hover:border-primary/45 hover:bg-accent/50',
          )}
        >
          공유 실패 {simulateShareFailure ? 'ON' : 'OFF'}
        </button>
      </div>
    </section>
  )
}
