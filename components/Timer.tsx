
import React from 'react';
import { TimerState } from '../types';

interface TimerProps {
  timerState: TimerState;
  setTimerState: React.Dispatch<React.SetStateAction<TimerState>>;
}

const Timer: React.FC<TimerProps> = ({ timerState, setTimerState }) => {
  const { minutesInput, remainingSeconds, totalSeconds, isActive } = timerState;

  const toggleTimer = () => {
    if (!isActive) {
      if (remainingSeconds === 0) {
        handleReset();
      }
    }
    setTimerState((prev) => ({ ...prev, isActive: !prev.isActive }));
  };

  const handleReset = () => {
    const seconds = minutesInput * 60;
    setTimerState({
      ...timerState,
      remainingSeconds: seconds,
      totalSeconds: seconds,
      isActive: false
    });
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    if (!isActive) {
      const seconds = val * 60;
      setTimerState({
        ...timerState,
        minutesInput: val,
        remainingSeconds: seconds,
        totalSeconds: seconds
      });
    } else {
      setTimerState({
        ...timerState,
        minutesInput: val
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isActive && remainingSeconds > 0) {
      toggleTimer();
    }
  };

  const formatDisplay = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progress = totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 0;

  return (
    <div className="glass rounded-3xl p-8 w-full max-w-md mx-auto shadow-2xl flex flex-col items-center">
      <div className="text-sm uppercase tracking-widest opacity-60 mb-6">Timer</div>
      
      <div className="relative w-48 h-48 flex items-center justify-center mb-8">
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-white/10"
          />
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={553}
            strokeDashoffset={553 - (553 * progress) / 100}
            className="text-blue-400 transition-all duration-1000 ease-linear"
          />
        </svg>
        <span className="text-5xl font-mono font-bold tracking-tight">
          {formatDisplay(remainingSeconds)}
        </span>
      </div>

      <div className="flex gap-4 w-full mb-6">
        <div className="flex-1">
          <label className="block text-xs uppercase opacity-50 mb-1 ml-1">Set Minutes</label>
          <input
            type="number"
            value={minutesInput}
            onChange={handleMinutesChange}
            onKeyDown={handleKeyDown}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            disabled={isActive}
          />
        </div>
      </div>

      <div className="flex gap-3 w-full">
        <button
          onClick={toggleTimer}
          className={`flex-1 py-3 rounded-xl font-bold transition-all ${
            isActive 
              ? 'bg-yellow-500/80 hover:bg-yellow-500 text-black' 
              : 'bg-white text-black hover:bg-blue-400 hover:text-white'
          }`}
        >
          {isActive ? '一時停止' : '開始'}
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
        >
          リセット
        </button>
      </div>
    </div>
  );
};

export default Timer;
