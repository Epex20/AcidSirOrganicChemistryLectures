import React from 'react';
import { Atom } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-gradient-to-r from-indigo-700 to-purple-800 text-white p-2 sm:p-6 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-0.5 sm:mb-2">
            <Atom size={28} className="sm:w-8 sm:h-8 animate-pulse shrink-0" />
            <h1 className="text-base sm:text-3xl lg:text-4xl font-bold tracking-tight whitespace-nowrap">
             ORGANIC CHEMISTRY LECTURES
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:space-x-2 space-y-0.5 sm:space-y-0 text-xs sm:text-lg">
            <span className="font-semibold whitespace-nowrap">LECTURES ARRANGED</span>
            <span className="hidden sm:inline text-amber-200">•</span>
            <span className="text-amber-200 whitespace-nowrap">BY AYUSH (EPEX)</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header