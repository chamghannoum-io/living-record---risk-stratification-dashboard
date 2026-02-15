
import React from 'react';
import { Icons } from '../../constants';

const Header: React.FC = () => {
  return (
    <header className="h-16 bg-[#1A2332] border-b border-[#2D3A4B] flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-400">View: <span className="text-white">Provider</span></span>
      </div>

      <div className="flex-1 max-w-xl mx-8 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Icons.Search />
        </span>
        <input 
          type="text" 
          placeholder="Search patients, conditions, risk factors... (⌘K)"
          className="w-full bg-[#0F1419] border border-[#2D3A4B] rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#00D9FF] transition-colors"
        />
      </div>

      <div className="flex items-center space-x-6 text-gray-400">
        <button className="hover:text-white"><Icons.Menu /></button>
        <div className="relative">
          <button className="hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
        <div className="h-6 w-px bg-[#2D3A4B]"></div>
        <span className="text-xs font-mono">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </header>
  );
};

export default Header;
