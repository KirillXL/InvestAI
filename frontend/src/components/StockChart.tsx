import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ReferenceLine
} from 'recharts';
import { ChartDataPoint } from '../types';
import { format } from 'date-fns';

interface StockChartProps {
  data: ChartDataPoint[];
  symbol: string;
}

export function StockChart({ data, symbol }: StockChartProps) {
  const latestActualIndex = data.findLastIndex(d => d.actual !== null && d.actual !== undefined);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-3 rounded-xl border-white/10 shadow-2xl">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-2">
            {format(new Date(label), 'MMM dd, yyyy')}
          </p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-xs text-on-surface-variant capitalize">{entry.name}:</span>
                </div>
                <span className="text-xs font-mono font-bold text-on-surface">
                  ${entry.value?.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full min-h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#43ed9e" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#43ed9e" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#b2c5ff" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#b2c5ff" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(str) => format(new Date(str), 'MMM dd')}
            stroke="#434654"
            tick={{ fill: '#8d90a0', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            minTickGap={30}
          />
          <YAxis 
            domain={['auto', 'auto']}
            stroke="#434654"
            tick={{ fill: '#8d90a0', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => `$${val}`}
          />
          <Tooltip content={<CustomTooltip />} />
          
          <Area 
            name="Actual"
            type="monotone" 
            dataKey="actual" 
            stroke="#43ed9e" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorActual)" 
            connectNulls={false}
          />
          
          <Area 
            name="Predicted"
            type="monotone" 
            dataKey="predicted" 
            stroke="#b2c5ff" 
            strokeWidth={2}
            strokeDasharray="5 5"
            fillOpacity={1} 
            fill="url(#colorPredicted)" 
          />

          {/* Vertical line at prediction start */}
          {latestActualIndex !== -1 && (
             <ReferenceLine x={data[latestActualIndex].date} stroke="#0052cc" strokeOpacity={0.5} strokeWidth={1} strokeDasharray="3 3" />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
