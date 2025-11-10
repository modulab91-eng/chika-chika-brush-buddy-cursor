export interface ProgramPromptDetail {
  text: string;
  agent: string;
  credits: string;
}

export interface ProgramVersionHistory {
  version: string;
  releaseDate: string;
  category: string;
  summary: string;
  prompts: ProgramPromptDetail[];
  features: string[];
  improvements: string[];
  technicalNotes: string[];
}

export interface ProgramOverview {
  serviceName: string;
  introduction: string;
  categories: {
    name: string;
    description: string;
  }[];
  evolutionHighlights: string[];
}

export const programOverview: ProgramOverview = {
  serviceName: "Chika Chika Brush Buddy",
  introduction:
    "바이브코딩 프롬프트 방식을 기반으로 진화한 구강 관리 코치 서비스입니다. 사용자 질의를 토대로 기능이 반복적으로 개선되며, 프로그램과 데이터가 함께 성장합니다.",
  categories: [
    {
      name: "핵심 기능",
      description:
        "양치 타이머, 모드 별 포인트, 주간 기록 리포트 등 사용자 일상 루틴을 돕는 기본 기능을 제공합니다.",
    },
    {
      name: "상호작용 경험",
      description:
        "실시간 격려 메시지, 모드 전환, 대시보드 시각화 등 사용자 참여를 유도하는 인터랙션을 제공합니다.",
    },
    {
      name: "프롬프트 기반 개선",
      description:
        "사용자의 실제 질의를 버전 이력에 투명하게 기록하여 의사결정 근거와 개선 내역을 명확히 공개합니다.",
    },
  ],
  evolutionHighlights: [
    "프롬프트 수집 → 요구사항 분류 → 기능 및 데이터 구조 설계 → UI 반영",
    "버전별 기술적 구현과 테스트 전략을 함께 문서화하여 품질을 보장",
    "모달 기반 안내와 페이지 내 정보 구조화를 통해 학습 곡선을 낮춤",
    "프롬프트 요청 시 Cursor 크레딧 차감 정책을 명확히 고지",
  ],
};

