'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnalyzingCard } from '@/components/analyzing-card'
import { BirthForm, type FormErrors } from '@/components/birth-form'
import { LandingFooter, LandingHero, HowItWorks, ResultPreview, TrustAndFaq } from '@/components/landing-sections'
import { LandingNav } from '@/components/landing-nav'
import { ResultSection } from '@/components/result-section'
import { Starfield } from '@/components/starfield'
import { StatePreview } from '@/components/state-preview'
import { ToastView, type ToastState } from '@/components/toast-view'
import { MOCK_INPUT, MOCK_RESULT, type FortuneResult } from '@/lib/mock-fortune'
import {
  buildShareUrl,
  decodeSharePayload,
  encodeSharePayload,
  formatShareText,
} from '@/lib/share-codec'

type Status = 'idle' | 'loading' | 'done' | 'failed'

export default function Page() {
  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [unknownTime, setUnknownTime] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [result, setResult] = useState<FortuneResult | null>(null)
  const [toast, setToast] = useState<ToastState>(null)
  const [simulateFailure, setSimulateFailure] = useState(false)
  const [simulateTimeout, setSimulateTimeout] = useState(false)
  const [simulateShareFailure, setSimulateShareFailure] = useState(false)

  const abortControllerRef = useRef<AbortController | null>(null)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const shareFailureCountRef = useRef(0)
  const resultRef = useRef<HTMLDivElement>(null)

  function showToast(tone: 'success' | 'error', message: string) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToast({ id: Date.now(), tone, message })
    toastTimerRef.current = setTimeout(() => setToast(null), 3200)
  }

  // 공유 URL 파라미터(?res=...) 감지 및 결과 자동 복원 (Hydration)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const searchParams = new URLSearchParams(window.location.search)
    const resParam = searchParams.get('res')
    if (resParam) {
      const hydrated = decodeSharePayload(resParam)
      if (hydrated) {
        setBirthDate(hydrated.birthDate)
        setBirthTime(hydrated.birthTime)
        setUnknownTime(hydrated.unknownTime)
        setResult(hydrated.result)
        setStatus('done')
        requestAnimationFrame(() => {
          resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      }
    }
  }, [])

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    }
  }, [])

  // E-10: 오프라인 이벤트 감지
  useEffect(() => {
    function handleOffline() {
      showToast('error', '인터넷 연결을 확인한 후 다시 시도해주세요.')
    }
    function handleOnline() {
      showToast('success', '인터넷에 다시 연결되었습니다.')
    }
    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)
    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

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
      setErrorMessage('')
      setResult(null)
      // 브라우저 주소창의 공유 쿼리 파라미터도 정리
      if (typeof window !== 'undefined' && window.location.search) {
        window.history.replaceState({}, '', window.location.pathname)
      }
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

  async function handleSubmit() {
    // E-07: 분석 진행 중 중복 클릭 및 요청 차단
    if (status === 'loading') return

    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setStatus('idle')
      requestAnimationFrame(() => {
        const firstInvalidField = document.querySelector<HTMLElement>('[aria-invalid="true"]')
        firstInvalidField?.focus()
      })
      return
    }

    // E-10: 오프라인 상태 사전 체크
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      const msg = '인터넷 연결을 확인한 후 다시 시도해주세요.'
      setErrorMessage(msg)
      showToast('error', msg)
      setStatus('failed')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const controller = new AbortController()
    abortControllerRef.current = controller

    // E-08: 10초 클라이언트 타임아웃 제한
    const timeoutId = setTimeout(() => {
      controller.abort()
    }, 10000)

    try {
      if (simulateTimeout) {
        // 10.5초 대기 후 타임아웃 시뮬레이션
        await new Promise((_, reject) => {
          setTimeout(() => {
            const err = new Error('The user aborted a request.')
            err.name = 'AbortError'
            reject(err)
          }, 10200)
        })
      }

      if (simulateFailure) {
        // 즉시 실패 시뮬레이션
        await new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Simulated failure')), 1000)
        })
      }

      const response = await fetch('/api/fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate,
          birthTime: unknownTime ? undefined : birthTime,
          unknownTime,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMsg =
          response.status === 504
            ? '분석 시간이 길어지고 있어요. 잠시 후 다시 시도해주세요.' // E-08
            : errorData.error || '분석에 실패했습니다. 다시 시도해주세요.' // E-09
        throw new Error(errorMsg)
      }

      const data: FortuneResult = await response.json()
      shareFailureCountRef.current = 0
      setResult(data)
      setStatus('done')
      requestAnimationFrame(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    } catch (err: any) {
      clearTimeout(timeoutId)
      let msg = '분석에 실패했습니다. 다시 시도해주세요.' // E-09

      if (err.name === 'AbortError') {
        msg = '분석 시간이 길어지고 있어요. 잠시 후 다시 시도해주세요.' // E-08
      } else if (typeof navigator !== 'undefined' && !navigator.onLine) {
        msg = '인터넷 연결을 확인한 후 다시 시도해주세요.' // E-10
      } else if (err.message) {
        msg = err.message
      }

      setErrorMessage(msg)
      setStatus('failed')
      showToast('error', msg)
    } finally {
      abortControllerRef.current = null
    }
  }

  // F-02, E-16, E-17: 3단계 Fallback 공유 시스템
  async function handleShareLinkFailure() {
    shareFailureCountRef.current += 1
    if (shareFailureCountRef.current === 1) {
      showToast('error', '공유 링크를 만들지 못했습니다. 다시 시도해주세요.')
      return
    }

    if (!result) return
    try {
      const textSummary = formatShareText(result, { birthDate, birthTime, unknownTime })
      await navigator.clipboard.writeText(textSummary)
      showToast('error', '공유 링크를 만들 수 없습니다. 결과를 복사해서 공유해주세요.')
    } catch {
      showToast('error', '결과를 복사하지 못했습니다. 직접 선택해 복사해주세요.')
    }
  }

  async function handleShare() {
    if (!result) return

    if (simulateShareFailure) {
      await handleShareLinkFailure()
      return
    }

    const payload = encodeSharePayload(result, { birthDate, birthTime, unknownTime })
    if (!payload) {
      await handleShareLinkFailure()
      return
    }

    const shareUrl = buildShareUrl(payload)
    if (!shareUrl) {
      await handleShareLinkFailure()
      return
    }
    const shareTitle = `[오늘의 사주] 나는 "${result.typeName}"`
    const shareText = `[오늘의 사주] 나는 "${result.typeName}" — 오늘의 운세 ${result.today.score}/${result.today.max}\n`

    // 1단계: 모바일 Web Share API
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        })
        shareFailureCountRef.current = 0
        return
      } catch (err: any) {
        // 사용자가 취소한 경우는 무시
        if (err.name === 'AbortError') return
      }
    }

    // 2단계: 클립보드 URL 복사 (E-17)
    try {
      await navigator.clipboard.writeText(shareUrl)
      shareFailureCountRef.current = 0
      showToast('success', '공유 링크가 복사되었습니다.')
    } catch {
      // 3단계: 텍스트 전문 복사 (E-16 2차 Fallback)
      try {
        const textSummary = formatShareText(result, { birthDate, birthTime, unknownTime })
        await navigator.clipboard.writeText(textSummary)
        showToast('error', '공유 링크를 만들 수 없습니다. 결과를 복사해서 공유해주세요.')
      } catch {
        showToast('error', '공유 링크를 만들지 못했습니다. 다시 시도해주세요.')
      }
    }
  }

  // 링크 복사 전용 핸들러
  async function handleCopy() {
    if (!result) return

    if (simulateShareFailure) {
      await handleShareLinkFailure()
      return
    }

    const payload = encodeSharePayload(result, { birthDate, birthTime, unknownTime })
    const shareUrl = payload ? buildShareUrl(payload) : ''
    if (!shareUrl) {
      await handleShareLinkFailure()
      return
    }

    try {
      await navigator.clipboard.writeText(shareUrl)
      shareFailureCountRef.current = 0
      showToast('success', '공유 링크가 복사되었습니다.')
    } catch {
      try {
        const textSummary = formatShareText(result, { birthDate, birthTime, unknownTime })
        await navigator.clipboard.writeText(textSummary)
        showToast('error', '공유 링크를 만들 수 없습니다. 결과를 복사해서 공유해주세요.')
      } catch {
        showToast('error', '공유 링크를 만들지 못했습니다. 다시 시도해주세요.')
      }
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
    if (abortControllerRef.current) abortControllerRef.current.abort()
    setBirthDate('')
    setBirthTime('')
    setUnknownTime(false)
    setErrors({})
    setStatus('idle')
    setErrorMessage('')
    setResult(null)
    setToast(null)
    shareFailureCountRef.current = 0
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main id="top" className="aurora-bg relative min-h-screen">
      <Starfield />

      <div className="relative mx-auto w-full max-w-[72rem] px-4 pb-12 sm:px-6">
        <LandingNav />
        <LandingHero />
        <HowItWorks />
        <ResultPreview />
        <TrustAndFaq />

        <section id="analysis-form" className="mx-auto max-w-[46rem] scroll-mt-24 pt-20 sm:pt-28" aria-labelledby="analysis-title">
          <div className="mb-6 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6b38d4]">Start your reading</p>
            <h2 id="analysis-title" className="mt-3 text-3xl font-bold tracking-[-0.035em] text-[#121c2a] sm:text-4xl">이제, 나의 흐름을 만나보세요.</h2>
            <p className="mt-3 text-sm leading-6 text-[#666d7a]">생년월일을 입력하면 AI가 나만의 운세를 읽어드려요.</p>
          </div>

        <BirthForm
          birthDate={birthDate}
          birthTime={birthTime}
          unknownTime={unknownTime}
          errors={errors}
          isLoading={status === 'loading'}
          isDone={status === 'done'}
          analysisFailed={status === 'failed'}
          errorMessage={errorMessage}
          onBirthDateChange={handleBirthDateChange}
          onBirthTimeChange={handleBirthTimeChange}
          onUnknownTimeChange={handleUnknownTimeChange}
          onSubmit={handleSubmit}
        />
        </section>

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
          simulateTimeout={simulateTimeout}
          simulateShareFailure={simulateShareFailure}
          onToggleFailure={setSimulateFailure}
          onToggleTimeout={setSimulateTimeout}
          onToggleShareFailure={setSimulateShareFailure}
          onFillMockInput={fillMockInput}
          onUnknownTime={() => {
            handleUnknownTimeChange(true)
            setErrors({})
          }}
          onReset={reset}
        />
        <LandingFooter />
      </div>

      <ToastView toast={toast} onClose={() => setToast(null)} />
    </main>
  )
}
