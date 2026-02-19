
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend
} from 'recharts';
import { MonthlyRecord } from '../types';

interface ComparisonChartProps {
  data: MonthlyRecord[];
  indicatorName: string;
  unit: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 border border-slate-700 p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
        <p className="text-slate-500 text-[10px] font-black mb-3 uppercase tracking-[0.2em]">{label} 2025/26</p>
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-slate-600" />
            <span className="text-slate-400 text-xs font-bold">2025:</span>
            <span className="text-white font-mono font-bold ml-auto">{payload[0].value}</span>
          </div>
          {payload[1]?.value !== undefined && payload[1]?.value !== null && (
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
              <span className="text-slate-400 text-xs font-bold">2026:</span>
              <span className="text-white font-mono font-bold ml-auto">{payload[1].value}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const ComparisonChart: React.FC<ComparisonChartProps> = ({ data, indicatorName, unit }) => {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#475569', fontSize: 10, fontWeight: 800 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#475569', fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: 700 }}
            tickFormatter={(value) => `${value}${unit}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1 }} />
          <Legend 
            verticalAlign="top" 
            align="right" 
            height={40}
            iconType="circle"
            formatter={(value) => (
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">
                {value === 'prevYear' ? '2025' : '2026'}
              </span>
            )}
          />
          <Line
            name="prevYear"
            type="monotone"
            dataKey="prevYear"
            stroke="#334155"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={{ r: 0 }}
            activeDot={{ r: 4, fill: '#334155' }}
            animationDuration={1000}
          />
          <Line
            name="currYear"
            type="monotone"
            dataKey="currYear"
            stroke="#f59e0b"
            strokeWidth={4}
            dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#020617' }}
            activeDot={{ r: 6, fill: '#f59e0b', strokeWidth: 0 }}
            animationDuration={1500}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonChart;
