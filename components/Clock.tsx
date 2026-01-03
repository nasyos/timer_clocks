
import React, { useState, useEffect } from 'react';
import { getHourlyWeather, HourlyWeatherData } from '../services/weatherService';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [hourlyWeather, setHourlyWeather] = useState<HourlyWeatherData[]>([]);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      setWeatherLoading(true);
      const data = await getHourlyWeather();
      setHourlyWeather(data);
      setWeatherLoading(false);
    };

    // 一度だけ天気情報を取得（自動更新なし）
    fetchWeather();
  }, []);

  // 現在の時刻に最も近い時間の天気を取得
  const getCurrentHourWeather = (): HourlyWeatherData | null => {
    const currentHour = time.getHours();
    return hourlyWeather.find(w => {
      const hour = parseInt(w.time.split(':')[0]);
      return hour === currentHour;
    }) || hourlyWeather[0] || null;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 transition-all duration-500 w-full">
      <div className="text-sm uppercase tracking-[0.3em] opacity-70 mb-2 font-light text-center">
        Current Time
      </div>
      <div className="text-7xl md:text-9xl font-extrabold tracking-tighter text-glow text-center" style={{ minWidth: '400px', fontVariantNumeric: 'tabular-nums' }}>
        {formatTime(time)}
      </div>
      <div className="text-lg md:text-xl mt-4 font-light opacity-80 tracking-widest text-center">
        {formatDate(time)}
      </div>
      <div className="mt-6 w-full max-w-4xl flex flex-col items-center">
        {weatherLoading ? (
          <div className="text-sm opacity-50 animate-pulse text-center">天気情報を取得中...</div>
        ) : hourlyWeather.length > 0 ? (
          <>
            <div className="text-base md:text-lg mb-2 font-light opacity-80 tracking-wide text-center">
              {getCurrentHourWeather()?.weather} {getCurrentHourWeather()?.temperature}°C
            </div>
            <div className="text-xs mb-4 opacity-60 text-center">東京都</div>
            <div className="flex gap-2 overflow-x-auto pb-2 px-2 scrollbar-hide justify-center w-full">
              {hourlyWeather.map((weather, index) => {
                const hour = parseInt(weather.time.split(':')[0]);
                const isCurrentHour = hour === time.getHours();
                return (
                  <div
                    key={index}
                    className={`flex-shrink-0 flex flex-col items-center p-3 rounded-lg min-w-[100px] ${
                      isCurrentHour
                        ? 'bg-white/20 border-2 border-white/40'
                        : 'bg-white/10 border border-white/20'
                    }`}
                  >
                    <div className="text-xs opacity-70 mb-1">{weather.time}</div>
                    <div className="text-sm font-medium mb-1">{weather.weather}</div>
                    <div className="text-base font-bold mb-1">{weather.temperature}°C</div>
                    <div className="text-xs opacity-70">
                      <span className="text-blue-300">☂</span> {weather.precipitationProbability}%
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Clock;
