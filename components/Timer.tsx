
import React, { useState, useEffect, useCallback, useRef } from 'react';

const Timer: React.FC = () => {
  const [minutesInput, setMinutesInput] = useState<number>(10);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(600);
  const [totalSeconds, setTotalSeconds] = useState<number>(600);
  const [isActive, setIsActive] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let interval: number | undefined;
    if (isActive && remainingSeconds > 0) {
      interval = window.setInterval(() => {
        setRemainingSeconds((prev) => prev - 1);
      }, 1000);
    } else if (remainingSeconds === 0 && isActive) {
      setIsActive(false);
      // Simple beep or notification logic could go here
      alert("時間になりました！");
    }
    return () => clearInterval(interval);
  }, [isActive, remainingSeconds]);

  const toggleTimer = () => {
    if (!isActive) {
      if (remainingSeconds === 0) {
        handleReset();
      }
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    const seconds = minutesInput * 60;
    setRemainingSeconds(seconds);
    setTotalSeconds(seconds);
    setIsActive(false);
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    setMinutesInput(val);
    if (!isActive) {
      setRemainingSeconds(val * 60);
      setTotalSeconds(val * 60);
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
