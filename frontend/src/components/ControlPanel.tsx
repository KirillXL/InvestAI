import { ChevronDown, Sparkles, History, BrainCircuit } from 'lucide-react';
import { Stock, Model, Prediction } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

interface ControlPanelProps {
  stocks: Stock[];
  models: Model[];
  selectedStock: string;
  selectedModel: string;
  onStockChange: (val: string) => void;
  onModelChange: (val: string) => void;
  history: Prediction[];
  onPredict: () => void;
  isPredicting: boolean;
}

export function ControlPanel({
  stocks,
  models,
  selectedStock,
  selectedModel,
  onStockChange,
  onModelChange,
  history,
  onPredict,
  isPredicting
}: ControlPanelProps) {
  const currentModel = models.find(m => m.id === selectedModel);

  return (
    <section className="w-[var(--width-control-panel)] bg-surface-container-lowest border-l border-white/5 p-8 flex flex-col h-full overflow-y-auto custom-scrollbar scrollbar-hide">
      <div className="space-y-10">
        {/* Stock Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-[#0052cc] rounded-full" />
            <label className="text-[10px] font-bold text-[#8d90a0] uppercase tracking-widest">Active Asset</label>
          </div>
          <div className="relative group">
            <select 
              value={selectedStock}
              onChange={(e) => onStockChange(e.target.value)}
              className="w-full bg-surface-container-high border border-white/5 rounded-2xl px-5 py-4 text-sm text-on-surface appearance-none focus:ring-2 focus:ring-[#0052cc] outline-none cursor-pointer transition-all hover:bg-surface-container-highest"
            >
              {stocks.map(s => (
                <option key={s.symbol} value={s.symbol}>{s.symbol} - {s.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#434654] w-4 h-4 group-hover:text-on-surface transition-colors" />
          </div>
        </div>

        {/* Model Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-[#b2c5ff] rounded-full" />
            <label className="text-[10px] font-bold text-[#8d90a0] uppercase tracking-widest">Model Architecture</label>
          </div>
          
          <div className="grid grid-cols-2 p-1 bg-surface-container-high rounded-2xl border border-white/5">
            <button 
              onClick={() => onModelChange(models.find(m => m.type === 'custom')?.id || '')}
              className={cn(
                "py-2.5 text-xs font-bold rounded-xl transition-all duration-300",
                currentModel?.type === 'custom' 
                  ? "bg-[#0052cc] text-white shadow-lg shadow-blue-500/20" 
                  : "text-[#8d90a0] hover:text-white"
              )}
            >
              Custom Model
            </button>
            <button 
              onClick={() => onModelChange(models.find(m => m.type === 'web')?.id || '')}
              className={cn(
                "py-2.5 text-xs font-bold rounded-xl transition-all duration-300",
                currentModel?.type === 'web' 
                  ? "bg-[#0052cc] text-white shadow-lg shadow-blue-500/20" 
                  : "text-[#8d90a0] hover:text-white"
              )}
            >
              Pre-trained (Web)
            </button>
          </div>

          <div className="relative group">
            <select 
              value={selectedModel}
              onChange={(e) => onModelChange(e.target.value)}
              className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-xs text-on-surface-variant appearance-none focus:ring-1 focus:ring-[#0052cc] outline-none cursor-pointer hover:border-white/20 transition-all font-mono"
            >
              {models.filter(m => m.type === currentModel?.type).map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <BrainCircuit className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#434654] w-4 h-4" />
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={onPredict}
          disabled={isPredicting}
          className="w-full relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-[#0052cc] to-[#43ed9e] rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
          <div className="relative w-full bg-[#0052cc] hover:bg-[#0047b3] disabled:opacity-50 disabled:cursor-not-allowed py-5 rounded-2xl text-white font-black text-lg tracking-tight transition-all flex items-center justify-center gap-3">
            {isPredicting ? (
               <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                Predict Next Day
              </>
            )}
          </div>
        </button>

        {/* History */}
        <div className="space-y-6 flex-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#8d90a0]" />
              <label className="text-[10px] font-bold text-[#8d90a0] uppercase tracking-widest">Prediction Log</label>
            </div>
            <span className="text-[10px] text-[#43ed9e] font-black px-2 py-0.5 bg-[#43ed9e]/10 border border-[#43ed9e]/20 rounded-md">AVG 96.8%</span>
          </div>
          
          <div className="space-y-3">
            {history.map((item, idx) => (
              <div 
                key={item.date} 
                className={cn(
                  "p-4 bg-surface-container rounded-2xl border border-white/5 hover:border-[#0052cc]/50 transition-all cursor-default group",
                  idx > 2 && "opacity-50 hover:opacity-100"
                )}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-mono font-bold text-[#8d90a0]">{format(new Date(item.date), 'MMM dd, yyyy')}</span>
                  <span className={cn(
                    "text-[10px] font-black px-2 py-0.5 rounded",
                    (item.accuracy || 0) > 95 ? "text-[#43ed9e] bg-[#43ed9e]/10" : "text-[#ffb4ab] bg-[#ffb4ab]/10"
                  )}>
                    {item.accuracy}% Accuracy
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] text-[#434654] uppercase font-black tracking-tighter">Predicted</p>
                    <p className="text-sm font-mono font-bold text-[#b2c5ff]">${item.predicted.toFixed(2)}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[9px] text-[#434654] uppercase font-black tracking-tighter">Actual</p>
                    <p className="text-sm font-mono font-bold text-white">${item.actual?.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
