import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, X } from "lucide-react";
import { Mode } from "@/types";
import {
  getEncouragementMessage,
  saveBrushSession,
  addPoints,
  getTimeOfDay,
} from "@/utils/brushingData";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface BrushingTimerProps {
  mode: Mode;
  onComplete: () => void;
  onCancel: () => void;
}

const TOTAL_SECONDS = 180; // 3 minutes
const POINTS_PER_SESSION = 10;

// Kids mode: Fun tooth brushing songs and animations
const buildYouTubeEmbedUrl = (id: string) =>
  `https://www.youtube.com/embed/${id}`;

const kidsVideos = [
  { id: "wxwsJZYnqWc", title: "뽀로로 치카치카 양치 노래" },
  { id: "WNmCm4oyrkY", title: "핑크퐁 치카치카 양치 송" },
  { id: "xhiPZ8T_rDo", title: "타요와 함께하는 양치시간" },
  { id: "Vgcb4vZJ1Vc", title: "아기상어 양치 노래" },
  { id: "tq-XDxaKXGA", title: "꼬마버스 타요 양치송" },
  { id: "IcS4y9MzQ_8", title: "핑크퐁 양치 시간 챈트" },
  { id: "43Nm-h9OLaY", title: "슈퍼윙스 신나는 양치송" },
  { id: "YQLh0szu3Bs", title: "코코몽 깨끗한 양치송" },
];

// 저작권 없는 무료 음악 - YouTube Audio Library
const studyMusic = [
  {
    youtubeId: "jfKfPfyJRdk",
    title: "lofi hip hop radio",
    description: "집중할 수 있는 부드러운 배경 음악",
    source: "Lofi Girl",
  },
  {
    youtubeId: "5qap5aO4i9A",
    title: "Relaxing Jazz Piano",
    description: "잔잔한 재즈 피아노",
    source: "Cafe Music BGM",
  },
  {
    youtubeId: "lTRiuFIWV54",
    title: "Study Music",
    description: "학습을 위한 배경 음악",
    source: "Study Music Project",
  },
];

const normalVideos = [
  { id: "bk7McNUjWgw", title: "3분 뉴스 요약" },
  { id: "ZSt9tm3RoUU", title: "TED-Ed 3분 과학" },
  { id: "HEYbgyL5n1g", title: "3분 자연 다큐" },
  { id: "1ZYbU82GVz4", title: "건강한 생활 습관" },
  { id: "sTJ7AzBIJoI", title: "3분 시사 요약" },
];

const kidsContent = [
  "🦷 이가 깨끗해지고 있어요!",
  "🌟 반짝반짝 빛나는 이!",
  "🎵 치카치카 신나는 노래!",
  "🦸 양치 히어로가 되어가요!",
  "💎 보물같은 하얀 이!",
  "🌈 무지개처럼 환한 미소!",
];

const normalContent = [
  "올바른 양치 방법: 칫솔모를 45도 각도로 잡아주세요",
  "치아 표면뿐만 아니라 잇몸 경계선도 부드럽게 닦아주세요",
  "안쪽 면도 꼼꼼히 닦는 것이 중요합니다",
  "혀도 부드럽게 닦아 구취를 예방하세요",
  "하루 3번, 식후 3분 이내, 3분 동안이 기본입니다",
  "정기적인 치과 검진도 잊지 마세요",
];

const learningQuotes = [
  {
    english: "The future depends on what you do today.",
    korean: "미래는 당신이 오늘 무엇을 하느냐에 달려 있다.",
    author: "Mahatma Gandhi",
  },
  {
    english: "Success is the sum of small efforts, repeated day in and day out.",
    korean: "성공은 반복되는 작은 노력들의 합이다.",
    author: "Robert Collier",
  },
  {
    english: "Learning is a treasure that will follow its owner everywhere.",
    korean: "배움은 주인을 평생 따라다니는 보물이다.",
    author: "Chinese Proverb",
  },
  {
    english: "Dream big and dare to fail.",
    korean: "크게 꿈꾸고 도전하라.",
    author: "Norman Vaughan",
  },
];

