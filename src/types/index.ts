export type Mode = 'kids' | 'learning' | 'normal';

export interface BrushSession {
  id: string;
  date: Date;
  time: 'morning' | 'afternoon' | 'evening';
  completed: boolean;
  duration: number; // in seconds
  points: number;
}

export interface WeekData {
  weekStart: Date;
  sessions: BrushSession[];
}

export interface UserProgress {
  totalPoints: number;
  currentStreak: number;
  mode: Mode;
}
