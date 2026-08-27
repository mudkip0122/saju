# Sprint 2: AI 사주 분석 파이프라인 & 스키마 검증 및 장애 복구 체계

## 1. 스프린트 개요
- **목표**: Next.js Route Handler 기반의 AI 사주 분석 파이프라인을 구축하고, 10초 이내 응답 보장, 엄격한 스키마 검증(Zod), 예외 상황에 대한 자동 보정 및 Fallback을 구현합니다.
- **담당 PRD 항목**: F-01 AI 개인 분석, E-07, E-08, E-09, E-10, E-11, E-12, E-13, 성공조건 3, 5, 6
- **예상 소요 시간**: 1.5시간

---

## 2. 세부 개발 태스크 (Tasks)

### Task 2.1: 사주 분석 API Route Handler 구현 (`app/api/fortune/route.ts`)
- [x] **엔드포인트 명세**: `POST /api/fortune`
  - Request Body: `{ birthDate: string, birthTime?: string, unknownTime: boolean }`
  - 계산된 띠, 별자리, 사주 천간지지를 시스템 프롬프트의 컨텍스트로 주입.
- [x] **AI LLM 연동 (Gemini / OpenAI / Fallback Engine)**:
  - Few-shot 및 엄격한 JSON Schema 지시문 작성.
  - 사주 오행(목화토금수)과 별자리 기질을 융합한 개성 있는 타입명, 핵심 성향, 강점, 주의점, 인간관계, 총평 생성.
  - 현재 날짜(KST 기준)에 최적화된 오늘의 운세(별점 1~5점 + 한 줄 코멘트 + 키워드) 도출.
- [x] **10초 타임아웃 보장 (E-08 대응)**:
  - 서버 및 클라이언트 양측에 9~10초 타임아웃 `AbortController` 설정.
  - 초과 시 HTTP 504 / `"분석 시간이 길어지고 있어요. 잠시 후 다시 시도해주세요."` 반환.

### Task 2.2: Zod 스키마 검증 및 데이터 무결성 보정 (`lib/schema.ts`)
- [x] **E-11 AI 결과 필수 항목 누락 방지**:
  - `typeName`, `typeDescription`, `traits`, `details`, `oneLiner`, `today.score`, `today.message` 필수 필드 검증.
  - 필드 누락 시 재시도 또는 안정적인 Fallback 템플릿 반환.
- [x] **E-12 핵심 성향 개수 엄격 3개 보정**:
  - AI가 3개 초과 반환 시 `.slice(0, 3)` 처리.
  - 3개 미만 반환 시 사주 오행 기반 보조 성향을 채워 넣어 UI 카드 형태(3그리드) 완벽 유지.
- [x] **E-13 오늘의 운세 별점 1~5 정수 보정**:
  - `Math.min(5, Math.max(1, Math.round(score)))` 로 Clamp 처리.

### Task 2.3: 네트워크 장애 및 클라이언트 예외 처리 (`app/page.tsx`, `components/birth-form.tsx`)
- [x] **E-07 중복 클릭 방지**:
  - `isLoading` 활성화 즉시 버튼 disable 및 UI 스피너 작동, 분석 완료 전까지 추가 요청 원천 차단.
- [x] **E-09 분석 실패 및 재시도 UI**:
  - API 오류(500 등) 수신 시 `FAILED` 상태로 전환, 기존 입력값 100% 보존, `"분석에 실패했습니다. 다시 시도해주세요."` 배너 및 즉시 재시도 버튼 노출.
- [x] **E-10 인터넷 연결 감지 (Offline)**:
  - `navigator.onLine` 체크 및 `window.addEventListener('offline')` 처리.
  - 오프라인 상태에서 요청 시 `"인터넷 연결을 확인한 후 다시 시도해주세요."` 토스트/에러 출력.

---

## 3. 검증 시나리오 (Verification Plan)

1. **스키마 무결성 테스트**: AI가 불완전한 JSON을 반환해도 앱이 붕괴되지 않고 정상 보정 또는 안전 실패 메시지를 표시하는가?
2. **타임아웃 시뮬레이션**: 10초 지연 응답 시 E-08 안내 문구와 함께 버튼이 재활성화되는가?
3. **네트워크 단절 테스트**: 브라우저 오프라인 모드에서 분석 시도 시 E-10 안내가 출력되는가?
4. **점수 및 개수 보정**: 성향 개수가 항상 정확히 3개이며 별점이 1~5점 범위 내에 머무는가?