const learningSentences = [
  {
    english: "Every day is a new chance to smile brighter.",
    korean: "매일은 더 환하게 웃을 새로운 기회다.",
    tip: "미소와 함께 자신감을 높여요.",
  },
  {
    english: "Healthy habits start with one mindful moment.",
    korean: "건강한 습관은 한 번의 의식적인 순간에서 시작된다.",
    tip: "타이머와 함께 집중해 보세요.",
  },
  {
    english: "I celebrate small wins to reach big goals.",
    korean: "나는 작은 성취를 축하하며 큰 목표에 다가간다.",
    tip: "양치 후 성취감을 기록해 보세요.",
  },
  {
    english: "Consistency turns routines into results.",
    korean: "지속성이 루틴을 결과로 바꾼다.",
    tip: "매일 같은 시간에 연습해 보세요.",
  },
];

const BrushingTimer = ({ mode, onComplete, onCancel }: BrushingTimerProps) => {
  const normalizedMode = useMemo<Mode>(() => {
    return ((mode as string) === "study" ? "learning" : mode) as Mode;
  }, [mode]);
  const [seconds, setSeconds] = useState(TOTAL_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [contentIndex, setContentIndex] = useState(0);
  const { toast } = useToast();
  const isLearningMode = normalizedMode === "learning";

  // Select random video on component mount
  const videoSource = useMemo(() => {
    if (isLearningMode) {
      return null;
    }
    const list = normalizedMode === "kids" ? kidsVideos : normalVideos;
    return list[Math.floor(Math.random() * list.length)];
  }, [isLearningMode, normalizedMode]);

  const content = useMemo(() => {
    if (normalizedMode === "kids") return kidsContent;
    if (normalizedMode === "normal") return normalContent;
    return [];
  }, [normalizedMode]);
  const hasRotatingContent = content.length > 0;

  const learningMaterial = useMemo(() => {
    if (!isLearningMode) return null;
    const quote =
      learningQuotes[Math.floor(Math.random() * learningQuotes.length)];
    const sentence =
      learningSentences[Math.floor(Math.random() * learningSentences.length)];
    return { quote, sentence };
  }, [isLearningMode]);

  const selectedStudyMusic = useMemo(() => {
    if (!isLearningMode) return null;
    return studyMusic[Math.floor(Math.random() * studyMusic.length)];
  }, [isLearningMode]);

  const progress = ((TOTAL_SECONDS - seconds) / TOTAL_SECONDS) * 100;

  const handleComplete = useCallback(() => {
    const session = {
      id: Date.now().toString(),
      date: new Date(),
      time: getTimeOfDay(),
      completed: true,
      duration: TOTAL_SECONDS,
      points: POINTS_PER_SESSION,
    };

    saveBrushSession(session);
    addPoints(POINTS_PER_SESSION);

    toast({
      title: getEncouragementMessage(normalizedMode, true),
      description: `${POINTS_PER_SESSION} 포인트를 획득했어요!`,
    });

    onComplete();
  }, [normalizedMode, toast, onComplete]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, seconds, handleComplete]);

  useEffect(() => {
    if (!hasRotatingContent) {
      setContentIndex(0);
      return;
    }
    const contentInterval = setInterval(() => {
      setContentIndex((prev) => (prev + 1) % content.length);
    }, 5000);

    return () => clearInterval(contentInterval);
  }, [content.length, hasRotatingContent]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const buttonAppearance: Record<
    Mode,
    {
      variant: "default" | "outline" | "ghost" | "kids";
      className: string;
    }
  > = {
    kids: {
      variant: "kids",
      className: "min-w-32 bg-accent text-accent-foreground hover:opacity-90",
    },
    learning: {
      variant: "outline",
      className: "min-w-32 bg-secondary text-secondary-foreground hover:opacity-90",
    },
    normal: {
      variant: "outline",
      className: "min-w-32 bg-primary text-primary-foreground hover:opacity-90",
    },
  };
  const pauseButtonClass = {
    kids: "min-w-32 border-accent/20 hover:bg-accent/10 text-accent",
    learning: "min-w-32 border-secondary/20 hover:bg-secondary/10 text-secondary",
    normal: "min-w-32 border-primary/20 hover:bg-primary/10 text-primary",
  } as const;
  const contentCardClass: Record<Mode, string> = {
    kids: "bg-accent/5 border-accent/10",
    learning: "bg-secondary/5 border-secondary/10",
    normal: "bg-primary/5 border-primary/10",
  };
  const learningCardClass = {
    quote: "bg-secondary/5 border-secondary/10",
    sentence: "bg-secondary/10 border-secondary/20",
  };
  const timerTitle = isLearningMode ? "학습 타이머" : "양치 타이머";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <Card className="w-full max-w-4xl p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{timerTitle}</h2>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Mode-specific primary content */}
          {isLearningMode ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Card className={cn("p-4", learningCardClass.quote)}>
                <h3 className="text-sm font-semibold text-muted-foreground">
                  명언 영어
                </h3>
                <p className="mt-2 text-lg font-bold text-foreground">
                  “{learningMaterial?.quote.english}”
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {learningMaterial?.quote.korean}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  — {learningMaterial?.quote.author}
                </p>
              </Card>
              <Card className={cn("p-4", learningCardClass.sentence)}>
                <h3 className="text-sm font-semibold text-muted-foreground">
                  오늘의 영어 한문장
                </h3>
                <p className="mt-2 text-lg font-bold text-primary">
                  {learningMaterial?.sentence.english}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {learningMaterial?.sentence.korean}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Tip: {learningMaterial?.sentence.tip}
                </p>
              </Card>
              <Card className="md:col-span-2 border border-[#bae6fd] bg-[#e0f2fe] p-4">
                <h3 className="text-sm font-semibold text-[#1d4ed8]">
                  잔잔한 경음악
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {selectedStudyMusic?.description}
                </p>
                <div className="mt-3 flex flex-col gap-3">
                  {selectedStudyMusic && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-[#c7d2fe] bg-[#fff]">
                      <iframe
                        key={selectedStudyMusic.youtubeId}
                        src={`${buildYouTubeEmbedUrl(selectedStudyMusic.youtubeId)}?autoplay=${isRunning ? 1 : 0}&mute=0&controls=1&rel=0&modestbranding=1&playsinline=1&loop=1&playlist=${selectedStudyMusic.youtubeId}`}
                        title={selectedStudyMusic.title}
                        aria-label="학습에 집중할 수 있는 잔잔한 배경 음악"
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <div>
                      <p className="text-sm font-medium text-[#0f172a]">
                        {selectedStudyMusic?.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        저작권 없는 무료 음악 ({selectedStudyMusic?.source})으로 제공됩니다.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ) : videoSource ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <iframe
                key={videoSource.id}
                src={`${buildYouTubeEmbedUrl(videoSource.id)}?autoplay=${isRunning ? 1 : 0}&mute=0&controls=1&rel=0&modestbranding=1`}
                title="양치 영상"
                aria-label={normalizedMode === "kids" ? "아이들을 위한 양치 영상" : "양치 시간 정보"}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          ) : (
            <Card
              className={cn(
                "p-4 text-center",
                contentCardClass[normalizedMode],
              )}
            >
              <p className="text-sm text-muted-foreground">
                잠시 후 다시 시도해 주세요. 영상을 불러오지 못했습니다.
              </p>
            </Card>
          )}

          {/* Timer Display */}
          <div className="text-center">
            <div className="mb-3 text-5xl font-bold md:text-6xl">
              {formatTime(seconds)}
            </div>
            <Progress value={progress} className="mb-2 h-3" />
            <p className="text-sm text-muted-foreground">
              {Math.round(progress)}% 완료
            </p>
          </div>

          {/* Motivational / Learning Content */}
          {hasRotatingContent ? (
            <Card
              className={cn(
                "p-4 text-center",
                contentCardClass[normalizedMode],
              )}
            >
              <p className="text-sm">{content[contentIndex]}</p>
            </Card>
          ) : (
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">
                타이머와 함께 문장을 소리 내어 읽고, 종료 후에는 다시 한 번
                반복하며 기억을 강화해 보세요.
              </p>
            </Card>
          )}

          {/* Control Buttons */}
          <div className="flex justify-center gap-3">
            {!isRunning ? (
              <Button
                variant={buttonAppearance[normalizedMode].variant}
                onClick={handleStart}
                className={buttonAppearance[normalizedMode].className}
              >
                <Play className="mr-2 h-4 w-4" />
                시작
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handlePause}
                className={pauseButtonClass[normalizedMode]}
              >
                <Pause className="mr-2 h-4 w-4" />
                일시정지
              </Button>
            )}
          </div>

          {/* Final Encouragement */}
          {seconds < 60 && seconds > 0 && (
            <p className="text-center text-sm text-muted-foreground">
              {getEncouragementMessage(normalizedMode, false)}
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default BrushingTimer;
