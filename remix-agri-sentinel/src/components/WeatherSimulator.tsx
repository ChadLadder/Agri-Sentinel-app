import React from 'react';
import { Sliders, Thermometer, Droplets, CloudRain, Wind, Sparkles, AlertTriangle, RefreshCw } from 'lucide-react';
import { WeatherData } from '../types';
import { Language, t } from '../utils/i18n';

interface WeatherSimulatorProps {
  weather: WeatherData;
  onUpdateWeather: (w: WeatherData) => void;
  language: Language;
}

export const WeatherSimulator: React.FC<WeatherSimulatorProps> = ({
  weather,
  onUpdateWeather,
  language,
}) => {
  const [temp, setTemp] = React.useState(weather.temperature);
  const [humidity, setHumidity] = React.useState(weather.humidity);
  const [rain, setRain] = React.useState(weather.rainfall);
  const [wind, setWind] = React.useState(weather.windSpeed);

  const applyChanges = (tVal: number, hVal: number, rVal: number, wVal: number, label?: string) => {
    let statusText = 'Custom Simulation';
    if (hVal >= 80 && tVal >= 20) statusText = 'CRITICAL MOIST CANOPY (Outbreak Triggered)';
    else if (hVal >= 75) statusText = 'HIGH HUMIDITY CANOPY';
    else if (tVal >= 35) statusText = 'HEAT STRESS WINDOW';

    onUpdateWeather({
      ...weather,
      locationName: label ? `Simulated Scenario: ${label}` : `${weather.locationName} (Simulated)`,
      temperature: tVal,
      humidity: hVal,
      rainfall: rVal,
      windSpeed: wVal,
      conditionText: statusText,
      isSimulated: true,
    });
  };

  const handleTempChange = (v: number) => {
    setTemp(v);
    applyChanges(v, humidity, rain, wind);
  };

  const handleHumidityChange = (v: number) => {
    setHumidity(v);
    applyChanges(temp, v, rain, wind);
  };

  const handleRainChange = (v: number) => {
    setRain(v);
    applyChanges(temp, humidity, v, wind);
  };

  const handleWindChange = (v: number) => {
    setWind(v);
    applyChanges(temp, humidity, rain, v);
  };

  const scenarios = [
    { label: 'Monsoon Outbreak Storm', t: 24, h: 92, r: 28, w: 18 },
    { label: 'Warm Humid Leaf Wetness', t: 22, h: 86, r: 10, w: 8 },
    { label: 'Dry Heat Wave', t: 38, h: 32, r: 0, w: 22 },
    { label: 'Cool High Humidity Window', t: 15, h: 88, r: 14, w: 12 },
  ];

  return (
    <div className="bg-white/90 border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl space-y-6 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white shadow-md shadow-indigo-500/20 flex items-center justify-center shrink-0">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              What-If Climate & Weather Simulator
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Simulate hyper-local microclimate shifts to test pathogen vulnerability triggers in real time
            </p>
          </div>
        </div>

        <span className="text-xs bg-indigo-100 text-indigo-900 font-mono font-bold px-3 py-1 rounded-full border border-indigo-300 self-start sm:self-center">
          OFF-GRID CLIMATE ENGINE
        </span>
      </div>

      {/* Preset Scenarios Buttons */}
      <div>
        <label className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 block">
          Quick Preset Climate Scenarios:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {scenarios.map((sc, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTemp(sc.t);
                setHumidity(sc.h);
                setRain(sc.r);
                setWind(sc.w);
                applyChanges(sc.t, sc.h, sc.r, sc.w, sc.label);
              }}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3.5 rounded-2xl text-left transition-all cursor-pointer shadow-xs hover:border-indigo-300 group"
            >
              <div className="text-xs font-bold text-indigo-900 group-hover:text-indigo-600 transition-colors">
                {sc.label}
              </div>
              <div className="text-[10px] text-slate-500 font-mono font-bold mt-1">
                {sc.t}°C | {sc.h}% RH | {sc.r}mm
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 border border-slate-200/90 rounded-2xl p-6">
        {/* Temp Slider */}
        <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-900 flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-amber-600" />
              Temperature (°C)
            </span>
            <span className="font-mono text-amber-600 text-sm">{temp}°C</span>
          </div>
          <input
            type="range"
            min={10}
            max={45}
            step={0.5}
            value={temp}
            onChange={(e) => handleTempChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono font-semibold">
            <span>10°C (Cold)</span>
            <span>25°C (Optimum Fungus)</span>
            <span>45°C (Extreme Heat)</span>
          </div>
        </div>

        {/* Humidity Slider */}
        <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-900 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-sky-600" />
              Relative Humidity (% RH)
            </span>
            <span className="font-mono text-sky-600 text-sm">{humidity}%</span>
          </div>
          <input
            type="range"
            min={20}
            max={100}
            step={1}
            value={humidity}
            onChange={(e) => handleHumidityChange(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono font-semibold">
            <span>20% (Dry Air)</span>
            <span>75% (Threshold)</span>
            <span>100% (Saturated)</span>
          </div>
        </div>

        {/* Rain Slider */}
        <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-900 flex items-center gap-1.5">
              <CloudRain className="w-4 h-4 text-blue-600" />
              24-Hour Rainfall (mm)
            </span>
            <span className="font-mono text-blue-600 text-sm">{rain} mm</span>
          </div>
          <input
            type="range"
            min={0}
            max={50}
            step={0.5}
            value={rain}
            onChange={(e) => handleRainChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono font-semibold">
            <span>0mm (Dry)</span>
            <span>10mm (Moderate)</span>
            <span>50mm (Downpour)</span>
          </div>
        </div>

        {/* Wind Slider */}
        <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-900 flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-teal-600" />
              Wind Speed (km/h)
            </span>
            <span className="font-mono text-teal-600 text-sm">{wind} km/h</span>
          </div>
          <input
            type="range"
            min={0}
            max={35}
            step={1}
            value={wind}
            onChange={(e) => handleWindChange(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono font-semibold">
            <span>0km/h (Calm)</span>
            <span>15km/h (Spray Limit)</span>
            <span>35km/h (Gale)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

