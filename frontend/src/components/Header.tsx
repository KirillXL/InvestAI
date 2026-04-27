import { Bell, Settings, Search } from 'lucide-react';

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-12">
        <div className="flex items-center gap-2 md:hidden">
          <div className="w-8 h-8 bg-[#0052cc] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">I</span>
          </div>
        </div>
        <nav className="hidden md:flex gap-8">
          <a href="#" className="text-[#b2c5ff] font-semibold text-sm border-b-2 border-[#0052cc] pb-1">Dashboard</a>
          <a href="#" className="text-on-surface-variant font-medium text-sm hover:text-white transition-colors">Market Analysis</a>
          <a href="#" className="text-on-surface-variant font-medium text-sm hover:text-white transition-colors">Portfolio</a>
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-2 bg-surface-container-high px-4 py-1.5 rounded-full border border-white/5">
          <Search className="w-4 h-4 text-[#434654]" />
          <input 
            type="text" 
            placeholder="Search terminal..." 
            className="bg-transparent border-none outline-none text-xs text-on-surface-variant w-40"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 text-[#8d90a0] hover:text-white hover:bg-surface-container-high rounded-lg transition-all">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-[#8d90a0] hover:text-white hover:bg-surface-container-high rounded-lg transition-all">
            <Settings className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-center gap-3 pl-2 border-l border-white/5">
          <div className="text-right hidden lg:block">
            <p className="text-xs font-bold text-white">Jeffrey N.</p>
            <p className="text-[10px] text-[#8d90a0] uppercase tracking-tighter">Quant Analyst</p>
          </div>
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jeffrey" 
            alt="Profile" 
            className="w-8 h-8 rounded-full border border-[#0052cc]/30 bg-surface-container-high"
          />
        </div>
      </div>
    </header>
  );
}
