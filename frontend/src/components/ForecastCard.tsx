import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'motion/react';

interface ForecastCardProps {
  change: number;
  price: number;
  confidence: number;
}

export function ForecastCard({ change, price, confidence }: ForecastCardProps) {
  const isPositive = change >= 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-6 left-6 p-6 glass-panel rounded-2xl w-80 shadow-2xl border-white/5 active:scale-95 transition-transform cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#171f33] rounded-lg border border-white/5">
            <TrendingUp className="w-4 h-4 text-[#b2c5ff]" />
          </div>
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Next Day Forecast</span>
        </div>
        <div className={isPositive ? "text-[#43ed9e]" : "text-[#ffb4ab]"}>
          {isPositive ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
        </div>
      </div>
      
      <div className="flex items-baseline gap-2 mb-4">
        <h2 className={`text-4xl font-extrabold tracking-tight ${isPositive ? 'text-[#43ed9e]' : 'text-[#ffb4ab]'}`}>
          {isPositive ? '+' : ''}{change}%
        </h2>
        <span className="text-sm font-mono text-on-surface-variant">
          (${price.toFixed(2)})
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">
          <span>Confidence Score</span>
          <span className="text-white">{confidence}%</span>
        </div>
        <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className={`h-full rounded-full ${confidence > 90 ? 'bg-[#43ed9e]' : 'bg-[#0052cc]'}`}
          />
        </div>
      </div>
    </motion.div>
  );
}
