import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mode } from '@/types';
import { useAuth } from '@/context/AuthContext';
import ModeSelector from '@/components/ModeSelector';
import Dashboard from '@/components/Dashboard';
import BrushingTimer from '@/components/BrushingTimer';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';
import { getMode, setMode as saveModeToStorage } from '@/utils/brushingData';

type View = 'mode-select' | 'dashboard' | 'timer';

const Index = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      {/* Header with user profile */}
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Brush Buddy</h1>
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.picture} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center space-x-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.picture} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="w-full text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>로그아웃</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      {/* Main content */}
      <main>
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
      </main>
    </div>
  );
};

export default Index;
