# AI 운영·보안 가이드

## Secret 설정

- 로컬 개발: 루트 `.env`의 `GEMINI_API_KEY`, `GEMINI_MODEL`을 사용합니다.
- 배포 환경: 호스팅 서비스의 Secret Manager에 같은 이름으로 등록합니다.
- `NEXT_PUBLIC_` 접두사를 키에 사용하지 않습니다.
- 키 값, 생년정보, Gemini 원문 응답은 로그로 출력하지 않습니다.

## 키 교체 절차

1. Google AI 관리 화면에서 새 키를 생성합니다.
2. 배포 환경의 `GEMINI_API_KEY`를 새 키로 교체합니다.
3. `/api/fortune` 스모크 테스트가 HTTP 200인지 확인합니다.
4. 이전 키를 폐기합니다.
5. 저장소와 배포 로그에 키가 포함되지 않았는지 확인합니다.

## 관측 지표

서버는 개인정보 없이 다음 구조화 이벤트를 남깁니다.

- `success`: AI 제공자 정상 결과
- `timeout`: 8.5초 제공자 제한 초과
- `provider_error`: 네트워크, 인증, 모델 제공자 오류
- `parse_error`: JSON, 스키마, 품질 게이트 실패
- `rate_limited`: 분당 요청 제한 초과

응답 헤더 `X-Fortune-Source`는 `gemini`, `openai`, `expert-fallback` 중 하나이며,
`X-Request-Id`는 사용자 문의와 서버 이벤트를 연결할 때 사용합니다.

## 운영 경보 권장 기준

- 5분간 API 실패율 5% 초과
- p95 응답시간 9초 초과
- Fallback 비율 20% 초과
- 분당 요청 제한 발생 급증
- 일일 Gemini 사용량이 예산의 80% 도달

현재 인메모리 요청 제한은 단일 인스턴스용 기본 방어입니다. 다중 서버리스 인스턴스에서 강한
제한이 필요하면 별도의 분산 Rate Limit 저장소를 도입해야 합니다.
