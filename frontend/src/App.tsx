import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StockChart } from './components/StockChart';
import { ControlPanel } from './components/ControlPanel';
import { ForecastCard } from './components/ForecastCard';
import { STOCKS, MODELS, MOCK_CHART_DATA, PREDICTION_HISTORY } from './constants';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [selectedStock, setSelectedStock] = useState(STOCKS[0].symbol);
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [period, setPeriod] = useState('1M');
  const [isPredicting, setIsPredicting] = useState(false);
  const [data, setData] = useState(MOCK_CHART_DATA);

  // Simulate data refresh on stock/model change
  useEffect(() => {
    setIsPredicting(true);
    const timer = setTimeout(() => {
      // In a real app, this would be an API call to a backend or Gemini
      // We'll just slightly perturb the data to simulate different results
      const perturbed = MOCK_CHART_DATA.map(point => ({
        ...point,
        predicted: point.predicted ? point.predicted * (1 + (Math.random() - 0.5) * 0.01) : null
      }));
      setData(perturbed);
      setIsPredicting(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [selectedStock, selectedModel]);

  const handlePredict = () => {
    setIsPredicting(true);
    setTimeout(() => setIsPredicting(false), 2000);
  };

  const periods = ['1D', '1W', '1M', '1Y', 'ALL'];

  return (
    <div className="h-screen w-full flex overflow-hidden bg-surface">
      <Sidebar />
      <Header />
      
      <main className="flex-1 ml-[var(--width-sidebar)] pt-16 flex overflow-hidden">
        {/* Left Side: Chart Area */}
        <section className="flex-1 relative bg-surface-container-lowest flex flex-col p-8 overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <div>
              <motion.h1 
                key={selectedStock}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-black text-white tracking-tight"
              >
                {STOCKS.find(s => s.symbol === selectedStock)?.name} Dynamics
              </motion.h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#43ed9e] animate-pulse shadow-[0_0_10px_rgba(67,237,158,0.5)]" />
                  <span className="text-[10px] font-bold text-[#43ed9e] uppercase tracking-widest">Live Model Feed</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-[#434654]" />
                <span className="text-[10px] font-medium text-[#8d90a0]">
                  {MODELS.find(m => m.id === selectedModel)?.name} active
                </span>
              </div>
            </div>

            <div className="flex bg-surface-container-high p-1 rounded-xl border border-white/5">
              {periods.map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={cn(
                    "px-4 py-1.5 text-[10px] font-black rounded-lg transition-all",
                    period === p 
                      ? "bg-[#0052cc] text-white shadow-lg" 
                      : "text-[#8d90a0] hover:text-white"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 relative glass-panel rounded-3xl overflow-hidden chart-grid">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedStock + selectedModel}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full p-4"
              >
                <StockChart data={data} symbol={selectedStock} />
              </motion.div>
            </AnimatePresence>
            
            <ForecastCard 
              change={2.4} 
              price={data[data.length-1].predicted ?? 0} 
              confidence={94.2} 
            />
            
            <div className="absolute top-6 right-6 flex items-center gap-4">
               <div className="flex items-center gap-2 px-3 py-1.5 glass-panel rounded-full text-[10px] font-bold text-on-surface-variant">
                  <div className="w-2 h-0.5 bg-[#43ed9e]" /> Actual
               </div>
               <div className="flex items-center gap-2 px-3 py-1.5 glass-panel rounded-full text-[10px] font-bold text-on-surface-variant">
                  <div className="w-2 h-0.5 border-t border-dashed border-[#b2c5ff]" /> Predicted
               </div>
            </div>
          </div>
        </section>

        {/* Right Side: Control & History */}
        <ControlPanel 
          stocks={STOCKS}
          models={MODELS}
          selectedStock={selectedStock}
          selectedModel={selectedModel}
          onStockChange={setSelectedStock}
          onModelChange={setSelectedModel}
          history={PREDICTION_HISTORY}
          onPredict={handlePredict}
          isPredicting={isPredicting}
        />
      </main>
    </div>
  );
}
