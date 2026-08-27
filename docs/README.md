# AI 사주·운세 개인 분석 서비스 개발 계획 및 스프린트 로드맵

본 문서는 루트 디렉터리의 [`PRD.md`](file:///c:/zip/PRD.md)에 정의된 제품 요구사항 및 예외 처리 명세를 100% 충실히 구현하기 위한 **스프린트 기반 개발 계획서**입니다.

---

## 📌 문서 개요 및 목차

| 문서 | 설명 | 바로가기 |
|---|---|---|
| **개발 계획 총괄 (Development Plan)** | 전체 아키텍처, 기술 스택, 핵심 개발 원칙, 5시간 MVP 개발 전략 | [전체 개발 계획서](./development-plan.md) |
| **요구사항 추적 매트릭스 (PRD Checklist)** | PRD 기능(F-01~F-02), 예외(E-01~E-17), 성공조건 완벽 매핑 | [PRD 구현 검증 체크리스트](./prd-checklist.md) |
| **Sprint 1** | 입력 검증 강화 & 사주·띠·별자리 계산 및 폼 인터랙션 | [Sprint 1 상세 계획서](./sprints/sprint-1-core-engine-and-validation.md) |
| **Sprint 2** | AI 사주 분석 API 파이프라인, 스키마 검증 & 장애 복구 | [Sprint 2 상세 계획서](./sprints/sprint-2-ai-analysis-pipeline.md) |
| **Sprint 3** | DB-less 무저장 URL 인코딩 공유 엔진 & Fallback 체계 | [Sprint 3 상세 계획서](./sprints/sprint-3-sharing-and-link-engine.md) |
| **Sprint 4** | UI/UX 완성도, 단일 화면 상태 머신 최적화, E2E 검증 & 출시 | [Sprint 4 상세 계획서](./sprints/sprint-4-ui-ux-polish-and-qa.md) |
| **AI 서비스 개선 계획** | Gemini 연결 안정화, 품질 평가, 관측성, 보안·비용 관리 로드맵 | [Gemini 기반 AI 서비스 개선 계획](./ai-service-improvement-plan.md) |
| **AI 운영·보안 가이드** | Secret 교체, 관측 지표, 장애·비용 경보 및 운영 절차 | [AI 운영·보안 가이드](./ai-operations.md) |

---

## 🎯 프로젝트 핵심 방향성

1. **철저한 단일 화면(Single Page) 유지**:
   - 페이지 이동, 라우트 분기, 팝업 전환 없이 한 화면에서 입력 $\rightarrow$ 분석 중 $\rightarrow$ 결과 표시 $\rightarrow$ 공유까지 매끄럽게 연결.
2. **Zero-Database (무저장) 아키텍처**:
   - 사용자 생년정보 및 분석 결과를 서버 DB에 영구 저장하지 않음.
   - 공유 기능은 URL Query Parameter 기반의 고효율 압축 인코딩/디코딩 방식을 채택.
3. **견고한 17개 예외 처리 (E-01 ~ E-17)**:
   - 입력 유효성 검사, 네트워크 장애, AI 응답 누락, 타임아웃, 중복 클릭, 공유 실패 등 모든 엣지 케이스 완벽 방어.
4. **10초 이내 신속한 분석 (Fast Response)**:
   - 서버리스 API 최적화 및 룰 엔진/LLM 하이브리드 파이프라인으로 체감 대기시간 최소화.
