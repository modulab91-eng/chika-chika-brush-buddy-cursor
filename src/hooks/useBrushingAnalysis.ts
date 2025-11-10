import { useState, useEffect, useRef } from 'react';
import { NormalizedLandmark } from '@mediapipe/tasks-vision';

interface BrushingPosition {
  mouthCenter: { x: number; y: number };
  timestamp: number;
}

interface MotionAnalysis {
  isValid: boolean;
  feedback: string;
}

interface BrushingAnalysisResult {
  score: number;
  feedback: string;
  isCorrectMotion: boolean;
}

// 양치 구역 정의
const BRUSHING_ZONES = [
  { name: '상단 앞니', duration: 45 },
  { name: '왼쪽 어금니', duration: 45 },
  { name: '오른쪽 어금니', duration: 45 },
  { name: '하단 앞니', duration: 45 }
];

/**
 * 입 벌림 정도를 계산
 */
const calculateMouthOpenness = (landmarks: NormalizedLandmark[]): number => {
  // MediaPipe Face Mesh 랜드마크 인덱스
  // 상입술 중앙: 13번
  // 하입술 중앙: 14번
  const upperLip = landmarks[13];
  const lowerLip = landmarks[14];
  
  return Math.abs(lowerLip.y - upperLip.y);
};

/**
 * 움직임 패턴 분석
 */
const analyzeMotionPattern = (
  positions: BrushingPosition[],
  currentZone: number
): MotionAnalysis => {
  if (positions.length < 5) {
    return {
      isValid: false,
      feedback: '양치 동작을 시작해보세요!'
    };
  }

  const recent = positions.slice(-5);
  const movements = recent.map((pos, index) => {
    if (index === 0) return { dx: 0, dy: 0 };
    const prev = recent[index - 1];
    return {
      dx: pos.mouthCenter.x - prev.mouthCenter.x,
      dy: pos.mouthCenter.y - prev.mouthCenter.y
    };
  }).slice(1);

  const avgMovement = movements.reduce((acc, mov) => ({
    dx: acc.dx + Math.abs(mov.dx),
    dy: acc.dy + Math.abs(mov.dy)
  }), { dx: 0, dy: 0 });

  const totalMovement = avgMovement.dx + avgMovement.dy;
  const hasMovement = totalMovement > 0.01;

  if (!hasMovement) {
    return {
      isValid: false,
      feedback: '양치 동작을 더 활발하게 해보세요!'
    };
  }

  const zoneName = BRUSHING_ZONES[currentZone]?.name || '이 구역';
  
  return {
    isValid: true,
    feedback: `${zoneName}을(를) 잘 닦고 있어요! 🦷✨`
  };
};

/**
 * 양치 동작을 분석하는 커스텀 훅
 * 
 * @param landmarks - 얼굴 랜드마크 데이터
 * @param currentZone - 현재 양치 구역 (0-3)
 * @param isActive - 분석 활성화 여부
 * @returns 점수, 피드백, 동작 유효성
 */
export const useBrushingAnalysis = (
  landmarks: NormalizedLandmark[] | null,
  currentZone: number,
  isActive: boolean
): BrushingAnalysisResult => {
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('카메라를 보며 양치를 시작해보세요!');
  const [isCorrectMotion, setIsCorrectMotion] = useState(false);
  const previousPositionsRef = useRef<BrushingPosition[]>([]);

  useEffect(() => {
    if (!landmarks || !isActive) {
      return;
    }

    // 얼굴이 감지되지 않은 경우
    if (landmarks.length === 0) {
      setFeedback('카메라에 얼굴이 보이도록 위치를 조정해주세요!');
      setIsCorrectMotion(false);
      return;
    }

    // 입 벌림 정도 계산
    const mouthOpenness = calculateMouthOpenness(landmarks);
    const isProperlyOpen = mouthOpenness > 0.02; // 임계값

    if (!isProperlyOpen) {
      setFeedback('입을 더 크게 벌려주세요!');
      setIsCorrectMotion(false);
      return;
    }

    // 현재 입 중앙 위치 저장
    const mouthCenter = {
      x: (landmarks[13].x + landmarks[14].x) / 2,
      y: (landmarks[13].y + landmarks[14].y) / 2
    };

    previousPositionsRef.current = [
      ...previousPositionsRef.current.slice(-9), // 최근 10프레임만 유지
      {
        mouthCenter,
        timestamp: Date.now()
      }
    ];

    // 움직임 패턴 분석
    const analysis = analyzeMotionPattern(
      previousPositionsRef.current,
      currentZone
    );

    setIsCorrectMotion(analysis.isValid);
    setFeedback(analysis.feedback);

    // 올바른 동작 시 점수 증가
    if (analysis.isValid) {
      setScore(prev => Math.min(prev + 1, 100));
    }

  }, [landmarks, currentZone, isActive]);

  // 구역 변경 시 이전 위치 초기화
  useEffect(() => {
    previousPositionsRef.current = [];
  }, [currentZone]);

  return { score, feedback, isCorrectMotion };
};
