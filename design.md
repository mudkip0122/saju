# Astra Destiny - Design System (DESIGN.md)

## 1. 브랜드 정체성 (Brand Identity)
- **컨셉:** 고대의 지혜와 디지털 영혼 (Ancient Wisdom, Digital Soul)
- **톤앤매너:** 신비로운 운세 분석을 현대적이고 세련된 AI 기술로 풀어낸 깔끔한 라이트 테마(Light Theme).
- **핵심 키워드:** 신비로움, 투명함, 전문성, 직관성.

## 2. 컬러 팔레트 (Color Palette)
- **Primary:** `#6b38d4` (시그니처 퍼플 - 포인트 컬러 및 주요 액션 버튼)
- **Surface:** `#f8f9ff` (기본 배경색 - 깨끗하고 부드러운 느낌)
- **Surface Variant:** `#eff3ff` (카드 배경 및 섹션 구분)
- **Text Primary:** `#1a1a1a` (높은 가독성을 위한 진한 다크 그레이)
- **Text Secondary:** `#666666` (설명 문구용 중간 톤 그레이)
- **Accent:** 옅은 파스텔톤 그라데이션 및 반투명 효과 활용.

## 3. 타이포그래피 (Typography)
- **서체:** 한국어 가독성에 최적화된 산세리프 서체 (Pretendard 또는 Noto Sans KR 권장)
- **위계(Hierarchy):**
  - **Headlines:** 굵고 큰 폰트 사이즈로 서비스의 핵심 가치 전달.
  - **Body:** 충분한 행간(Line-height)을 확보하여 분석 결과 읽기 편하도록 설계.
  - **Labels:** 버튼 및 폼 요소에는 명확하고 강조된 텍스트 적용.

## 4. UI 요소 및 스타일 (UI Elements & Styling)
- **라운딩(Roundness):** 모든 카드와 버튼에 `16px` 이상의 넉넉한 곡률(Border-radius) 적용하여 부드러운 인상 제공.
- **글래스모피즘(Glassmorphism):** 네비게이션 바 및 입력 영역에 `backdrop-blur`와 반투명 배경색을 적용하여 현대적이고 투명한 느낌 강조.
- **그림자(Shadows):** 물리적인 깊이감보다는 공중에 떠 있는 듯한 가벼운 `soft shadows` 활용.
- **여백(Spacing):** 넉넉한 화이트 스페이스(Whitespace)를 사용하여 정보의 과부하를 방지하고 시각적 편안함 유지.

## 5. 컴포넌트 가이드라인 (Component Guidelines)
- **Top Navigation:** 로고와 필수 액션(로그인)만 포함하여 단순화. '분석', '별자리', '소개' 등 메뉴는 생략.
- **Input Fields:** 깔끔한 보더와 포커스 시 시그니처 퍼플 컬러 강조.
- **Buttons:** 주요 CTA(Call To Action) 버튼은 그라데이션이나 시그니처 퍼플 배경색을 사용하여 시인성 확보.
- **Cards:** 분석 결과는 글래스모피즘 효과가 적용된 카드 UI 내에 배치.
