import { useEffect, RefObject } from 'react';
import { NormalizedLandmark } from '@mediapipe/tasks-vision';

interface BrushingZone {
  name: string;
  color: string;
  duration: number;
}

const BRUSHING_ZONES: BrushingZone[] = [
  { name: '상단 앞니', color: '#FF6B6B', duration: 45 },
  { name: '왼쪽 어금니', color: '#4ECDC4', duration: 45 },
  { name: '오른쪽 어금니', color: '#45B7D1', duration: 45 },
  { name: '하단 앞니', color: '#96CEB4', duration: 45 }
];

interface ARBrushingGuideProps {
  landmarks: NormalizedLandmark[] | null;
  canvasRef: RefObject<HTMLCanvasElement>;
  currentZone: number;
  timeLeft: number;
  isCorrectMotion?: boolean;
}

interface GuideArea {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
}

/**
 * 입 중심점 계산
 */
const getMouthCenter = (landmarks: NormalizedLandmark[], width: number, height: number) => {
  // MediaPipe Face Mesh에서 입술 중앙 랜드마크 (상: 13, 하: 14)
  const upperLip = landmarks[13];
  const lowerLip = landmarks[14];
  
  return {
    x: ((upperLip.x + lowerLip.x) / 2) * width,
    y: ((upperLip.y + lowerLip.y) / 2) * height
  };
};

/**
 * 구역별 가이드 영역 계산
 */
const calculateGuideArea = (
  mouthCenter: { x: number; y: number },
  zoneName: string,
  scale: number = 1
): GuideArea => {
  const baseRadius = 40 * scale;
  const offset = 50 * scale;

  switch (zoneName) {
    case '상단 앞니':
      return {
        x: mouthCenter.x,
        y: mouthCenter.y - offset,
        radiusX: baseRadius,
        radiusY: 20 * scale
      };
    case '왼쪽 어금니':
      return {
        x: mouthCenter.x - offset,
        y: mouthCenter.y,
        radiusX: 25 * scale,
        radiusY: baseRadius
      };
    case '오른쪽 어금니':
      return {
        x: mouthCenter.x + offset,
        y: mouthCenter.y,
        radiusX: 25 * scale,
        radiusY: baseRadius
      };
    case '하단 앞니':
      return {
        x: mouthCenter.x,
        y: mouthCenter.y + offset,
        radiusX: baseRadius,
        radiusY: 20 * scale
      };
    default:
      return {
        x: mouthCenter.x,
        y: mouthCenter.y,
        radiusX: baseRadius,
        radiusY: baseRadius
      };
  }
};

/**
 * 구역 가이드 그리기
 */
