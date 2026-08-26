'use client'

import { useMemo, useRef, useState } from 'react'
import { AnalyzingCard } from '@/components/analyzing-card'
import { BirthForm, type FormErrors } from '@/components/birth-form'
import { HeroSection } from '@/components/hero-section'
import { ResultSection } from '@/components/result-section'
import { Starfield } from '@/components/starfield'
import { StatePreview } from '@/components/state-preview'
import { ToastView, type ToastState } from '@/components/toast-view'
import { MOCK_INPUT, MOCK_RESULT, type FortuneResult } from '@/lib/mock-fortune'
import { analyzeBirthInfo } from '@/lib/saju-calculator'

type Status = 'idle' | 'loading' | 'done' | 'failed'

export default function Page() {
  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [unknownTime, setUnknownTime] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<FortuneResult | null>(null)
  const [toast, setToast] = useState<ToastState>(null)
  const [simulateFailure, setSimulateFailure] = useState(false)
  const [simulateShareFailure, setSimulateShareFailure] = useState(false)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  function showToast(tone: 'success' | 'error', message: string) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToast({ id: Date.now(), tone, message })
    toastTimerRef.current = setTimeout(() => setToast(null), 3200)
  }

  // E-01 ~ E-05 엄격한 유효성 검증
  function validate(): FormErrors {
    const next: FormErrors = {}

    // 1. 생년월일 검증
    if (!birthDate) {
      next.birthDate = '생년월일을 선택해주세요.' // E-01
    } else {
      const parts = birthDate.split('-')
      if (parts.length !== 3) {
        next.birthDate = '올바른 생년월일을 선택해주세요.' // E-04
      } else {
        const y = parseInt(parts[0], 10)
        const m = parseInt(parts[1], 10)
        const d = parseInt(parts[2], 10)

        const testDate = new Date(y, m - 1, d)
        if (
          testDate.getFullYear() !== y ||
          testDate.getMonth() + 1 !== m ||
          testDate.getDate() !== d
        ) {
          next.birthDate = '올바른 생년월일을 선택해주세요.' // E-04 (2월 30일 등)
        } else {
          const todayStr = new Date().toISOString().split('T')[0]
          if (birthDate > todayStr) {
            next.birthDate = '생년월일은 오늘보다 이전 날짜로 선택해주세요.' // E-03
          }
        }
      }
    }

    // 2. 태어난 시간 검증
    if (!unknownTime) {
      if (!birthTime) {
        next.birthTime = "태어난 시간을 선택하거나 '태어난 시간 모름'을 선택해주세요." // E-02
      } else {
        const [hStr, mStr] = birthTime.split(':')
        const h = parseInt(hStr, 10)
        const min = parseInt(mStr, 10)
        if (isNaN(h) || isNaN(min) || h < 0 || h > 23 || min < 0 || min > 59) {
          next.birthTime = '올바른 태어난 시간을 선택해주세요.' // E-05
        }
      }
    }

    return next
  }

  // E-14: 입력값 변경 시 기존 결과 무효화 및 초기화
  function invalidatePreviousResult() {
    if (status === 'done' || status === 'failed') {
      setStatus('idle')
      setResult(null)
    }
  }

  function handleBirthDateChange(value: string) {
    setBirthDate(value)
    setErrors((prev) => ({ ...prev, birthDate: undefined }))
    invalidatePreviousResult()
  }

  // E-06: 시간 직접 입력 시 '시간 모름' 자동 해제
  function handleBirthTimeChange(value: string) {
    setBirthTime(value)
    setUnknownTime(false)
    setErrors((prev) => ({ ...prev, birthTime: undefined }))
    invalidatePreviousResult()
  }

  // E-06: '시간 모름' 체크 시 시간 입력값 초기화 및 비활성화
  function handleUnknownTimeChange(value: boolean) {
    setUnknownTime(value)
    if (value) {
      setBirthTime('')
    }
    setErrors((prev) => ({ ...prev, birthTime: undefined }))
    invalidatePreviousResult()
  }

  function handleSubmit() {
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setStatus('idle')
      return
    }

    if (timerRef.current) clearTimeout(timerRef.current)
    setStatus('loading')

    // Task 1.1 사주 계산 엔진 연동
    const calculated = analyzeBirthInfo(birthDate, birthTime, unknownTime)

    timerRef.current = setTimeout(() => {
      if (simulateFailure) {
        setStatus('failed')
        return
      }

      // 띠와 별자리 동적 주입
      const dynamicResult: FortuneResult = {
        ...MOCK_RESULT,
        zodiacAnimal: {
          emoji: calculated.zodiacAnimal.emoji,
          label: calculated.zodiacAnimal.label,
        },
        starSign: {
          emoji: calculated.starSign.emoji,
          label: calculated.starSign.label,
        },
      }

      setResult(dynamicResult)
      setStatus('done')
      requestAnimationFrame(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }, 1200)
  }

  async function handleShare() {
    const shareText = `[오늘의 사주] 나는 "${result?.typeName || MOCK_RESULT.typeName}" — 오늘의 운세 ${result?.today.score || MOCK_RESULT.today.score}/${result?.today.max || MOCK_RESULT.today.max}`
    if (simulateShareFailure) {
      showToast('error', '공유 링크를 만들지 못했습니다. 다시 시도해주세요.')
      return
    }
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title: '오늘의 사주', text: shareText })
        return
      }
      await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`)
      showToast('success', '공유 링크가 복사되었습니다.')
    } catch {
      showToast('error', '공유 링크를 만들지 못했습니다. 다시 시도해주세요.')
    }
  }

  async function handleCopy() {
    if (simulateShareFailure) {
      showToast('error', '공유 링크를 만들지 못했습니다. 다시 시도해주세요.')
      return
    }
    try {
      await navigator.clipboard.writeText(window.location.href)
      showToast('success', '공유 링크가 복사되었습니다.')
    } catch {
      showToast('error', '공유 링크를 만들지 못했습니다. 다시 시도해주세요.')
    }
  }

  function fillMockInput() {
    setBirthDate(MOCK_INPUT.birthDate)
    setBirthTime(MOCK_INPUT.birthTime)
    setUnknownTime(false)
    setErrors({})
    invalidatePreviousResult()
  }

  function reset() {
    if (timerRef.current) clearTimeout(timerRef.current)
    setBirthDate('')
    setBirthTime('')
    setUnknownTime(false)
    setErrors({})
    setStatus('idle')
    setResult(null)
    setToast(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="aurora-bg relative min-h-screen">
      <Starfield />

      <div className="relative mx-auto w-full max-w-[46rem] px-5 pb-24 sm:px-6">
        <HeroSection />

        <BirthForm
          birthDate={birthDate}
          birthTime={birthTime}
          unknownTime={unknownTime}
          errors={errors}
          isLoading={status === 'loading'}
          isDone={status === 'done'}
          analysisFailed={status === 'failed'}
          onBirthDateChange={handleBirthDateChange}
          onBirthTimeChange={handleBirthTimeChange}
          onUnknownTimeChange={handleUnknownTimeChange}
          onSubmit={handleSubmit}
        />

        {status === 'loading' && <AnalyzingCard />}

        <div ref={resultRef} className="scroll-mt-6">
          {status === 'done' && result && (
            <ResultSection
              result={result}
              birthDate={birthDate}
              birthTime={birthTime}
              unknownTime={unknownTime}
              onShare={handleShare}
              onCopy={handleCopy}
            />
          )}
        </div>

        <StatePreview
          simulateFailure={simulateFailure}
          simulateShareFailure={simulateShareFailure}
          onToggleFailure={setSimulateFailure}
          onToggleShareFailure={setSimulateShareFailure}
          onFillMockInput={fillMockInput}
          onUnknownTime={() => {
            handleUnknownTimeChange(true)
            setErrors({})
          }}
          onReset={reset}
        />
      </div>

      <ToastView toast={toast} onClose={() => setToast(null)} />
    </main>
  )
}
