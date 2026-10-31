import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Info,
  DollarSign,
  ShieldCheck,
  Scale,
  Briefcase,
  PieChart,
  Activity,
  Layers,
} from 'lucide-react';
import { formatCrores, formatPercent } from '../utils/financialCalculations';

interface MetricCardProps {
  label: string;
  value: number;
  subValue?: string;
  changePercent?: number;
  isRatio?: boolean;
  prefix?: string;
  suffix?: string;
  description: string;
  badge?: {
    text: string;
    color: string;
  };
  iconType?: 'revenue' | 'operating' | 'profit' | 'assets' | 'liabilities' | 'debt' | 'equity' | 'ratio';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subValue,
  changePercent,
  isRatio = false,
  prefix = '₹',
  suffix = '',
  description,
  badge,
  iconType = 'revenue',
}) => {
  const getIcon = () => {
    switch (iconType) {
      case 'revenue':
        return <Activity className="w-5 h-5 text-blue-400" />;
      case 'operating':
        return <TrendingUp className="w-5 h-5 text-indigo-400" />;
      case 'profit':
        return <PieChart className="w-5 h-5 text-emerald-400" />;
      case 'assets':
        return <Briefcase className="w-5 h-5 text-cyan-400" />;
      case 'liabilities':
        return <Layers className="w-5 h-5 text-amber-400" />;
      case 'debt':
        return <Scale className="w-5 h-5 text-rose-400" />;
      case 'equity':
        return <ShieldCheck className="w-5 h-5 text-teal-400" />;
      case 'ratio':
        return <DollarSign className="w-5 h-5 text-purple-400" />;
      default:
        return <Activity className="w-5 h-5 text-blue-400" />;
    }
  };

  const formattedDisplay = isRatio
    ? `${value.toFixed(2)}${suffix}`
    : formatCrores(value);

  return (
    <div className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 transition-all shadow-md group relative">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 group-hover:scale-105 transition-transform">
            {getIcon()}
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
              {label}
            </h4>
            {subValue && (
              <span className="text-[11px] text-slate-400 font-medium">
                {subValue}
              </span>
            )}
          </div>
        </div>

        {badge && (
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${badge.color}`}>
            {badge.text}
          </span>
        )}
      </div>

      <div className="mt-3">
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white">
            {formattedDisplay}
          </div>

          {changePercent !== undefined && (
            <div
              className={`flex items-center gap-1 text-xs font-semibold font-mono ${
                changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {changePercent >= 0 ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>{formatPercent(changePercent)} YoY</span>
            </div>
          )}
        </div>
      </div>

      <p className="mt-2 text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/60 pt-2">
        {description}
      </p>
    </div>
  );
};
