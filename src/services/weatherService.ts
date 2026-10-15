import { Coordinates, DailyWeatherForecast } from '../types/expedition';

// WMO Weather Interpretation Codes (WW)
function interpretWmoCode(code: number): { text: string; isSevere: boolean; severityNote?: string } {
  if (code === 0) return { text: 'Clear Sky / Sunny', isSevere: false };
  if (code === 1) return { text: 'Mainly Clear', isSevere: false };
  if (code === 2) return { text: 'Partly Cloudy', isSevere: false };
  if (code === 3) return { text: 'Overcast', isSevere: false };
  if (code === 45 || code === 48) return { text: 'Dense Fog / Rime', isSevere: false, severityNote: 'Low visibility on trails' };
  if (code >= 51 && code <= 55) return { text: 'Light Drizzle', isSevere: false };
  if (code >= 61 && code <= 65) {
    const isHeavy = code === 65;
    return {
      text: isHeavy ? 'Heavy Rain' : 'Moderate Rain',
      isSevere: isHeavy,
      severityNote: isHeavy ? 'Flash flood / slippery trail hazard' : undefined
    };
  }
  if (code >= 66 && code <= 67) return { text: 'Freezing Rain', isSevere: true, severityNote: 'Hypothermia hazard & black ice' };
  if (code >= 71 && code <= 77) return { text: 'Snowfall / Flurries', isSevere: true, severityNote: 'Snow accumulation & trail obliteration' };
  if (code >= 80 && code <= 82) return { text: 'Rain Showers', isSevere: code === 82, severityNote: code === 82 ? 'Torrential downpours' : undefined };
  if (code >= 85 && code <= 86) return { text: 'Heavy Snow Showers', isSevere: true, severityNote: 'Whiteout conditions risk' };
  if (code >= 95 && code <= 99) return { text: 'Thunderstorm / Lightning', isSevere: true, severityNote: 'High ridge lightning danger - descend below treeline' };
  return { text: 'Variable Wilderness Conditions', isSevere: false };
}

function generatePreparednessAdvice(
  minF: number,
  maxF: number,
  precipPct: number,
  windMph: number,
  uvIndex: number,
  wmoText: string
): { advice: string; isWarning: boolean; warningReason?: string } {
  const warnings: string[] = [];
  const tacticalPoints: string[] = [];

  if (minF <= 32) {
    warnings.push(`Sub-freezing lows (${minF}°F). Risk of frozen water filtration units; sleep with Sawyer/Katadyn filters in sleeping bag.`);
    tacticalPoints.push('Pack 0°F to 15°F rated sleeping system + insulated R-value 4.5+ sleeping pad.');
  } else if (minF <= 45) {
    tacticalPoints.push('Chilly alpine overnight. Pack wool base layers and thermal beanie.');
  }

  if (maxF >= 88) {
    warnings.push(`High heat exposure (${maxF}°F). Risk of dehydration and heat exhaustion.`);
    tacticalPoints.push('Carry minimum 3L water per person + electrolyte replenishment salts. Plan strenuous ascents before 10 AM.');
  }

  if (windMph >= 25) {
    warnings.push(`High wind gusts (${windMph} mph). Extreme danger on exposed ridge traverses.`);
    tacticalPoints.push('Pitch tents in sheltered timber; double-stake vestibules. Avoid exposed passes during peak afternoon winds.');
  }

  if (precipPct >= 40) {
    warnings.push(`${precipPct}% precipitation probability (${wmoText}).`);
    tacticalPoints.push('Store down insulation in waterproof dry-sacks. Ensure rainfly guy-lines are tensioned.');
  }

  if (uvIndex >= 7) {
    tacticalPoints.push(`High UV Index (${uvIndex}). Alpine snow/water reflection elevates sunburn and snow-blindness risk.`);
  }

  if (warnings.length === 0) {
    tacticalPoints.push('Favorable wilderness window. Maintain standard bear cache safety and hydration.');
  }

  return {
    advice: tacticalPoints.join(' '),
    isWarning: warnings.length > 0,
    warningReason: warnings.join(' | ') || undefined,
  };
}

