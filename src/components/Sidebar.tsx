
import React from 'react';
import { 
  BarChart3, 
  PieChart, 
  LineChart, 
  GlobeIcon,
  Layers, 
  BarChart2, 
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  icon: React.ReactNode;
  id: string;
}

interface SidebarProps {
  isOpen: boolean;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const navItems: NavItem[] = [
  { name: 'Overview', icon: <BarChart3 size={18} />, id: 'overview' },
  { name: 'Intensity', icon: <TrendingUp size={18} />, id: 'intensity' },
  { name: 'Likelihood', icon: <BarChart2 size={18} />, id: 'likelihood' },
  { name: 'Topics', icon: <Layers size={18} />, id: 'topics' },
  { name: 'Countries', icon: <GlobeIcon size={18} />, id: 'countries' },
  { name: 'Sectors', icon: <PieChart size={18} />, id: 'sectors' },
  { name: 'Year Trends', icon: <LineChart size={18} />, id: 'yearTrends' },
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  activeSection, 
  setActiveSection 
}) => {
  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-border transform transition-transform duration-300 ease-in-out",
        "flex flex-col h-screen pt-16",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0"
      )}
    >
      <div className="px-4 pt-6 pb-2">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Dashboard</h2>
      </div>
      
      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={cn(
              "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200",
              "hover:bg-secondary",
              activeSection === item.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex flex-col space-y-2 text-xs text-muted-foreground">
          <div className="text-sm font-medium text-foreground">DataViz Dashboard</div>
          <div>Built with React, D3.js & Flask</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
