
import React from 'react';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cool-600 to-cool-400 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-heat-500"></div>
          </div>
          <span className="font-bold text-xl">HeatLayer Insights</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
