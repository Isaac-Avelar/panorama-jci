
import React from 'react';
import { IndicatorData } from '../types';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface IndicatorCardProps {
  data: IndicatorData;
  isActive: boolean;
  onClick: () => void;
}

const IndicatorCard: React.FC<IndicatorCardProps> = ({ data, isActive, onClick }) => {
  const variation = ((data.currentValue - data.previousValue) / Math.abs(data.previousValue) * 100);
  const isTrendPositive = variation > 0;
  const isTrendNegative = variation < 0;
  const trendColor = isTrendNegative ? 'text-rose-500' : isTrendPositive ? 'text-emerald-500' : 'text-slate-400';
  const TrendIcon = variation === 0 ? Minus : isTrendPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col p-5 md:p-6 rounded-[2rem] border transition-all duration-300 active:scale-95 cursor-pointer w-full
        ${isActive 
          ? 'bg-slate-900 border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.1)]' 
          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
        }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">{data.region === 'US' ? '🇺🇸' : '🇧🇷'}</span>
          <h3 className="text-slate-500 font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] truncate">{data.name}</h3>
        </div>
        <TrendIcon className={`w-4 h-4 ${trendColor}`} />
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl md:text-4xl font-black font-mono leading-none tracking-tighter text-white">
          {data.currentValue.toLocaleString('pt-BR')}
        </span>
        <span className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest">{data.unit}</span>
      </div>

      <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-800/50">
        <div className="flex flex-col">
          <span className="text-[8px] text-slate-600 uppercase font-black tracking-widest leading-none mb-1">Anterior</span>
          <span className="text-xs font-mono text-slate-400 font-bold">{data.previousValue}{data.unit}</span>
        </div>
        <div className={`px-3 py-1.5 rounded-xl text-[9px] md:text-[10px] font-black ${isTrendPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
           {variation > 0 ? '+' : ''}{variation.toFixed(1)}%
        </div>
      </div>
    </div>
  );
};

export default IndicatorCard;
