/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  History, 
  Cpu, 
  Globe, 
  Calendar,
  ChevronRight,
  RefreshCcw,
  Loader2,
  BarChart3
} from 'lucide-react';
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
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { STOCKS, PERIODS, StockSelection, ModelType, StockData, Prediction } from './types';
import { generateMockHistory, generatePrediction } from './services/mockData';
import { getGeminiPrediction } from './services/geminiService';

export default function App() {
  const [selectedStock, setSelectedStock] = useState<StockSelection>(STOCKS[0]);
  const [selectedModel, setSelectedModel] = useState<ModelType>('internet');
  const [selectedPeriod, setSelectedPeriod] = useState(PERIODS[1]); // 1M default
  const [history, setHistory] = useState<StockData[]>([]);
  const [pastPredictions, setPastPredictions] = useState<Prediction[]>([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState<{
    price: number;
    analysis?: string;
    trend?: string;
    confidence?: number;
  } | null>(null);

  // Initialize history
  useEffect(() => {
    const data = generateMockHistory(selectedPeriod.days);
    setHistory(data);
    setCurrentPrediction(null);
  }, [selectedStock, selectedPeriod]);

  const handlePredict = async () => {
    setIsPredicting(true);
    
    // Artificial delay for "thought"
    await new Promise(r => setTimeout(r, 1500));

    let pred;
    if (selectedModel === 'internet') {
      const geminiResult = await getGeminiPrediction(selectedStock.symbol, history);
      pred = {
        price: geminiResult.predictedPrice,
        analysis: geminiResult.analysis,
        trend: geminiResult.trend,
        confidence: geminiResult.confidence
      };
    } else {
      try {
        const response = await fetch('http://localhost:8000/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            symbol: selectedStock.symbol,
            history: history
          })
        });
        
        if (!response.ok) throw new Error('API Error');
        
        const data = await response.json();
        pred = {
          price: data.price,
          analysis: data.analysis,
          trend: data.trend,
          confidence: data.confidence
        };
      } catch (error) {
        console.error("Local API Error:", error);
        // Fallback если Python сервер выключен
        const p = generatePrediction(history, 'own');
        pred = {
          price: p,
          analysis: "ОШИБКА: Сервер Python недоступен. Запущен резервный алгоритм.",
          trend: p > (history[history.length - 1]?.price || 0) ? 'bullish' : 'bearish',
          confidence: 50
        };
      }
    }

    setCurrentPrediction(pred);
    
    // Add to history
    const newPred: Prediction = {
      id: Math.random().toString(36).substr(2, 9),
      stockId: selectedStock.id,
      stockSymbol: selectedStock.symbol,
      date: new Date().toLocaleDateString(),
      predictionPrice: pred.price,
      model: selectedModel,
      status: 'pending'
    };
    setPastPredictions(prev => [newPred, ...prev]);
    setIsPredicting(false);
  };

  const chartData = useMemo(() => {
    if (!currentPrediction) return history;
    const lastDate = new Date(history[history.length - 1].date);
    const predDate = new Date(lastDate);
    predDate.setDate(lastDate.getDate() + 1);

    return [
      ...history,
      {
        date: predDate.toISOString().split('T')[0],
        price: history[history.length-1].price, // connector
        predicted: currentPrediction.price
      }
    ];
  }, [history, currentPrediction]);

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#161B22]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">InvestAI</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Терминал Neural-X</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <span className="text-emerald-400">Рынок открыт</span>
            </div>
            <div className="bg-slate-900 px-3 py-1.5 rounded border border-slate-800 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" />
              <span>Нью-Йорк: 09:42:27</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Chart & Large Prediction */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Chart Card */}
          <div className="bg-[#161B22] border border-slate-800 rounded-xl p-6 shadow-2xl flex flex-col h-[520px]">
             <div className="flex items-center justify-between mb-8">
               <div className="flex flex-col gap-1">
                  <h2 className="text-3xl font-bold text-white tracking-tight flex items-baseline gap-3">
                    {selectedStock.name} 
                    <span className="text-slate-500 text-lg font-medium tracking-normal">{selectedStock.symbol}</span>
                  </h2>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-[10px] uppercase font-bold tracking-wider">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Факт
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-cyan-400 text-[10px] uppercase font-bold tracking-wider">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div> Прогноз
                    </div>
                  </div>
               </div>
               
               <div className="flex bg-[#0D1117] p-1 rounded-lg border border-slate-700">
                 {PERIODS.map(p => (
                   <button
                    key={p.label}
                    onClick={() => setSelectedPeriod(p)}
                    className={cn(
                      "px-4 py-1.5 rounded text-xs font-bold transition-all duration-200 uppercase",
                      selectedPeriod.label === p.label 
                        ? "bg-slate-800 text-white shadow-sm" 
                        : "text-slate-500 hover:text-slate-300"
                    )}
                   >
                     {p.label}
                   </button>
                 ))}
               </div>
             </div>

             <div className="flex-1 w-full bg-[#0D1117] rounded-lg border border-slate-800/50 p-4 relative overflow-hidden">
               {/* Grid Overlay */}
               <svg className="w-full h-full absolute inset-0 opacity-[0.03] pointer-events-none">
                 <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                   <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                 </pattern>
                 <rect width="100%" height="100%" fill="url(#grid-pattern)" />
               </svg>

               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={chartData}>
                   <defs>
                     <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                       <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                     </linearGradient>
                     <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                       <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                   <XAxis 
                    dataKey="date" 
                    stroke="#ffffff10" 
                    fontSize={10} 
                    tickFormatter={(val) => val.split('-').slice(1).join('/')}
                    tickMargin={10}
                    axisLine={false}
                    tickLine={false}
                   />
                   <YAxis 
                    stroke="#ffffff10" 
                    fontSize={10} 
                    domain={['auto', 'auto']} 
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `$${val}`}
                   />
                   <Tooltip 
                    contentStyle={{ backgroundColor: '#161B22', border: '1px solid #1e293b', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                    labelStyle={{ color: '#64748b', fontSize: '10px', marginBottom: '4px' }}
                   />
                   <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                    isAnimationActive={true}
                    dot={false}
                   />
                   {currentPrediction && (
                      <Area 
                        type="monotone" 
                        dataKey="predicted" 
                        stroke="#06b6d4" 
                        strokeWidth={3}
                        strokeDasharray="6 4"
                        fillOpacity={1} 
                        fill="url(#colorPred)" 
                        isAnimationActive={true}
                        dot={{ r: 4, fill: '#06b6d4', stroke: '#161B22', strokeWidth: 2 }}
                      />
                   )}
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* Next Day Prediction Summary */}
          <div className="bg-[#161B22] border border-slate-800 rounded-xl p-6 shadow-2xl flex flex-col gap-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Прогноз интеллектуального ядра
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {currentPrediction ? (
                <>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 bg-slate-900/50 p-6 rounded-lg border border-slate-800">
                      <div>
                        <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2">Цель</p>
                        <p className="text-2xl font-black text-cyan-400">${currentPrediction.price.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2">Точность</p>
                        <p className="text-2xl font-black text-white">{currentPrediction.confidence?.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2">Волатильность</p>
                        <p className="text-2xl font-black text-amber-400">Средняя</p>
                      </div>
                    </div>

                    <div className="bg-[#0D1117] p-4 rounded-lg border border-slate-800 flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center font-black text-xs",
                        currentPrediction.trend === 'bullish' ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-500"
                      )}>
                        {currentPrediction.trend === 'bullish' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                      </div>
                      <div>
                         <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Анализ настроений</p>
                         <p className={cn(
                           "text-sm font-black uppercase tracking-widest",
                           currentPrediction.trend === 'bullish' ? "text-emerald-400" : "text-red-400"
                         )}>{currentPrediction.trend === 'bullish' ? 'БЫЧИЙ' : currentPrediction.trend === 'bearish' ? 'МЕДВЕЖИЙ' : 'НЕЙТРАЛЬНЫЙ'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0D1117] p-6 rounded-lg border border-slate-800 flex flex-col justify-center relative overflow-hidden group">
                    <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                       Логика анализа ИИ
                    </p>
                    <p className="text-slate-300 leading-relaxed text-sm font-medium italic">
                      "{currentPrediction.analysis}"
                    </p>
                    <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-3 text-[9px] text-slate-600 font-black uppercase tracking-widest">
                       <span>Движок: {selectedModel === 'internet' ? 'Gemini 3 Pro' : 'Neural-Core X'}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="col-span-2 flex flex-col items-center justify-center py-16 opacity-30 text-center border-2 border-slate-800 border-dashed rounded-xl">
                  <BarChart3 className="w-12 h-12 mb-4 text-slate-600" />
                  <p className="text-sm font-black uppercase tracking-widest">Система готова к вычислениям</p>
                  <p className="text-xs max-w-xs mt-2 uppercase font-bold text-slate-600">Выберите параметры и запустите алгоритм прогнозирования</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Controls & History */}
        <div className="lg:w-[380px] flex flex-col gap-6">
          {/* Controls Card */}
          <div className="bg-[#161B22] border border-slate-800 rounded-xl p-6 shadow-xl">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Конфигурация параметров</h2>

            <div className="space-y-6">
              {/* Asset Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest">Активный актив</label>
                <div className="relative">
                  <select 
                    value={selectedStock.id}
                    onChange={(e) => setSelectedStock(STOCKS.find(s => s.id === e.target.value) || STOCKS[0])}
                    className="w-full bg-[#0D1117] border border-slate-700 rounded-lg py-3 px-4 text-sm font-bold text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none transition-all cursor-pointer"
                  >
                    {STOCKS.map(stock => (
                      <option key={stock.id} value={stock.id}>{stock.name} ({stock.symbol})</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </div>
                </div>
              </div>

              {/* Model Choice */}
              <div>
                 <label className="block text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest">Ядро модели</label>
                 <div className="grid grid-cols-2 gap-2 p-1 bg-[#0D1117] rounded-lg border border-slate-700">
                    <button
                      onClick={() => setSelectedModel('own')}
                      className={cn(
                        "py-3 px-3 text-[10px] font-black rounded transition-all duration-200 uppercase tracking-widest",
                        selectedModel === 'own' 
                          ? "bg-slate-800 text-white shadow-md border border-slate-700" 
                          : "text-slate-500 hover:text-slate-300"
                      )}
                    >
                      Своя (Local)
                    </button>
                    <button
                      onClick={() => setSelectedModel('internet')}
                      className={cn(
                        "py-3 px-3 text-[10px] font-black rounded transition-all duration-200 uppercase tracking-widest",
                        selectedModel === 'internet' 
                          ? "bg-slate-800 text-white shadow-md border border-slate-700" 
                          : "text-slate-500 hover:text-slate-300"
                      )}
                    >
                      Облако Gemini
                    </button>
                 </div>
              </div>

              <button 
                onClick={handlePredict}
                disabled={isPredicting}
                className={cn(
                  "w-full py-5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-black rounded-xl text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-900/20 mt-4 active:scale-[0.98] border border-blue-500/20",
                  isPredicting && "opacity-50 cursor-not-allowed"
                )}
              >
                {isPredicting ? (
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Вычисление...</span>
                  </div>
                ) : (
                  <span>Запустить анализ</span>
                )}
              </button>
            </div>
          </div>

          {/* History List */}
          <div className="bg-[#161B22] border border-slate-800 rounded-xl p-6 shadow-xl flex-1 flex flex-col min-h-[400px]">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6 font-mono">Телеметрия прогнозов</h2>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              <AnimatePresence initial={false}>
                {pastPredictions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-10 py-10">
                    <History className="w-12 h-12 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Журнал пуст</p>
                  </div>
                ) : (
                  pastPredictions.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        "flex justify-between items-center p-4 bg-[#0D1117] rounded-lg border border-slate-800 border-l-2 relative group hover:border-slate-600 transition-all cursor-default",
                        log.predictionPrice > (history[history.length-1]?.price || 0) ? "border-l-emerald-500" : "border-l-red-500"
                      )}
                    >
                      <div>
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">{log.date}</p>
                        <p className="text-sm font-bold text-white tracking-tight">Прогноз {log.stockSymbol}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-cyan-400 tracking-tighter">${log.predictionPrice.toFixed(2)}</p>
                        <span className={cn(
                          "text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter",
                          log.predictionPrice > (history[history.length-1]?.price || 0) ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                        )}>
                          {log.predictionPrice > (history[history.length-1]?.price || 0) ? '+ Успех' : '- Ошибка'}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.4);
        }
      `}} />
    </div>
  );
}