const drawBrushingGuide = (
  ctx: CanvasRenderingContext2D,
  guideArea: GuideArea,
  zoneData: BrushingZone,
  isCorrectMotion: boolean,
  animationFrame: number
) => {
  // 애니메이션 효과: 맥박처럼 크기 변화
  const pulseScale = 1 + Math.sin(animationFrame * 0.1) * 0.1;
  
  // 올바른 동작 시 더 밝게 표시
  const alpha = isCorrectMotion ? 0.4 : 0.2;
  const strokeWidth = isCorrectMotion ? 4 : 3;

  ctx.save();
  
  // 그림자 효과
  ctx.shadowColor = zoneData.color;
  ctx.shadowBlur = isCorrectMotion ? 20 : 10;
  
  // 가이드 영역 채우기
  ctx.fillStyle = `${zoneData.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
  ctx.strokeStyle = zoneData.color;
  ctx.lineWidth = strokeWidth;

  ctx.beginPath();
  ctx.ellipse(
    guideArea.x,
    guideArea.y,
    guideArea.radiusX * pulseScale,
    guideArea.radiusY * pulseScale,
    0,
    0,
    2 * Math.PI
  );
  ctx.fill();
  ctx.stroke();

  ctx.restore();
};

/**
 * 방향 가이드 화살표 그리기
 */
const drawDirectionGuide = (
  ctx: CanvasRenderingContext2D,
  guideArea: GuideArea,
  zoneData: BrushingZone,
  animationFrame: number
) => {
  ctx.save();
  
  const arrowSize = 15;
  const offset = Math.sin(animationFrame * 0.15) * 5;

  ctx.strokeStyle = zoneData.color;
  ctx.fillStyle = zoneData.color;
  ctx.lineWidth = 2;

  // 구역별 화살표 방향
  switch (zoneData.name) {
    case '상단 앞니':
      // 좌우 화살표
      drawArrow(ctx, guideArea.x - 30 + offset, guideArea.y, arrowSize, 0);
      drawArrow(ctx, guideArea.x + 30 - offset, guideArea.y, arrowSize, Math.PI);
      break;
    case '왼쪽 어금니':
      // 원형 화살표
      drawCircularArrow(ctx, guideArea.x, guideArea.y, 30, animationFrame);
      break;
    case '오른쪽 어금니':
      // 원형 화살표 (반대 방향)
      drawCircularArrow(ctx, guideArea.x, guideArea.y, 30, -animationFrame);
      break;
    case '하단 앞니':
      // 좌우 화살표
      drawArrow(ctx, guideArea.x - 30 + offset, guideArea.y, arrowSize, 0);
      drawArrow(ctx, guideArea.x + 30 - offset, guideArea.y, arrowSize, Math.PI);
      break;
  }

  ctx.restore();
};

/**
 * 화살표 그리기 헬퍼 함수
 */
const drawArrow = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  angle: number
) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  ctx.beginPath();
  ctx.moveTo(-size, 0);
  ctx.lineTo(size, 0);
  ctx.lineTo(size - 8, -8);
  ctx.moveTo(size, 0);
  ctx.lineTo(size - 8, 8);
  ctx.stroke();

  ctx.restore();
};

/**
 * 원형 화살표 그리기 헬퍼 함수
 */
const drawCircularArrow = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  animationFrame: number
) => {
  ctx.save();
  ctx.translate(x, y);

  const startAngle = (animationFrame * 0.05) % (Math.PI * 2);
  const endAngle = startAngle + Math.PI * 1.5;

  ctx.beginPath();
  ctx.arc(0, 0, radius, startAngle, endAngle);
  ctx.stroke();

  // 화살표 머리
  const arrowX = Math.cos(endAngle) * radius;
  const arrowY = Math.sin(endAngle) * radius;
  const arrowAngle = endAngle + Math.PI / 2;

  ctx.save();
  ctx.translate(arrowX, arrowY);
  ctx.rotate(arrowAngle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-8, -8);
  ctx.moveTo(0, 0);
  ctx.lineTo(-8, 8);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
};

/**
 * 텍스트 레이블 그리기
 */
const drawZoneLabel = (
  ctx: CanvasRenderingContext2D,
  zoneName: string,
  width: number,
  height: number,
  zoneData: BrushingZone
) => {
  ctx.save();
  
  ctx.fillStyle = zoneData.color;
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  
  // 텍스트 배경
  const text = `🦷 ${zoneName}`;
  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  const textHeight = 30;
  const padding = 10;
  
  const bgX = width / 2 - textWidth / 2 - padding;
  const bgY = 10;
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillRect(bgX, bgY, textWidth + padding * 2, textHeight + padding);
  
  // 테두리
  ctx.strokeStyle = zoneData.color;
  ctx.lineWidth = 2;
  ctx.strokeRect(bgX, bgY, textWidth + padding * 2, textHeight + padding);
  
  // 텍스트
  ctx.fillStyle = zoneData.color;
  ctx.fillText(text, width / 2, bgY + padding);
  
  ctx.restore();
};

/**
 * AR 양치 가이드 오버레이 컴포넌트
 */
const ARBrushingGuide = ({
  landmarks,
  canvasRef,
  currentZone,
  timeLeft,
  isCorrectMotion = false
}: ARBrushingGuideProps) => {
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame = 0;
    let animationId: number;

    const render = () => {
      const { width, height } = canvas;
      
      // 캔버스 크기를 비디오 크기에 맞춤
      const video = canvas.previousElementSibling as HTMLVideoElement;
      if (video && video.videoWidth > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      ctx.clearRect(0, 0, width, height);

      const currentZoneData = BRUSHING_ZONES[currentZone];
      if (!currentZoneData) return;

      // 구역 레이블 그리기
      drawZoneLabel(ctx, currentZoneData.name, width, height, currentZoneData);

      // 얼굴이 감지된 경우 AR 가이드 그리기
      if (landmarks && landmarks.length > 0) {
        const mouthCenter = getMouthCenter(landmarks, width, height);
        const scale = width / 640; // 640px 기준으로 스케일 조정
        const guideArea = calculateGuideArea(mouthCenter, currentZoneData.name, scale);

        // 가이드 영역 그리기
        drawBrushingGuide(ctx, guideArea, currentZoneData, isCorrectMotion, animationFrame);

        // 방향 가이드 그리기
        drawDirectionGuide(ctx, guideArea, currentZoneData, animationFrame);
      } else {
        // 얼굴 미감지 시 메시지
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, height - 60, width, 60);
        ctx.fillStyle = 'white';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('카메라에 얼굴을 비춰주세요', width / 2, height - 30);
        ctx.restore();
      }

      animationFrame++;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [landmarks, canvasRef, currentZone, isCorrectMotion]);

  return null;
};

export default ARBrushingGuide;
