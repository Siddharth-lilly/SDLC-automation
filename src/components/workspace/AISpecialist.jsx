// src/components/workspace/AISpecialist.jsx
import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

const AISpecialist = ({ specialist, onAskAI }) => {
  return (
    <div className="w-64 bg-gradient-to-b from-cyan-50 to-white border-r border-gray-200 p-4">
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
  );
};

export default AISpecialist;