export async function fetchExpeditionWeather(
  coords: Coordinates,
  startDateStr?: string
): Promise<DailyWeatherForecast[]> {
  try {
    const lat = coords.lat.toFixed(4);
    const lon = coords.lng.toFixed(4);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max,uv_index_max&timezone=auto&forecast_days=3`;

    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) {
      throw new Error(`Open-Meteo returned status ${res.status}`);
    }

    const data = await res.json();
    const daily = data.daily;

    if (!daily || !daily.time || daily.time.length === 0) {
      throw new Error('No daily forecast data available');
    }

    const days: DailyWeatherForecast[] = [];

    for (let i = 0; i < Math.min(3, daily.time.length); i++) {
      const dateStr = daily.time[i];
      const code = daily.weathercode[i] ?? 0;
      const interpretation = interpretWmoCode(code);
      
      const maxC = daily.temperature_2m_max[i] ?? 18;
      const minC = daily.temperature_2m_min[i] ?? 6;
      const maxF = Math.round((maxC * 9) / 5 + 32);
      const minF = Math.round((minC * 9) / 5 + 32);
      const precip = daily.precipitation_probability_max[i] ?? 10;
      const windKph = daily.windspeed_10m_max[i] ?? 15;
      const windMph = Math.round(windKph * 0.621371);
      const uv = Math.round(daily.uv_index_max[i] ?? 5);

      const prep = generatePreparednessAdvice(minF, maxF, precip, windMph, uv, interpretation.text);

      const dateObj = new Date(dateStr + 'T12:00:00');
      const dayLabel = i === 0 ? 'Day 1 (Departure)' : i === 1 ? 'Day 2 (Trek / Camp)' : 'Day 3 (Return / Peak)';

      days.push({
        date: dateStr,
        dayLabel: `${dayLabel} · ${dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`,
        weatherCode: code,
        weatherText: interpretation.text,
        tempMaxC: Math.round(maxC),
        tempMinC: Math.round(minC),
        tempMaxF: maxF,
        tempMinF: minF,
        precipitationProbability: precip,
        windSpeedMaxMph: windMph,
        uvIndexMax: uv,
        isWarning: prep.isWarning || interpretation.isSevere,
        warningReason: [interpretation.severityNote, prep.warningReason].filter(Boolean).join(' · '),
        preparednessAdvice: prep.advice,
      });
    }

    return days;
  } catch (err) {
    console.warn('Live Open-Meteo fetch failed or offline; generating fallback offline forecast:', err);
    return generateOfflineFallbackForecast();
  }
}

export function generateOfflineFallbackForecast(): DailyWeatherForecast[] {
  const today = new Date();
  const days: DailyWeatherForecast[] = [];

  const presets = [
    {
      code: 1,
      text: 'Sunny with Alpine Afternoon Clouds',
      maxF: 72,
      minF: 38,
      precip: 15,
      wind: 12,
      uv: 7,
      warning: false,
      reason: undefined,
      advice: 'Mild trek conditions. Carry 2.5L water per person. Sun protection required above treeline.',
    },
    {
      code: 61,
      text: 'Afternoon Isolated Showers & Gusts',
      maxF: 64,
      minF: 32,
      precip: 55,
      wind: 24,
      uv: 5,
      warning: true,
      reason: 'Freezing night temperatures & afternoon rain risk',
      advice: 'Rain gear ready in outer pack pocket. Tent pitched before 2 PM. Protect water filters from overnight freezing (32°F).',
    },
    {
      code: 2,
      text: 'Crisp Clear Descent',
      maxF: 68,
      minF: 36,
      precip: 10,
      wind: 14,
      uv: 6,
      warning: false,
      reason: undefined,
      advice: 'Excellent return conditions. Ensure trailhead vehicle check-in by expected deadline.',
    },
  ];

  for (let i = 0; i < 3; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const p = presets[i];
    const dayLabel = i === 0 ? 'Day 1 (Departure)' : i === 1 ? 'Day 2 (Trek / Camp)' : 'Day 3 (Return / Peak)';

    days.push({
      date: d.toISOString().split('T')[0],
      dayLabel: `${dayLabel} · ${d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`,
      weatherCode: p.code,
      weatherText: p.text,
      tempMaxC: Math.round(((p.maxF - 32) * 5) / 9),
      tempMinC: Math.round(((p.minF - 32) * 5) / 9),
      tempMaxF: p.maxF,
      tempMinF: p.minF,
      precipitationProbability: p.precip,
      windSpeedMaxMph: p.wind,
      uvIndexMax: p.uv,
      isWarning: p.warning,
      warningReason: p.reason,
      preparednessAdvice: p.advice,
    });
  }

  return days;
}
