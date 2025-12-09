import { TrendingUp, TrendingDown } from 'lucide-react';

interface SummaryCardProps {
  label: string;
  value: string;
  icon?: 'income' | 'expense' | 'balance';
  subtitle?: string;
  isHighlighted?: boolean;
  valueColor?: 'red' | 'green';
}

export default function SummaryCard({
  label,
  value,
  icon,
  subtitle,
  isHighlighted = false,
  valueColor,
}: SummaryCardProps) {
  const getIcon = () => {
    if (icon === 'income') {
      return (
        <div className="p-2 rounded-lg bg-green-500/10">
          <TrendingUp size={18} className="text-green-500" />
        </div>
      );
    }
    if (icon === 'expense') {
      return (
        <div className="p-2 rounded-lg bg-red-500/10">
          <TrendingDown size={18} className="text-red-500" />
        </div>
      );
    }
    return (
      <div className="p-2 rounded-lg bg-blue-500/10">
        <span className="text-xl font-bold text-blue-500">₹</span>
      </div>
    );
  };

  const getBorderClass = () => {
    if (isHighlighted) {
      return 'border-blue-600/50 hover:border-blue-500';
    }
    if (icon === 'income') {
      return 'hover:border-green-600/40';
    }
    if (icon === 'expense') {
      return 'hover:border-red-600/40';
    }
    return '';
  };

  return (
    <div
      className={`summary-card-hover rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur supports-[backdrop-filter]:bg-slate-900/40 p-4 sm:p-6 ${getBorderClass()} ${
        isHighlighted ? 'bg-blue-600/10' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-xs sm:text-sm font-medium text-slate-400">{label}</h3>
        {getIcon()}
      </div>
      <p
        className={`text-2xl sm:text-3xl font-bold mb-1 ${
          valueColor === 'green'
            ? 'text-green-500'
            : valueColor === 'red'
              ? 'text-red-500'
              : 'text-white'
        }`}
      >
        {value}
      </p>
      {subtitle && (
        <p className={`text-xs font-medium ${icon === 'income' ? 'text-green-500' : 'text-slate-500'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