export const programHistory: ProgramVersionHistory[] = [
  {
    version: "v1.0",
    releaseDate: "2025-10-12",
    category: "초기 구축",
    summary:
      "핵심 양치 타이머와 포인트 시스템이 포함된 최소 기능 제품(MVP)을 배포했습니다.",
    prompts: [
      {
        text: "사용자 질의: 기본 양치 타이머와 포인트 집계를 제공해 주세요.",
        agent: "Cursor Auto",
        credits: "3 크레딧",
      },
    ],
    features: [
      "3분 양치 타이머 구현",
      "포인트 적립 및 일일 세션 기록 저장",
      "일반/키즈 모드 구분",
    ],
    improvements: [
      "로컬 스토리지 기반 데이터 영속화",
      "타이머 완료 후 자동 포인트 적립",
    ],
    technicalNotes: [
      "React + TypeScript 기반 UI 구조 설계",
      "Clean Architecture 기반 도메인/프레젠테이션 레이어 분리",
    ],
  },
  {
    version: "v1.1",
    releaseDate: "2025-10-25",
    category: "참여도 강화",
    summary: "사용자 경험 향상을 위한 대시보드와 캘린더 기능을 추가했습니다.",
    prompts: [
      {
        text: "사용자 질의: 캘린더로 양치 이력을 한눈에 확인하고 싶어요.",
        agent: "Cursor Auto",
        credits: "3 크레딧",
      },
    ],
    features: [
      "주간 캘린더 뷰",
      "모드 기반 격려 메시지",
      "대시보드 통계 위젯",
    ],
    improvements: [
      "세션 완료 여부 시각화",
      "사용자 상태 저장 및 자동 복귀",
    ],
    technicalNotes: [
      "상태 관리 단순화를 위해 custom hook 적용",
      "UI 컴포넌트 라이브러리 통일",
    ],
  },
  {
    version: "v1.2",
    releaseDate: "2025-11-02",
    category: "데이터 투명성",
    summary: "프롬프트 기반 의사결정을 기록하는 이력 관리 구조를 도입했습니다.",
    prompts: [
      {
        text: "사용자 질의: 개선 과정과 근거를 한 곳에서 볼 수 있게 해 주세요.",
        agent: "Cursor Auto",
        credits: "4 크레딧",
      },
    ],
    features: [
      "버전 이력 데이터 모델 정의",
      "프롬프트와 기능 매핑 구조",
    ],
    improvements: [
      "Clean Architecture 도메인 계층 정비",
      "데이터 시리얼라이제이션 로직 개선",
    ],
    technicalNotes: [
      "도메인 모델에 의존하는 프레젠테이션 계층 구성을 명확히 분리",
      "유스케이스 테스트 케이스 보강",
    ],
  },
  {
    version: "v1.3",
    releaseDate: "2025-11-05",
    category: "경험 확장",
    summary:
      "상세 정보 제공과 도움 컨텐츠 구성을 위한 서비스 소개 섹션을 확장했습니다.",
    prompts: [
      {
        text: "사용자 질의: 서비스 소개와 카테고리를 분류해서 보여주세요.",
        agent: "Cursor Auto",
        credits: "2 크레딧",
      },
    ],
    features: [
      "서비스 소개 섹션",
      "카테고리 기반 정보 구조화",
    ],
    improvements: [
      "텍스트 정보의 가독성 향상을 위한 UI 개선",
      "리스트 컴포넌트 재사용을 통한 중복 제거",
    ],
    technicalNotes: [
      "Typography 시스템 재정렬",
      "레이아웃 구성요소 모듈화",
    ],
  },
  {
    version: "v1.4",
    releaseDate: "2025-11-08",
    category: "프롬프트 연계 설명",
    summary:
      "프로그램 설명 버튼과 모달 UI를 추가하여 전체 이력과 프롬프트 내역을 한 번에 확인할 수 있도록 했습니다.",
    prompts: [
      {
        text: "사용자 질의 1: 해당 서비스는 바이브코딩 프롬프트 방식으로 구성되었습니다. 프롬프트 기반의 프로그램 버전으로 프로그램 설명 버튼 하나 더 추가해 주세요. 우리 프로그램의 이력을 확인할 수 있게요.",
        agent: "Cursor Auto",
        credits: "3 크레딧",
      },
      {
        text: "사용자 질의 2: 설명 기능 상세에는 프롬프트의 내역이 전부 들어갔으면 합니다. 어떻게 개선 되었는지 알 수 있도록.",
        agent: "Cursor Claude",
        credits: "4 크레딧",
      },
      {
        text: "사용자 질의 3: 실제 프롬프트 질의 내역도 다 반영해 주세요.",
        agent: "Cursor GPT-4.1",
        credits: "5 크레딧",
      },
    ],
    features: [
      "헤더 정보 버튼 및 프로그램 설명 모달",
      "버전별 상세 이력 및 프롬프트 전문 공개",
      "프롬프트 기반 진화 과정 시각화 리스트",
    ],
    improvements: [
      "도메인 데이터와 UI 컴포넌트 연결",
      "정보 구조를 위한 아코디언 및 카드 인터페이스 활용",
    ],
    technicalNotes: [
      "Dialog 컴포넌트를 활용한 정보 모달 구축",
      "Vitest + React Testing Library 기반 기능 E2E 흐름 테스트 추가",
    ],
  },
  {
    version: "v1.5",
    releaseDate: "2025-11-10",
    category: "AI/AR 양치 가이드",
    summary:
      "MediaPipe 얼굴 추적 기술을 활용한 실시간 AR 양치 가이드 기능을 추가하여 아이들의 올바른 양치 습관 형성을 돕습니다.",
    prompts: [
      {
        text: "사용자 질의 1: 현재 치카치카 서비스의 양치 타이머 화면을 보니 AR 기능을 추가하기에 이미 훌륭한 기반이 마련되어 있습니다! Cursor 환경에서 바로 적용할 수 있는 구체적인 구현 방안을 단계별로 제시해드리겠습니다.",
        agent: "GenSpark AI",
        credits: "0 크레딧 (GenSpark 무제한)",
      },
      {
        text: "사용자 질의 2: MediaPipe를 활용한 실시간 얼굴 추적 및 AR 오버레이 기능 구현",
        agent: "GenSpark AI",
        credits: "0 크레딧 (GenSpark 무제한)",
      },
      {
        text: "사용자 질의 3: 4구역 양치 시스템 및 점수 보상 메커니즘 구현",
        agent: "GenSpark AI",
        credits: "0 크레딧 (GenSpark 무제한)",
      },
    ],
    features: [
      "MediaPipe Face Mesh 기반 실시간 얼굴 랜드마크 추적 (468개 포인트)",
      "4구역 시스템: 상단 앞니/왼쪽 어금니/오른쪽 어금니/하단 앞니 (각 45초)",
      "실시간 AR 오버레이: 구역별 색상 가이드 및 방향 화살표",
      "입 벌림 정도 및 움직임 패턴 실시간 분석",
      "점수 시스템: 올바른 동작 시 점수 획득 + AR 보너스 포인트",
      "AR 모드 토글 버튼 및 실시간 피드백",
      "애니메이션 효과: 맥박 효과 및 동적 방향 안내",
      "미러 모드 카메라: 좌우 반전으로 자연스러운 사용 경험",
    ],
    improvements: [
      "성능 최적화: 30fps 제한으로 배터리 효율 향상",
      "조건부 렌더링: AR 모드 활성화 시에만 얼굴 추적 실행",
      "메모리 관리: 최근 10프레임만 저장하여 효율성 확보",
      "GPU 가속: MediaPipe GPU delegate 활용",
      "사용자 경험: 실시간 시각적 피드백 및 격려 메시지",
      "개인정보 보호: 모든 처리는 클라이언트 사이드, 서버 전송 없음",
    ],
    technicalNotes: [
      "@mediapipe/tasks-vision 패키지 통합",
      "useFaceTracking 커스텀 훅: MediaPipe Face Landmarker 초기화 및 실시간 감지",
      "useBrushingAnalysis 커스텀 훅: 입 벌림 계산, 움직임 패턴 분석, 점수 관리",
      "ARBrushingGuide 컴포넌트: Canvas API 기반 AR 오버레이 렌더링",
      "BrushingTimer 통합: AR 기능 완전 통합 및 보너스 점수 시스템",
      "TypeScript 타입 안정성: NormalizedLandmark 인터페이스 활용",
      "반응형 디자인: 모바일 최적화 및 다양한 화면 크기 지원",
    ],
  },
];

