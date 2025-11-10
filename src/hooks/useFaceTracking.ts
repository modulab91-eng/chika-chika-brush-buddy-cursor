import { useEffect, useRef, useState, RefObject } from 'react';
import { FaceLandmarker, FilesetResolver, NormalizedLandmark } from '@mediapipe/tasks-vision';

interface FaceTrackingOptions {
  minFaceDetectionConfidence?: number;
  minFacePresenceConfidence?: number;
  minTrackingConfidence?: number;
}

interface FaceTrackingResult {
  landmarks: NormalizedLandmark[] | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * MediaPipe Face Landmarker를 사용한 실시간 얼굴 추적 훅
 * 
 * @param videoRef - 비디오 엘리먼트 ref
 * @param isActive - 추적 활성화 여부
 * @param options - 추적 옵션 (신뢰도 임계값 등)
 * @returns 얼굴 랜드마크 데이터, 로딩 상태, 에러 정보
 */
export const useFaceTracking = (
  videoRef: RefObject<HTMLVideoElement>,
  isActive: boolean,
  options: FaceTrackingOptions = {}
): FaceTrackingResult => {
  const [faceLandmarker, setFaceLandmarker] = useState<FaceLandmarker | null>(null);
  const [landmarks, setLandmarks] = useState<NormalizedLandmark[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const animationRef = useRef<number>();
  const lastDetectionTimeRef = useRef<number>(0);

  const {
    minFaceDetectionConfidence = 0.5,
    minFacePresenceConfidence = 0.5,
    minTrackingConfidence = 0.5,
  } = options;

  // MediaPipe Face Landmarker 초기화
  useEffect(() => {
    let isMounted = true;

    const initializeFaceLandmarker = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        if (!isMounted) return;

        const landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU"
          },
          numFaces: 1,
          refineLandmarks: true,
          minFaceDetectionConfidence,
          minFacePresenceConfidence,
          minTrackingConfidence,
          runningMode: "VIDEO"
        });

        if (!isMounted) return;

        setFaceLandmarker(landmarker);
        setIsLoading(false);
      } catch (err) {
        console.error('Face Landmarker 초기화 실패:', err);
        if (isMounted) {
          setError('얼굴 인식 초기화에 실패했습니다.');
          setIsLoading(false);
        }
      }
    };

    initializeFaceLandmarker();

    return () => {
      isMounted = false;
      if (faceLandmarker) {
        faceLandmarker.close();
      }
    };
  }, [minFaceDetectionConfidence, minFacePresenceConfidence, minTrackingConfidence]);

  // 실시간 얼굴 감지
  useEffect(() => {
    if (!faceLandmarker || !isActive || !videoRef.current) {
      return;
    }

    const detectFace = () => {
      const video = videoRef.current;
      if (!video || video.readyState !== 4) {
        animationRef.current = requestAnimationFrame(detectFace);
        return;
      }

      try {
        // 성능 최적화: 30fps로 제한 (약 33ms마다 처리)
        const now = performance.now();
        if (now - lastDetectionTimeRef.current < 33) {
          animationRef.current = requestAnimationFrame(detectFace);
          return;
        }
        lastDetectionTimeRef.current = now;

        const results = faceLandmarker.detectForVideo(video, now);
        
        if (results.faceLandmarks && results.faceLandmarks.length > 0) {
          setLandmarks(results.faceLandmarks[0]);
        } else {
          setLandmarks(null);
        }
      } catch (err) {
        console.error('얼굴 감지 오류:', err);
      }

      animationRef.current = requestAnimationFrame(detectFace);
    };

    detectFace();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [faceLandmarker, isActive, videoRef]);

  return { landmarks, isLoading, error };
};
