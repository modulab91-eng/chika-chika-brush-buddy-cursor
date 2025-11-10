# 🦷 치카치카 (Chika-Chika) - AR 양치 습관 형성 앱

> 아이들의 건강한 양치 습관을 AI와 AR 기술로 즐겁게! 🌟

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-Face_Mesh-00C853?style=flat-square)](https://developers.google.com/mediapipe)

---

## 📖 프로젝트 소개

**치카치카**는 아이들이 올바른 양치 습관을 즐겁게 형성할 수 있도록 돕는 혁신적인 웹 애플리케이션입니다. 

### ✨ 핵심 기능

#### 🎯 **실시간 AR 양치 가이드** (NEW! 🆕)
- **MediaPipe Face Mesh**를 활용한 실시간 얼굴 추적
- **4구역 시스템**: 3분을 4개 구역으로 나누어 체계적 양치 (각 45초)
  - 🟥 상단 앞니
  - 🟦 왼쪽 어금니
  - 🟨 오른쪽 어금니
  - 🟩 하단 앞니
- **실시간 피드백**: 입 벌림 정도와 움직임 패턴을 분석하여 즉각적인 피드백
- **점수 시스템**: 올바른 양치 동작 시 점수 획득 + AR 보너스 포인트
- **애니메이션 가이드**: 구역별 색상 코딩과 방향 화살표로 직관적 안내

#### 📚 **3가지 모드**
1. **아이 모드** 🧒
   - 재미있는 양치 영상
   - AR 셀피 카메라 모드
   - 실시간 AR 가이드 오버레이
   - 게임형 점수 시스템

2. **학습 모드** 📖
   - 3분 집중 학습 타이머
   - 영어 명언 & 문장
   - 학습 배경 음악

3. **일반 모드** ⏰
   - 표준 3분 양치 타이머
   - 건강 정보 콘텐츠

#### 📊 **대시보드 & 리워드**
- 주간 양치 캘린더
- 포인트 시스템
- 통계 및 진행 상황 추적

---

## 🎮 AR 기능 사용 방법

1. **아이 모드** 선택
2. 양치 타이머 시작
3. **📷 카메라 버튼** 클릭
4. **✨ AR 가이드 켜기** 버튼 클릭
5. 화면의 색상 가이드를 따라 양치!
6. 입을 크게 벌리고 움직이면 점수 획득
7. 3분 완료 시 포인트 + AR 보너스 획득! 🎉

---

## 🛠️ 기술 스택

### Frontend
- **React 18.3.1** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite 5.4.19** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **shadcn/ui** - UI 컴포넌트

### AI/AR 기술
- **MediaPipe Tasks Vision** - 실시간 얼굴 추적
- **Face Landmarker** - 468개 얼굴 랜드마크 감지
- **Canvas API** - AR 오버레이 렌더링

### 상태 관리 & 유틸리티
- **React Hooks** - 상태 관리
- **TanStack Query** - 데이터 페칭
- **React Router** - 라우팅
- **date-fns** - 날짜 처리

---

## 🚀 시작하기

### 필수 요구사항
- Node.js 18+ 
- npm 또는 yarn

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/k1300k/chika-chika-brush-buddy-cursor.git

# 2. 프로젝트 디렉토리로 이동
cd chika-chika-brush-buddy-cursor

# 3. 의존성 설치
npm install

# 4. 개발 서버 실행
npm run dev

# 5. 브라우저에서 열기
# http://localhost:8080
```

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

---

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── ARBrushingGuide.tsx      # AR 오버레이 컴포넌트
│   ├── BrushingTimer.tsx         # 양치 타이머 메인 컴포넌트
│   ├── Dashboard.tsx             # 대시보드
│   ├── ModeSelector.tsx          # 모드 선택기
│   └── ui/                       # shadcn/ui 컴포넌트
├── hooks/
│   ├── useFaceTracking.ts        # 얼굴 추적 훅
│   ├── useBrushingAnalysis.ts    # 양치 동작 분석 훅
│   └── use-toast.ts              # 토스트 알림 훅
├── utils/
│   └── brushingData.ts           # 데이터 관리 유틸리티
├── types/
│   └── index.ts                  # TypeScript 타입 정의
└── pages/
    └── Index.tsx                 # 메인 페이지
```

---

## 🎯 AR 기능 상세

### 얼굴 추적 (Face Tracking)
```typescript
// useFaceTracking.ts
- MediaPipe Face Landmarker 초기화
- 468개 얼굴 랜드마크 실시간 감지
- GPU 가속 지원
- 30fps 최적화
```

### 양치 동작 분석 (Brushing Analysis)
```typescript
// useBrushingAnalysis.ts
- 입 벌림 정도 계산
- 움직임 패턴 분석
- 구역별 피드백 생성
- 점수 시스템 관리
```

### AR 오버레이 (AR Overlay)
```typescript
// ARBrushingGuide.tsx
- Canvas 기반 렌더링
- 구역별 색상 가이드
- 애니메이션 효과
- 방향 화살표 표시
```

---

## 📊 성능 최적화

- ✅ **프레임 레이트 제한**: 30fps로 CPU/GPU 사용량 최적화
- ✅ **조건부 렌더링**: AR 모드 활성화 시에만 얼굴 추적 실행
- ✅ **메모리 관리**: 최근 10프레임만 저장
- ✅ **GPU 가속**: MediaPipe GPU delegate 활용
- ✅ **레이지 로딩**: 필요한 컴포넌트만 로드

---

## 🌟 주요 특징

### 🎨 사용자 경험
- 직관적인 UI/UX
- 실시간 시각적 피드백
- 게임화된 보상 시스템
- 미러 효과 카메라

### 🔒 개인정보 보호
- 모든 처리는 클라이언트 사이드에서 수행
- 카메라 영상은 서버로 전송되지 않음
- 로컬 스토리지만 사용

### 📱 반응형 디자인
- 모바일 최적화
- 태블릿 지원
- 데스크톱 호환

---

## 🔮 향후 계획

- [ ] 칫솔 검출 기능 추가
- [ ] 더 정밀한 동작 인식 (속도, 각도 분석)
- [ ] 일일/주간 리포트 기능
- [ ] 배지 및 레벨 시스템
- [ ] 부모 대시보드
- [ ] 다국어 지원
- [ ] 음성 안내 기능

---

## 🤝 기여하기

프로젝트에 기여하고 싶으시다면:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다.

---

## 📞 문의

프로젝트 관련 문의사항이 있으시면 Issues 탭을 이용해주세요.

---

## 🙏 감사의 말

- [MediaPipe](https://developers.google.com/mediapipe) - 얼굴 인식 기술
- [shadcn/ui](https://ui.shadcn.com/) - UI 컴포넌트
- [Lucide Icons](https://lucide.dev/) - 아이콘
- [Coverr](https://coverr.co/) - 무료 영상 제공

---

## 📚 Lovable Project Info

**URL**: https://lovable.dev/projects/8f8de68d-9c72-4a11-8a88-061e30ab6390

## 💻 개발 가이드

### Lovable을 사용한 개발

[Lovable Project](https://lovable.dev/projects/8f8de68d-9c72-4a11-8a88-061e30ab6390)에서 직접 프롬프트로 개발할 수 있습니다.

Lovable에서의 변경사항은 자동으로 이 저장소에 커밋됩니다.

### 로컬 IDE 사용

로컬 환경에서 개발하고 싶다면, 이 저장소를 클론하여 작업할 수 있습니다.

**필수 요구사항**: Node.js & npm ([nvm으로 설치](https://github.com/nvm-sh/nvm#installing-and-updating))

**개발 단계**:

```sh
# 1. 저장소 클론
git clone https://github.com/k1300k/chika-chika-brush-buddy-cursor.git

# 2. 프로젝트 디렉토리로 이동
cd chika-chika-brush-buddy-cursor

# 3. 의존성 설치
npm install

# 4. 개발 서버 시작 (자동 리로드 포함)
npm run dev
```

### GitHub에서 직접 편집

- 원하는 파일로 이동
- 우측 상단의 "Edit" 버튼 (연필 아이콘) 클릭
- 변경사항 작성 후 커밋

### GitHub Codespaces 사용

- 저장소 메인 페이지로 이동
- "Code" 버튼 (녹색) 클릭
- "Codespaces" 탭 선택
- "New codespace" 클릭하여 Codespace 환경 시작
- Codespace에서 직접 파일 편집 및 커밋/푸시

---

## 🚀 배포하기

### Lovable을 통한 배포

[Lovable](https://lovable.dev/projects/8f8de68d-9c72-4a11-8a88-061e30ab6390)을 열고 Share -> Publish를 클릭하세요.

### 커스텀 도메인 연결

커스텀 도메인을 연결하려면:
1. Project > Settings > Domains로 이동
2. Connect Domain 클릭

자세한 내용: [커스텀 도메인 설정 가이드](https://docs.lovable.dev/features/custom-domain#custom-domain)

---

## 🧪 테스트

```bash
# 단위 테스트 실행
npm run test

# 테스트 커버리지 확인
npm run test:coverage
```

---

## 🐛 알려진 이슈

- AR 기능은 HTTPS 환경에서만 작동합니다 (카메라 권한 필요)
- 일부 구형 브라우저에서는 MediaPipe가 지원되지 않을 수 있습니다
- 최적의 경험을 위해 Chrome, Edge, Safari 최신 버전을 권장합니다

---

## 📈 버전 히스토리

### v1.1.0 (2025-11-10) 🆕
- ✨ **AR 양치 가이드 기능 추가**
  - MediaPipe Face Mesh 통합
  - 4구역 시스템 구현
  - 실시간 동작 분석 및 피드백
  - AR 보너스 점수 시스템
  - 애니메이션 가이드 오버레이

### v1.0.0
- 🎉 초기 릴리즈
  - 3가지 모드 (아이/학습/일반)
  - 3분 타이머
  - 포인트 시스템
  - 주간 캘린더
