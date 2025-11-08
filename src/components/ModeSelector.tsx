import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Sparkles, Users } from "lucide-react";
import { Mode } from "@/types";
import { cn } from "@/lib/utils";

interface ModeSelectorProps {
  onSelectMode: (mode: Mode) => void;
}

const ModeSelector = ({ onSelectMode }: ModeSelectorProps) => {
  const modes = [
    {
      value: "kids" as Mode,
      icon: Sparkles,
      label: "키즈 모드",
      description: "놀이형 양치 영상과 응원 메시지",
      color: "accent",
    },
    {
      value: "learning" as Mode,
      icon: BookOpen,
      label: "학습 모드",
      description: "명언 영어 · 오늘의 영어 한 문장 외우기",
      color: "secondary",
    },
    {
      value: "normal" as Mode,
      icon: Users,
      label: "일반 모드",
      description: "건강 정보와 함께하는 루틴 관리",
      color: "primary",
    },
  ];

  const colorClasses = {
    kids: "hover:border-accent",
    learning: "hover:border-secondary",
    normal: "hover:border-primary",
  };

  const buttonClasses = {
    kids: "bg-accent text-accent-foreground hover:opacity-90",
    learning: "bg-secondary text-secondary-foreground hover:opacity-90",
    normal: "bg-primary text-primary-foreground hover:opacity-90",
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="mb-12 text-center">
        <h1 className="mb-3 text-5xl font-bold tracking-tight">Chika Chika</h1>
        <p className="text-lg text-muted-foreground">양치 습관을 만드는 가장 쉬운 방법</p>
      </div>

      <div className="grid w-full max-w-4xl gap-6 md:grid-cols-3">
        {modes.map((modeItem) => {
          const Icon = modeItem.icon;
          return (
            <Card
              key={modeItem.value}
              className={cn(
                "group cursor-pointer p-8 transition-all hover:shadow-lg",
                colorClasses[modeItem.value]
              )}
              onClick={() => onSelectMode(modeItem.value)}
            >
              <div className="flex flex-col items-center space-y-6 text-center">
                <Icon className="h-12 w-12 text-muted-foreground/60 transition-colors group-hover:text-foreground" />
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">{modeItem.label}</h2>
                  <p className="text-sm text-muted-foreground">
                    {modeItem.description}
                  </p>
                </div>
                <Button
                  className={cn(
                    "w-full transition-opacity",
                    buttonClasses[modeItem.value]
                  )}
                  size="lg"
                >
                  시작하기
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ModeSelector;
