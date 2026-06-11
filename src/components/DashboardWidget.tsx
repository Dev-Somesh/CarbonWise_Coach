import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { EmissionHistoryItem } from '../types';
import { Download, LayoutGrid, Layers, Info, TrendingUp, Presentation } from 'lucide-react';

interface DashboardWidgetProps {
  history: EmissionHistoryItem[];
  onDownloadJSON: () => void;
}

export default function DashboardWidget({ history, onDownloadJSON }: DashboardWidgetProps) {
  const [chartMode, setChartMode] = useState<'total' | 'breakdown'>('total');
  const [chartType, setChartType] = useState<'area' | 'line'>('line'); // Default to Line Chart as requested

  if (!history || history.length === 0) {
    return null;
  }

  // Map the emission points for recharts
  const chartData = history.map((item, index) => ({
    name: item.date,
    shortName: item.date.length > 8 ? `Pt ${index + 1}` : item.date,
    Total: item.emissions.total,
    Transport: item.emissions.transport,
    Diet: item.emissions.diet,
    Energy: item.emissions.energy,
    Shopping: item.emissions.shopping,
  }));

  // Simple custom tooltip for polished dark-slate design matching CarbonWise Coach
  interface TooltipPayloadItem { name: string; value: number; color: string; }
  interface TooltipProps { active?: boolean; payload?: TooltipPayloadItem[]; label?: string; }
  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-800 text-white p-3.5 rounded-2xl shadow-xl text-xs space-y-1.5 font-sans">
          <p className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">{label}</p>
          {payload.map((pld) => (
            <div key={pld.name} className="flex justify-between items-center gap-6">
              <span className="flex items-center gap-2 font-medium text-slate-350">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pld.color }} />
                {pld.name}:
              </span>
              <span className="font-bold font-mono text-emerald-400">
                {pld.value.toLocaleString()} kg CO2e
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      id="emissions-trendline-card" 
      className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2" id="trend-line-title">
            Emissions Trendline Analysis
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Visualize your overall footprint velocity or track category reductions over time.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Chart Type Toggle (Line vs Area) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 mr-1">
            <button
              id="chart-type-line"
              type="button"
              onClick={() => setChartType('line')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1 ${
                chartType === 'line' 
                  ? 'bg-white text-slate-950 shadow-xs border border-slate-200/50' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Show Line Chart"
            >
              <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
              <span>Line</span>
            </button>
            <button
              id="chart-type-area"
              type="button"
              onClick={() => setChartType('area')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1 ${
                chartType === 'area' 
                  ? 'bg-white text-slate-950 shadow-xs border border-slate-200/50' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Show Area Chart"
            >
              <Presentation className="w-3.5 h-3.5 text-indigo-500" />
              <span>Area</span>
            </button>
          </div>

          {/* Segmented active control tab */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              id="chart-toggle-total"
              type="button"
              onClick={() => setChartMode('total')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1 ${
                chartMode === 'total' 
                  ? 'bg-white text-slate-950 shadow-xs border border-slate-200/50' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>Total</span>
            </button>
            <button
              id="chart-toggle-breakdown"
              type="button"
              onClick={() => setChartMode('breakdown')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1 ${
                chartMode === 'breakdown' 
                  ? 'bg-white text-slate-950 shadow-xs border border-slate-200/50' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-emerald-500" />
              <span>Sectors</span>
            </button>
          </div>

          {/* Download JSON Button */}
          <button
            id="btn-download-json"
            type="button"
            onClick={onDownloadJSON}
            className="p-2.5 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-xl border border-slate-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer flex items-center gap-1.5 text-xs font-bold transition-all"
            title="Download Raw History (JSON)"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>
        </div>
      </div>

      {/* Primary Chart Area */}
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis 
                dataKey="shortName" 
                stroke="#94a3b8" 
                fontSize={10} 
                fontFamily="monospace"
                tickLine={false}
                axisLine={false}
                dy={8}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={10} 
                fontFamily="monospace"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${Math.round(value / 100) / 10}k`}
                dx={-8}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {chartMode === 'total' ? (
                <Line 
                  type="monotone" 
                  dataKey="Total" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 0, fill: '#10b981' }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#059669' }}
                />
              ) : (
                <>
                  <Line 
                    type="monotone" 
                    dataKey="Transport" 
                    stroke="#38bdf8" 
                    strokeWidth={2.5}
                    dot={{ r: 3, strokeWidth: 0 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Diet" 
                    stroke="#fbbf24" 
                    strokeWidth={2.5}
                    dot={{ r: 3, strokeWidth: 0 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Energy" 
                    stroke="#34d399" 
                    strokeWidth={2.5}
                    dot={{ r: 3, strokeWidth: 0 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Shopping" 
                    stroke="#818cf8" 
                    strokeWidth={2.5}
                    dot={{ r: 3, strokeWidth: 0 }}
                  />
                </>
              )}
              <Legend 
                verticalAlign="top" 
                height={36} 
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', fontFamily: 'sans-serif' }}
              />
            </LineChart>
          ) : (
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorTransport" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorDiet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorUtilities" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorShopping" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0}/>
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis 
                dataKey="shortName" 
                stroke="#94a3b8" 
                fontSize={10} 
                fontFamily="monospace"
                tickLine={false}
                axisLine={false}
                dy={8}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={10} 
                fontFamily="monospace"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${Math.round(value / 100) / 10}k`}
                dx={-8}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {chartMode === 'total' ? (
                <Area 
                  type="monotone" 
                  dataKey="Total" 
                  stroke="#10b981" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#059669' }}
                />
              ) : (
                <>
                  <Area 
                    type="monotone" 
                    dataKey="Transport" 
                    stroke="#38bdf8" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorTransport)" 
                    stackId="1"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Diet" 
                    stroke="#fbbf24" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorDiet)" 
                    stackId="1"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Energy" 
                    stroke="#34d399" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorUtilities)" 
                    stackId="1"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Shopping" 
                    stroke="#818cf8" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorShopping)" 
                    stackId="1"
                  />
                </>
              )}
              <Legend 
                verticalAlign="top" 
                height={36} 
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', fontFamily: 'sans-serif' }}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="flex items-start gap-2.5 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-150 mt-4 text-[11px] text-slate-500 leading-normal font-medium">
        <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <span>
          {chartType === 'line'
            ? 'The Line Chart tracks trends and discrete values chronologically. Perfect for observing consistent downward slopes!'
            : 'Area chart view displays colored ribbons or stacks values to indicate proportion weights of individual categories.'
          }
        </span>
      </div>
    </div>
  );
}
