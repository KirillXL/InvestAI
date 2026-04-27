import { LayoutDashboard, TrendingUp, Wallet, Cpu, FileText, HelpCircle, User } from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: TrendingUp, label: 'Market Analysis' },
  { icon: Wallet, label: 'Portfolio' },
  { icon: Cpu, label: 'AI Models' },
  { icon: FileText, label: 'Reports' },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-[var(--width-sidebar)] bg-surface-container-lowest border-r border-white/5 flex flex-col pt-20 pb-6 z-40">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0052cc] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Cpu className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-none tracking-tight">InvestAI</h2>
            <p className="text-[10px] text-[#8d90a0] uppercase tracking-widest mt-1">Terminal v2.4</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
              item.active 
                ? "bg-surface-container-highest text-white border-r-4 border-[#0052cc]" 
                : "text-[#8d90a0] hover:text-white hover:bg-surface-container-high"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5",
              item.active ? "text-[#b2c5ff]" : "text-[#434654] group-hover:text-[#8d90a0]"
            )} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto px-3 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[#8d90a0] hover:text-white hover:bg-surface-container-high transition-all text-sm font-medium">
          <HelpCircle className="w-5 h-5 text-[#434654]" />
          Support
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[#8d90a0] hover:text-white hover:bg-surface-container-high transition-all text-sm font-medium">
          <User className="w-5 h-5 text-[#434654]" />
          Account
        </button>
      </div>
    </aside>
  );
}
