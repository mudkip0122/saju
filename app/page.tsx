'use client'

import { useRef, useState } from 'react'
import { AnalyzingCard } from '@/components/analyzing-card'
import { BirthForm, type FormErrors } from '@/components/birth-form'
import { HeroSection } from '@/components/hero-section'
import { ResultSection } from '@/components/result-section'
import { Starfield } from '@/components/starfield'
import { StatePreview } from '@/components/state-preview'
import { ToastView, type ToastState } from '@/components/toast-view'
import { MOCK_INPUT, MOCK_RESULT } from '@/lib/mock-fortune'

type Status = 'idle' | 'loading' | 'done' | 'failed'

export default function Page() {
  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [unknownTime, setUnknownTime] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<Status>('idle')
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

  function validate(): FormErrors {
    const next: FormErrors = {}
    if (!birthDate) next.birthDate = '생년월일을 선택해주세요.'
    if (!unknownTime && !birthTime) {
      next.birthTime = "태어난 시간을 선택하거나 '태어난 시간을 몰라요'를 선택해주세요."
    }
    return next
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
    timerRef.current = setTimeout(() => {
      if (simulateFailure) {
        setStatus('failed')
        return
      }
      setStatus('done')
      requestAnimationFrame(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }, 2200)
  }

  async function handleShare() {
    const shareText = `[오늘의 사주] 나는 "${MOCK_RESULT.typeName}" — 오늘의 운세 ${MOCK_RESULT.today.score}/${MOCK_RESULT.today.max}`
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
  }

  function reset() {
    if (timerRef.current) clearTimeout(timerRef.current)
    setBirthDate('')
    setBirthTime('')
    setUnknownTime(false)
    setErrors({})
    setStatus('idle')
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
          onBirthDateChange={(value) => {
            setBirthDate(value)
            setErrors((prev) => ({ ...prev, birthDate: undefined }))
          }}
          onBirthTimeChange={(value) => {
            setBirthTime(value)
            setErrors((prev) => ({ ...prev, birthTime: undefined }))
          }}
          onUnknownTimeChange={(value) => {
            setUnknownTime(value)
            setErrors((prev) => ({ ...prev, birthTime: undefined }))
          }}
          onSubmit={handleSubmit}
        />

        {status === 'loading' && <AnalyzingCard />}

        <div ref={resultRef} className="scroll-mt-6">
          {status === 'done' && (
            <ResultSection
              result={MOCK_RESULT}
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
            setUnknownTime(true)
            setBirthTime('')
            setErrors({})
          }}
          onReset={reset}
        />
      </div>

      <ToastView toast={toast} onClose={() => setToast(null)} />
    </main>
  )
}
