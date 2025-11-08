import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { Mode } from '@/types';
import { getWeekSessions } from '@/utils/brushingData';

interface WeeklyCalendarProps {
  mode: Mode;
}

const WeeklyCalendar = ({ mode }: WeeklyCalendarProps) => {
  const [weekOffset, setWeekOffset] = useState(0);

  const getWeekStart = (offset: number) => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) + (offset * 7);
    const weekStart = new Date(today.setDate(diff));
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
  };

  const weekStart = getWeekStart(weekOffset);
  const sessions = getWeekSessions(weekStart);

  const days = ['월', '화', '수', '목', '금', '토', '일'];
  
  const getDateSessions = (dayOffset: number) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + dayOffset);
    date.setHours(0, 0, 0, 0);
    
    return sessions.filter(s => {
      const sessionDate = new Date(s.date);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === date.getTime();
    });
  };

  const formatDateRange = () => {
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);
    return `${weekStart.getMonth() + 1}/${weekStart.getDate()} - ${end.getMonth() + 1}/${end.getDate()}`;
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setWeekOffset(weekOffset - 1)}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h3 className="text-sm font-semibold">{formatDateRange()}</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setWeekOffset(weekOffset + 1)}
          disabled={weekOffset >= 0}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const daySessions = getDateSessions(index);
          const completedCount = daySessions.filter(s => s.completed).length;
          const isToday = weekOffset === 0 && index === new Date().getDay() - 1;

          return (
            <div
              key={day}
              className={`p-2 rounded-lg ${
                isToday ? 'bg-primary/5' : 'bg-muted'
              }`}
            >
              <div className="text-center mb-1">
                <p className="text-xs font-medium">{day}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(weekStart.getTime() + index * 24 * 60 * 60 * 1000).getDate()}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-center">
                    {i < completedCount ? (
                      <CheckCircle2 className="w-3 h-3 text-success" />
                    ) : (
                      <Circle className="w-3 h-3 text-muted-foreground/30" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 text-center text-xs text-muted-foreground">
        이번 주 총 {sessions.filter(s => s.completed).length}회 완료
      </div>
    </Card>
  );
};

export default WeeklyCalendar;
