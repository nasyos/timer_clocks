
export interface WeatherData {
  temperature: number;
  weather: string;
  weatherCode: number;
}

export interface HourlyWeatherData {
  time: string;
  temperature: number;
  weather: string;
  weatherCode: number;
  precipitationProbability: number;
}

// 天気コードを日本語の天気名に変換
const getWeatherName = (code: number): string => {
  const weatherMap: { [key: number]: string } = {
    0: '快晴',
    1: '晴れ',
    2: '一部曇り',
    3: '曇り',
    45: '霧',
    48: '濃霧',
    51: '小雨',
    53: '中程度の雨',
    55: '強い雨',
    56: '凍る小雨',
    57: '凍る強い雨',
    61: '弱い雨',
    63: '中程度の雨',
    65: '強い雨',
    66: '凍る雨',
    67: '凍る強い雨',
    71: '弱い雪',
    73: '中程度の雪',
    75: '強い雪',
    77: '雪粒',
    80: '弱いにわか雨',
    81: '中程度のにわか雨',
    82: '強いにわか雨',
    85: '弱い雪',
    86: '強い雪',
    95: '雷雨',
    96: '雹を伴う雷雨',
    99: '強い雹を伴う雷雨'
  };
  return weatherMap[code] || '不明';
};

export const getWeather = async (): Promise<WeatherData | null> => {
  try {
    // 位置情報を取得（デフォルトは東京）
    let lat = 35.6762;
    let lon = 139.6503;

    // ブラウザの位置情報APIを使用
    if (navigator.geolocation) {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000,
          maximumAge: 600000 // 10分間キャッシュ
        });
      }).catch(() => null);

      if (position) {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
      }
    }

    // Open-Meteo APIを使用（APIキー不要）
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=Asia%2FTokyo`
    );

    if (!response.ok) {
      throw new Error('Weather API request failed');
    }

    const data = await response.json();
    const current = data.current;

    return {
      temperature: Math.round(current.temperature_2m),
      weather: getWeatherName(current.weather_code),
      weatherCode: current.weather_code
    };
  } catch (error) {
    // APIキーがログに出力されないように、エラーメッセージのみを出力
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to fetch weather:", errorMessage);
    return null;
  }
};

export const getHourlyWeather = async (): Promise<HourlyWeatherData[]> => {
  try {
    // 東京都の座標を使用（常に東京の天気を表示）
    const lat = 35.6762;
    const lon = 139.6503;

    // Open-Meteo APIを使用（APIキー不要）- 48時間分の時間ごとの予報を取得（降水確率も含む）
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weather_code,precipitation_probability&timezone=Asia%2FTokyo&forecast_days=2`
    );

    if (!response.ok) {
      throw new Error('Weather API request failed');
    }

    const data = await response.json();
    const hourly = data.hourly;

    const now = new Date();
    const currentHour = now.getHours();
    const currentDate = now.getDate();

    const hourlyWeather: HourlyWeatherData[] = [];
    for (let i = 0; i < hourly.time.length; i++) {
      const timeStr = hourly.time[i];
      const date = new Date(timeStr);
      const hour = date.getHours();
      const dateDay = date.getDate();
      
      // 現在時刻以降のデータのみを取得
      const isFuture = dateDay > currentDate || (dateDay === currentDate && hour >= currentHour);
      
      if (isFuture) {
        hourlyWeather.push({
          time: `${hour.toString().padStart(2, '0')}:00`,
          temperature: Math.round(hourly.temperature_2m[i]),
          weather: getWeatherName(hourly.weather_code[i]),
          weatherCode: hourly.weather_code[i],
          precipitationProbability: hourly.precipitation_probability[i] || 0
        });
      }
    }

    // 2時間おきにフィルタリング（現在時刻の時間から2時間ごと、22時まで）
    const filteredWeather: HourlyWeatherData[] = [];
    
    for (const weather of hourlyWeather) {
      const hour = parseInt(weather.time.split(':')[0]);
      // 22時までに制限
      if (hour > 22) {
        break;
      }
      // 現在時刻の時間から2時間おき（例: 14時、16時、18時...）
      const hoursDiff = hour - currentHour;
      if (filteredWeather.length === 0 || hoursDiff % 2 === 0) {
        filteredWeather.push(weather);
      }
    }

    return filteredWeather;
  } catch (error) {
    // APIキーがログに出力されないように、エラーメッセージのみを出力
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to fetch hourly weather:", errorMessage);
    return [];
  }
};

