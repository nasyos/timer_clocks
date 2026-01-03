
import React, { useState, useEffect } from 'react';
import Clock from './components/Clock';
import Timer from './components/Timer';
import { TimerState } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'clock' | 'timer'>('clock');
  const [timerState, setTimerState] = useState<TimerState>({
    remainingSeconds: 600,
    totalSeconds: 600,
    isActive: false,
    minutesInput: 10
  });

  // タイマーのカウントダウン処理
  useEffect(() => {
    let interval: number | undefined;
    if (timerState.isActive && timerState.remainingSeconds > 0) {
      interval = window.setInterval(() => {
        setTimerState((prev) => ({
          ...prev,
          remainingSeconds: prev.remainingSeconds - 1
        }));
      }, 1000);
    } else if (timerState.remainingSeconds === 0 && timerState.isActive) {
      setTimerState((prev) => ({ ...prev, isActive: false }));
      alert("時間になりました！");
    }
    return () => clearInterval(interval);
  }, [timerState.isActive, timerState.remainingSeconds]);

  // Background Image (Serene Lake)
  const bgUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80";

  return (
    <div className="relative h-screen w-screen overflow-hidden flex flex-col">
      {/* Background Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] hover:scale-110"
        style={{ backgroundImage: `url(${bgUrl})` }}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-brightness-75" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 w-full">
        {view === 'clock' ? (
          <div className="animate-fadeIn w-full">
            <Clock timerState={timerState} />
          </div>
        ) : (
          <div className="animate-fadeIn w-full">
            <Timer timerState={timerState} setTimerState={setTimerState} />
          </div>
        )}
      </main>

      {/* Navigation Footer */}
      <nav className="relative z-10 h-24 flex items-center justify-center gap-8 mb-4">
        <button 
          onClick={() => setView('clock')}
          className={`flex flex-col items-center transition-all ${view === 'clock' ? 'scale-110 opacity-100' : 'opacity-40 hover:opacity-70'}`}
        >
          <span className="text-sm uppercase tracking-widest font-bold">Clock</span>
          {view === 'clock' && <div className="h-1 w-8 bg-white mt-1 rounded-full animate-pulse" />}
        </button>
        <button 
          onClick={() => setView('timer')}
          className={`flex flex-col items-center transition-all ${view === 'timer' ? 'scale-110 opacity-100' : 'opacity-40 hover:opacity-70'}`}
        >
          <span className="text-sm uppercase tracking-widest font-bold">Timer</span>
          {view === 'timer' && <div className="h-1 w-8 bg-white mt-1 rounded-full animate-pulse" />}
        </button>
      </nav>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
};

export default App;
