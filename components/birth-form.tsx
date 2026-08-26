'use client'

import { AlertCircle, CalendarDays, Check, Clock, RotateCcw, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatKoreanDate, formatKoreanTime } from '@/lib/mock-fortune'

export type FormErrors = { birthDate?: string; birthTime?: string }

type Props = {
  birthDate: string
  birthTime: string
  unknownTime: boolean
  errors: FormErrors
  isLoading: boolean
  isDone: boolean
  analysisFailed: boolean
  onBirthDateChange: (value: string) => void
  onBirthTimeChange: (value: string) => void
  onUnknownTimeChange: (value: boolean) => void
  onSubmit: () => void
}

export function BirthForm({
  birthDate,
  birthTime,
  unknownTime,
  errors,
  isLoading,
  isDone,
  analysisFailed,
  onBirthDateChange,
  onBirthTimeChange,
  onUnknownTimeChange,
  onSubmit,
}: Props) {
  const fieldBase =
    'relative flex h-14 w-full items-center justify-between gap-3 rounded-xl border bg-card px-4 text-foreground transition-all duration-200 focus-within:border-primary focus-within:ring-4 focus-within:ring-ring/25'

  const hiddenInput =
    'absolute inset-0 h-full w-full cursor-pointer rounded-xl opacity-0 outline-none [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer'

  return (
    <section aria-labelledby="birth-info-title">
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <div className="border-border/80 bg-card/85 rounded-3xl border p-5 shadow-[0_18px_50px_-28px_oklch(0.4_0.12_292/0.45)] backdrop-blur-[2px] sm:p-7">
          <h2 id="birth-info-title" className="text-lg font-bold tracking-tight sm:text-xl">
            나의 생년정보
          </h2>
          <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
            생년월일과 태어난 시간을 선택해주세요.
          </p>

          <div className="mt-6 flex flex-col gap-5">
            {/* 생년월일 */}
            <div className="flex flex-col gap-2">
              <label htmlFor="birth-date" className="text-sm font-medium">
                생년월일
              </label>
              <div
                className={cn(
                  fieldBase,
                  errors.birthDate
                    ? 'border-destructive/60 bg-destructive/5 ring-destructive/20 ring-4'
                    : 'border-input hover:border-primary/45',
                )}
              >
                <input
                  id="birth-date"
                  type="date"
                  value={birthDate}
                  max={new Date().toISOString().split('T')[0]}
                  min="1900-01-01"
                  aria-invalid={Boolean(errors.birthDate)}
                  aria-describedby={errors.birthDate ? 'birth-date-error' : 'birth-date-hint'}
                  onChange={(event) => onBirthDateChange(event.target.value)}
                  className={hiddenInput}
                />
                <span
                  className={cn(
                    'text-base',
                    birthDate ? 'font-medium' : 'text-muted-foreground',
                  )}
                >
                  {birthDate ? formatKoreanDate(birthDate) : '생년월일을 선택해주세요'}
                </span>
                <CalendarDays
                  aria-hidden
                  className={cn(
                    'size-5',
                    birthDate ? 'text-primary' : 'text-muted-foreground',
                  )}
                />
              </div>
              {errors.birthDate ? (
                <p
                  id="birth-date-error"
                  role="alert"
                  className="text-destructive flex items-center gap-1.5 text-xs font-medium"
                >
                  <AlertCircle className="size-3.5 shrink-0" aria-hidden />
                  {errors.birthDate}
                </p>
              ) : (
                <p id="birth-date-hint" className="text-muted-foreground text-xs">
                  달력에서 생년월일을 선택해주세요
                </p>
              )}
            </div>

            {/* 태어난 시간 */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="birth-time"
                className={cn('text-sm font-medium', unknownTime && 'text-muted-foreground')}
              >
                태어난 시간
              </label>
              <div
                className={cn(
                  fieldBase,
                  unknownTime && 'bg-muted/70 border-border/70 cursor-not-allowed',
                  errors.birthTime
                    ? 'border-destructive/60 bg-destructive/5 ring-destructive/20 ring-4'
                    : !unknownTime && 'border-input hover:border-primary/45',
                )}
              >
                <input
                  id="birth-time"
                  type="time"
                  value={unknownTime ? '' : birthTime}
                  disabled={unknownTime}
                  aria-invalid={Boolean(errors.birthTime)}
                  aria-describedby={errors.birthTime ? 'birth-time-error' : 'birth-time-hint'}
                  onChange={(event) => onBirthTimeChange(event.target.value)}
                  className={cn(hiddenInput, unknownTime && 'pointer-events-none cursor-not-allowed')}
                />
                <span
                  className={cn(
                    'text-base',
                    unknownTime
                      ? 'text-muted-foreground/60 line-through'
                      : birthTime
                        ? 'font-medium'
                        : 'text-muted-foreground',
                  )}
                >
                  {unknownTime
                    ? '태어난 시간 모름'
                    : birthTime
                      ? formatKoreanTime(birthTime)
                      : '태어난 시간을 선택해주세요'}
                </span>
                <Clock
                  aria-hidden
                  className={cn(
                    'size-5',
                    unknownTime
                      ? 'text-muted-foreground/40'
                      : birthTime
                        ? 'text-primary'
                        : 'text-muted-foreground',
                  )}
                />
              </div>

              {errors.birthTime ? (
                <p
                  id="birth-time-error"
                  role="alert"
                  className="text-destructive flex items-start gap-1.5 text-xs font-medium"
                >
                  <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                  {errors.birthTime}
                </p>
              ) : (
                <p id="birth-time-hint" className="text-muted-foreground text-xs">
                  {unknownTime
                    ? '시간 없이 띠와 별자리 중심으로 간략 분석해요'
                    : '태어난 시간을 알면 더 정확하게 분석할 수 있어요'}
                </p>
              )}

              <label
                className={cn(
                  'mt-1 flex w-full cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors duration-200 select-none',
                  unknownTime
                    ? 'border-primary/45 bg-accent/60'
                    : 'border-border/70 bg-background/60 hover:border-primary/35',
                )}
              >
                <span
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-[6px] border transition-colors duration-200',
                    unknownTime
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-input bg-card',
                  )}
                  aria-hidden
                >
                  {unknownTime && <Check className="size-3.5" strokeWidth={3} />}
                </span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={unknownTime}
                  onChange={(event) => onUnknownTimeChange(event.target.checked)}
                />
                <span className="text-sm font-medium">태어난 시간 모름</span>
              </label>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            'bg-primary text-primary-foreground mt-5 flex h-16 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold tracking-tight',
            'shadow-[0_16px_38px_-16px_oklch(0.6_0.155_295/0.65)] transition-all duration-200',
            'hover:bg-primary/90 hover:shadow-[0_20px_44px_-16px_oklch(0.6_0.155_295/0.7)]',
            'active:translate-y-px active:shadow-[0_8px_22px_-14px_oklch(0.6_0.155_295/0.7)]',
            'focus-visible:ring-ring/40 focus-visible:ring-4 focus-visible:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none',
            'sm:h-[68px] sm:text-lg',
          )}
        >
          {isLoading ? (
            <>
              <Sparkles className="size-5 animate-spin" aria-hidden />
              분석 중...
            </>
          ) : isDone ? (
            <>
              <RotateCcw className="size-5" aria-hidden />
              다시 분석하기
            </>
          ) : (
            <>
              <span aria-hidden>✨</span>내 운세 분석하기
            </>
          )}
        </button>

        <p aria-live="polite" className="sr-only">
          {isLoading ? '운세를 분석하고 있습니다.' : ''}
        </p>

        {analysisFailed && (
          <div
            role="alert"
            className="border-destructive/35 bg-destructive/8 animate-rise-in mt-4 flex items-start gap-3 rounded-2xl border p-4"
          >
            <AlertCircle className="text-destructive mt-0.5 size-5 shrink-0" aria-hidden />
            <div className="flex-1">
              <p className="text-sm font-bold">분석에 실패했습니다. 다시 시도해주세요.</p>
              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                입력한 생년정보는 그대로 유지되어 있어요.
              </p>
            </div>
            <button
              type="submit"
              className="border-destructive/40 text-destructive hover:bg-destructive/10 focus-visible:ring-destructive/30 h-9 shrink-0 rounded-full border px-3.5 text-xs font-bold transition-colors focus-visible:ring-4 focus-visible:outline-none"
            >
              재시도
            </button>
          </div>
        )}
      </form>
    </section>
  )
}
