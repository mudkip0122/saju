import { ArrowDown, ArrowRight, BrainCircuit, Check, Clock3, DatabaseZap, Fingerprint, ShieldCheck, Sparkles, Stars } from 'lucide-react'

const steps = [
  { icon: Fingerprint, title: '생년정보 입력', text: '생년월일과 태어난 시간을 알려주세요.' },
  { icon: BrainCircuit, title: 'AI 사주 분석', text: '전통 명리의 관점과 AI의 언어 분석을 결합해요.' },
  { icon: Stars, title: '오늘의 방향 확인', text: '성향, 오늘의 흐름, 작은 실천을 한눈에 만나요.' },
]

const features = [
  { icon: BrainCircuit, title: '개인화된 분석', text: '당신만의 고유한 성향과 내재된 강점을 이해하기 쉬운 언어로 풀어드려요.' },
  { icon: Sparkles, title: '오늘의 운세', text: '오늘의 점수와 키워드, 지금 바로 해볼 수 있는 작은 행동을 제안해요.' },
  { icon: DatabaseZap, title: '간편하고 안전하게', text: '회원가입이나 결제 없이 시작하고, 입력한 생년정보는 서비스 DB에 저장하지 않아요.' },
]

export function LandingHero() {
  return (
    <section className="relative flex min-h-[min(760px,calc(100svh-7rem))] items-center justify-center overflow-hidden rounded-[2rem] border border-white/80 bg-white/55 px-6 py-20 text-center shadow-[0_30px_90px_-48px_rgba(68,37,132,0.5)] backdrop-blur-xl sm:px-12 sm:py-28">
      <div className="celestial-orbit celestial-orbit-one" aria-hidden />
      <div className="celestial-orbit celestial-orbit-two" aria-hidden />
      <div className="pointer-events-none absolute left-[13%] top-[24%] size-2 rounded-full bg-[#8d5bef] shadow-[0_0_22px_5px_rgba(141,91,239,0.35)]" aria-hidden />
      <div className="pointer-events-none absolute bottom-[25%] right-[15%] size-1.5 rounded-full bg-[#6b38d4] shadow-[0_0_18px_4px_rgba(107,56,212,0.3)]" aria-hidden />
      <div className="relative z-10 mx-auto max-w-4xl">
        <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#6b38d4]/15 bg-white/70 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#6b38d4] shadow-sm sm:text-xs"><Sparkles className="size-3.5" aria-hidden />Ancient wisdom · Digital soul</p>
        <h1 className="mx-auto mt-7 max-w-4xl text-balance text-[2.65rem] font-bold leading-[1.12] tracking-[-0.055em] text-[#121c2a] sm:text-6xl lg:text-[4.6rem]">우주의 데이터로 읽는<span className="hero-gradient-text mt-1 block">당신의 운명</span></h1>
        <p className="mx-auto mt-7 max-w-2xl text-pretty text-base leading-8 text-[#5f6571] sm:text-lg">고대 사주의 지혜와 AI의 섬세한 분석으로<br className="hidden sm:block" /> 나만의 성향과 오늘을 위한 방향을 발견해보세요.</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#analysis-form" className="group inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#6b38d4] px-8 text-base font-bold text-white shadow-[0_20px_40px_-17px_rgba(107,56,212,0.85)] transition hover:-translate-y-0.5 hover:bg-[#5926bf] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6b38d4]/25 sm:w-auto">무료로 내 운세 분석하기<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden /></a>
          <a href="#how-it-works" className="inline-flex min-h-12 items-center gap-2 px-5 text-sm font-bold text-[#5f6571] transition hover:text-[#6b38d4] focus-visible:rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6b38d4]/20">분석 방식 보기 <ArrowDown className="size-4" aria-hidden /></a>
        </div>
        <p className="mt-5 text-xs text-[#747987]">회원가입 · 결제 없이 바로 시작할 수 있어요</p>
      </div>
    </section>
  )
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-28 py-20 sm:py-28" aria-labelledby="how-it-works-title">
      <div className="mx-auto max-w-2xl text-center"><p className="eyebrow">Simple, clear, personal</p><h2 id="how-it-works-title" className="section-title">세 단계로 만나는 나의 흐름</h2><p className="section-copy">어려운 명리 용어 대신, 지금의 나를 이해하는 데 필요한 이야기만 전해드려요.</p></div>
      <div className="relative mt-12 grid gap-5 md:grid-cols-3">
        <div className="pointer-events-none absolute left-[16%] right-[16%] top-7 hidden border-t border-dashed border-[#bfa8ee] md:block" aria-hidden />
        {steps.map(({ icon: Icon, title, text }, index) => <article key={title} className="glass-card relative rounded-[1.5rem] p-7"><div className="flex items-center justify-between"><span className="flex size-12 items-center justify-center rounded-2xl bg-[#eee6ff] text-[#6b38d4] ring-1 ring-[#6b38d4]/10"><Icon className="size-5" aria-hidden /></span><span className="text-xs font-bold tracking-[0.12em] text-[#8c72bf]">0{index + 1}</span></div><h3 className="mt-6 text-lg font-bold text-[#121c2a]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#666d7a]">{text}</p></article>)}
      </div>
    </section>
  )
}

