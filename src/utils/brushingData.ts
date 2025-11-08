import { BrushSession, Mode } from "@/types";

const STORAGE_KEY = 'chika-chika-sessions';
const POINTS_KEY = 'chika-chika-points';
const MODE_KEY = 'chika-chika-mode';

export const saveBrushSession = (session: BrushSession) => {
  const sessions = getBrushSessions();
  sessions.push(session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
};

export const getBrushSessions = (): BrushSession[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  return (JSON.parse(data) as Array<Omit<BrushSession, 'date'> & { date: string }>).map((s) => ({
    ...s,
    date: new Date(s.date),
  }));
};

export const getTodaySessions = (): BrushSession[] => {
  const sessions = getBrushSessions();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return sessions.filter(s => {
    const sessionDate = new Date(s.date);
    sessionDate.setHours(0, 0, 0, 0);
    return sessionDate.getTime() === today.getTime();
  });
};

export const getWeekSessions = (weekStart: Date): BrushSession[] => {
  const sessions = getBrushSessions();
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  
  return sessions.filter(s => {
    const sessionDate = new Date(s.date);
    return sessionDate >= weekStart && sessionDate < weekEnd;
  });
};

export const getTotalPoints = (): number => {
  const points = localStorage.getItem(POINTS_KEY);
  return points ? parseInt(points) : 0;
};

export const addPoints = (points: number) => {
  const current = getTotalPoints();
  localStorage.setItem(POINTS_KEY, (current + points).toString());
};

export const getMode = (): Mode => {
  const mode = localStorage.getItem(MODE_KEY);
  if (mode === "kids" || mode === "learning" || mode === "normal") {
    return mode;
  }
  return "normal";
};

export const setMode = (mode: Mode) => {
  localStorage.setItem(MODE_KEY, mode);
};

export const getTimeOfDay = (): "morning" | "afternoon" | "evening" => {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
};

export const getEncouragementMessage = (
  mode: Mode,
  completed: boolean,
): string => {
  const kidsMessages = {
    success: [
      "🎉 와! 정말 잘했어요!",
      "✨ 최고예요! 이가 반짝반짝!",
      "🌟 완벽해요! 엄청난 칫솔 마스터!",
      "🦷 치카치카! 깨끗한 이!",
    ],
    encourage: [
      "💪 거의 다 왔어요! 조금만 더!",
      "🎈 멋져요! 계속해봐요!",
      "⭐ 훌륭해요! 포기하지 마세요!",
    ],
  };
  
  const normalMessages = {
    success: [
      "✅ 완벽합니다! 깨끗한 치아를 유지하셨네요!",
      "🌟 훌륭해요! 3분 달성!",
      "💚 잘하셨습니다! 건강한 습관 형성 중!",
      "✨ 멋집니다! 구강 건강 관리 성공!",
    ],
    encourage: [
      "💪 좋아요! 조금만 더 힘내세요!",
      "⏰ 거의 다 왔어요!",
      "📈 잘하고 계십니다!",
    ],
  };

  const learningMessages = {
    success: [
      "📘 오늘의 문장을 완벽하게 외웠어요!",
      "✨ 학습 모드 클리어! 한 문장이 더 익숙해졌어요.",
      "🎯 꾸준함이 실력을 만듭니다. 훌륭해요!",
      "🌟 영어 감각이 점점 살아나고 있어요!",
    ],
    encourage: [
      "🧠 조금만 더 집중하면 완벽해져요!",
      "🔁 반복이 실력을 만듭니다. 계속해 볼까요?",
      "📚 타이머와 함께 문장을 소리 내어 읽어 보세요.",
    ],
  };

  const messageMap = {
    kids: kidsMessages,
    normal: normalMessages,
    learning: learningMessages,
  } as const;
  
  const messages = messageMap[mode];
  const category = completed ? messages.success : messages.encourage;
  
  return category[Math.floor(Math.random() * category.length)];
};
