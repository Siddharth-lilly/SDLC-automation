// src/components/layout/Header.jsx
import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';

const Header = ({ projectName, onShareClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-red-600">SDLC</h1>
          <span className="text-2xl font-light text-gray-700">Studio</span>
        </div>
        
        {projectName && (
          <>
            <ChevronDown className="w-5 h-5 text-gray-400" />
            <span className="text-lg text-gray-700">{projectName}</span>
          </>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {onShareClick && (
          <button onClick={onShareClick} className="btn-primary">
            Share
          </button>
        )}
        
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>
        
        <button className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold">
            S
          </div>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </header>
  );
};

export default Header;