export function ResultPreview() {
  return (
    <>
      <section className="grid gap-5 md:grid-cols-3" aria-label="Astra Destiny의 주요 특징">
        {features.map(({ icon: Icon, title, text }) => <article key={title} className="glass-card group rounded-[1.5rem] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#6b38d4]/20 hover:shadow-[0_24px_55px_-34px_rgba(77,37,150,0.5)]"><span className="flex size-12 items-center justify-center rounded-full bg-[#eee6ff] text-[#6b38d4] ring-1 ring-[#6b38d4]/10"><Icon className="size-5" aria-hidden /></span><h2 className="mt-5 text-xl font-bold tracking-tight text-[#121c2a]">{title}</h2><p className="mt-3 text-sm leading-7 text-[#666d7a]">{text}</p></article>)}
      </section>
      <section className="grid items-center gap-10 py-20 sm:py-28 md:grid-cols-[0.88fr_1.12fr]" aria-labelledby="result-preview-title">
        <div><p className="eyebrow text-left">Your personal reading</p><h2 id="result-preview-title" className="section-title text-left">복잡한 해석은 덜고,<br />지금 필요한 이야기에 집중해요.</h2><p className="section-copy mx-0 text-left">성향부터 오늘의 키워드와 작은 실천까지, 결과를 한눈에 읽을 수 있는 카드로 정리해드려요.</p>
          <ul className="mt-7 space-y-3 text-sm font-medium text-[#333946]">{['나만의 성향과 강점 키워드', '오늘의 흐름과 분야별 점수', '바로 실천할 수 있는 한 가지 액션'].map((item) => <li key={item} className="flex items-center gap-3"><span className="flex size-6 items-center justify-center rounded-full bg-[#eee6ff]"><Check className="size-3.5 text-[#6b38d4]" strokeWidth={3} aria-hidden /></span>{item}</li>)}</ul>
          <a href="#analysis-form" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full border border-[#6b38d4]/20 bg-white/70 px-6 text-sm font-bold text-[#6b38d4] transition hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6b38d4]/20">내 결과 만나보기 <ArrowRight className="size-4" aria-hidden /></a>
        </div>
        <div className="relative rounded-[2rem] border border-white/85 bg-white/65 p-4 shadow-[0_30px_75px_-38px_rgba(60,29,125,0.55)] backdrop-blur-xl sm:p-7"><div className="rounded-[1.5rem] border border-[#e3daf6] bg-white/85 p-5 sm:p-7">
          <div className="flex items-center justify-between border-b border-[#ece8f4] pb-5"><span className="flex items-center gap-2 text-xs font-bold text-[#6b38d4]"><Sparkles className="size-4" aria-hidden />오늘의 사주</span><span className="rounded-full bg-[#f1ecfb] px-3 py-1 text-[11px] text-[#74707d]">샘플 결과</span></div>
          <div className="mt-6 flex items-end justify-between gap-4"><div><p className="text-xs text-[#77717f]">당신의 오늘</p><p className="mt-1 font-serif text-2xl font-bold text-[#1d1729] sm:text-3xl">차분한 통찰의 소유자</p></div><div className="text-right"><b className="text-3xl text-[#6b38d4]">86</b><span className="text-xs text-[#77717f]"> / 100</span></div></div>
          <p className="mt-4 text-sm leading-7 text-[#66616e]">천천히 깊어지는 힘이 오늘의 선택을 단단하게 만들어요. 서두르기보다 한 가지 일에 집중해보세요.</p>
          <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[11px] text-[#716b79]"><div className="rounded-2xl bg-[#f3effb] p-3"><b className="mb-1 block text-base text-[#6b38d4]">86</b>종합운</div><div className="rounded-2xl bg-[#f3effb] p-3"><b className="mb-1 block text-base text-[#6b38d4]">기회</b>키워드</div><div className="rounded-2xl bg-[#f3effb] p-3"><b className="mb-1 block text-base text-[#6b38d4]">1가지</b>작은 실천</div></div>
          <div className="mt-3 rounded-2xl bg-gradient-to-r from-[#6b38d4] to-[#895ce7] p-4 text-white"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/70">Today&apos;s action</p><p className="mt-1 text-sm font-bold">미뤄둔 연락 하나를 먼저 건네보세요.</p></div>
        </div></div>
      </section>
    </>
  )
}

export function TrustAndFaq() {
  return (
    <section className="rounded-[2rem] border border-white/75 bg-white/45 px-5 py-14 shadow-[0_24px_65px_-45px_rgba(57,30,110,0.45)] backdrop-blur-lg sm:px-10 sm:py-16" aria-labelledby="trust-title">
      <div className="grid gap-10 md:grid-cols-[0.86fr_1.14fr] md:gap-14">
        <div><span className="flex size-12 items-center justify-center rounded-2xl bg-[#eee6ff] text-[#6b38d4]"><ShieldCheck className="size-6" aria-hidden /></span><h2 id="trust-title" className="mt-5 text-3xl font-bold tracking-[-0.035em] text-[#121c2a]">가볍게 시작하고,<br />안심하고 읽어보세요.</h2><p className="mt-5 text-sm leading-7 text-[#666d7a]">Astra Destiny는 결과를 정답이나 결정된 예언으로 말하지 않습니다. 나를 돌아보고 오늘의 선택을 돕는 자기이해 콘텐츠입니다.</p><div className="mt-6 flex flex-wrap gap-2 text-xs text-[#5f6571]"><span className="rounded-full bg-white/75 px-3 py-2">AI 생성 콘텐츠</span><span className="rounded-full bg-white/75 px-3 py-2">의료·법률·금융 조언 아님</span></div></div>
        <div className="space-y-3"><details className="faq-item" open><summary><span>분석에 얼마나 걸리나요?</span><Clock3 className="size-4 text-[#6b38d4]" aria-hidden /></summary><p>생년월일과 시간을 입력하면 보통 몇 초 안에 결과를 확인할 수 있어요.</p></details><details className="faq-item"><summary><span>내 정보가 저장되나요?</span><ShieldCheck className="size-4 text-[#6b38d4]" aria-hidden /></summary><p>입력 정보는 분석 요청과 결과 표시에만 사용하며, 서비스 데이터베이스에 저장하지 않습니다.</p></details><details className="faq-item"><summary><span>결과를 공유할 수 있나요?</span><Sparkles className="size-4 text-[#6b38d4]" aria-hidden /></summary><p>분석 후 공유 링크를 만들 수 있어요. 링크에는 결과 표시용 정보가 포함되므로 원하는 사람에게만 공유해주세요.</p></details></div>
      </div>
    </section>
  )
}

export function LandingFooter() {
  return <footer className="mt-20 border-t border-[#dfe5f7] py-10 sm:mt-28"><div className="flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left"><div><p className="font-serif text-lg font-bold text-[#6b38d4]">Astra Destiny</p><p className="mt-1 text-xs text-[#737987]">고대의 지혜, 디지털 영혼</p></div><p className="max-w-lg text-xs leading-6 text-[#737987]">AI가 생성한 자기이해용 엔터테인먼트 콘텐츠이며<br className="sm:hidden" /> 의료·법률·금융 조언이 아닙니다.</p><a href="#top" className="inline-flex min-h-11 items-center text-xs font-bold text-[#6b38d4] hover:underline">맨 위로</a></div></footer>
}
