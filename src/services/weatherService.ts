export interface AgronomicWeather {
  temperature: string;
  humidity: string;
  condition: string;
  riskAlert: string;
  dewPoint: string;
  windSpeed: string;
}

export function getAgronomicWeatherContext(location: string = 'Local Farm Region'): AgronomicWeather {
  // Simulates real-time local microclimate agronomic metrics based on region
  const locLower = location.toLowerCase();

  if (locLower.includes('coimbatore') || locLower.includes('tamil nadu') || locLower.includes('south')) {
    return {
      temperature: '31°C',
      humidity: '82%',
      condition: 'Tropical Humid / Overcast',
      riskAlert: 'HIGH RISK: High humidity (>80%) accelerates fungal spore proliferation. Avoid evening leaf watering.',
      dewPoint: '27°C',
      windSpeed: '12 km/h NE',
    };
  } else if (locLower.includes('punjab') || locLower.includes('delhi') || locLower.includes('north')) {
    return {
      temperature: '28°C',
      humidity: '74%',
      condition: 'Partly Cloudy / Moderate Dew',
      riskAlert: 'MODERATE RISK: Morning dew formation may promote rust fungal pustules. Spray post-dew evaporation.',
      dewPoint: '22°C',
      windSpeed: '8 km/h NW',
    };
  }

  return {
    temperature: '29°C',
    humidity: '78%',
    condition: 'Humid Subtropical',
    riskAlert: 'ELEVATED FUNGAL RISK: Warm daytime temperature combined with evening moisture favors foliar lesions.',
    dewPoint: '24°C',
    windSpeed: '10 km/h East',
  };
}
