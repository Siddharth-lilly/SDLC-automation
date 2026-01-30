// src/components/workspace/AISpecialist.jsx
import React, { useState } from 'react';
import { Bot, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const AISpecialist = ({ specialist, onAskAI }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={`relative bg-gradient-to-b from-cyan-50 to-white border-r border-gray-200 transition-all duration-300 ${isExpanded ? 'w-64' : 'w-12'}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-6 w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center text-white hover:bg-cyan-700 transition-colors z-10 shadow-md"
      >
        {isExpanded ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {/* Collapsed State */}
      {!isExpanded && (
        <div className="flex flex-col items-center py-4 space-y-4">
          <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
        </div>
      )}

      {/* Expanded State */}
      {isExpanded && (
        <div className="p-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              AI Specialist
            </div>
            <h3 className="text-lg font-bold text-gray-900">{specialist.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{specialist.experience}</p>
          </div>

          <button
            onClick={onAskAI}
            className="w-full px-4 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center justify-center space-x-2 font-medium"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask AI</span>
          </button>

          <div className="mt-6 p-3 bg-white border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-600 leading-relaxed">
              {specialist.description}
            </p>
          </div>

          <button className="mt-4 w-full text-sm text-cyan-700 font-medium hover:text-cyan-800 transition-colors">
            Switch Specialist
          </button>
        </div>
      )}
    </div>
  );
};

export default AISpecialist;
