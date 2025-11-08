import { useState, useEffect } from 'react';
import { Mode } from '@/types';
import ModeSelector from '@/components/ModeSelector';
import Dashboard from '@/components/Dashboard';
import BrushingTimer from '@/components/BrushingTimer';
import { getMode, setMode as saveModeToStorage } from '@/utils/brushingData';

type View = 'mode-select' | 'dashboard' | 'timer';

const Index = () => {
  const [view, setView] = useState<View>('mode-select');
  const [mode, setMode] = useState<Mode>('normal');

  useEffect(() => {
    const savedMode = getMode();
    if (savedMode) {
      setMode(savedMode);
      setView('dashboard');
    }
  }, []);

  const handleSelectMode = (selectedMode: Mode) => {
    setMode(selectedMode);
    saveModeToStorage(selectedMode);
    setView('dashboard');
  };

  const handleStartBrushing = () => {
    setView('timer');
  };

  const handleTimerComplete = () => {
    setView('dashboard');
  };

  const handleTimerCancel = () => {
    setView('dashboard');
  };

  const handleSwitchMode = (targetMode: Mode) => {
    setMode(targetMode);
    saveModeToStorage(targetMode);
  };

  return (
    <>
      {view === 'mode-select' && (
        <ModeSelector onSelectMode={handleSelectMode} />
      )}
      {view === 'dashboard' && (
        <Dashboard
          mode={mode}
          onStartBrushing={handleStartBrushing}
          onSwitchMode={handleSwitchMode}
        />
      )}
      {view === 'timer' && (
        <BrushingTimer
          mode={mode}
          onComplete={handleTimerComplete}
          onCancel={handleTimerCancel}
        />
      )}
    </>
  );
};

export default Index;
