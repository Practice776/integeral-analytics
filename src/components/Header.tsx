
import React from 'react';
import { Menu, X, PieChart } from 'lucide-react';

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-border z-30 h-16 px-4 md:px-6">
      <div className="flex items-center justify-between h-full max-w-[1440px] mx-auto">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="mr-4 p-2 rounded-md hover:bg-secondary transition-colors"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center">
            <PieChart className="text-primary mr-2" />
            <span className="font-semibold text-lg">DataViz Dashboard</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full animate-pulse-slow hidden sm:block">
            Live Demo
          </div>
          <a 
            href="https://github.com/yourusername/dataviz-dashboard" 
            target="_blank" 
            rel="noreferrer"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:block"
          >
            View Source
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
