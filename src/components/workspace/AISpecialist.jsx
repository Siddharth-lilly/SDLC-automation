// src/components/workspace/AISpecialist.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, Sparkles, ChevronLeft, ChevronRight, GripVertical, Send } from 'lucide-react';

const AISpecialist = ({ specialist, onAskAI }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [width, setWidth] = useState(280); // Default width in pixels
  const [isResizing, setIsResizing] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const panelRef = useRef(null);
  
  // Min and max width constraints
  const MIN_WIDTH = 200;
  const MAX_WIDTH = 500;
  const COLLAPSED_WIDTH = 48;

  // Handle mouse down on resize handle
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  // Handle mouse move during resize
  const handleMouseMove = useCallback((e) => {
    if (!isResizing) return;
    
    const newWidth = e.clientX;
    if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
      setWidth(newWidth);
    } else if (newWidth < MIN_WIDTH) {
      setWidth(MIN_WIDTH);
    } else if (newWidth > MAX_WIDTH) {
      setWidth(MAX_WIDTH);
    }
  }, [isResizing]);

  // Handle mouse up to stop resizing
  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Add and remove event listeners for resize
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const handleAskAI = () => {
    if (aiQuestion.trim() && onAskAI) {
      onAskAI(aiQuestion);
      setAiQuestion('');
    }
  };

  return (
    <div 
      ref={panelRef}
      className={`
        relative bg-gradient-to-b from-cyan-50 to-white border-r border-gray-200 
        flex flex-col h-full
        ${isResizing ? '' : 'transition-all duration-300'}
      `}
      style={{ 
        width: isExpanded ? `${width}px` : `${COLLAPSED_WIDTH}px`,
        minWidth: isExpanded ? `${MIN_WIDTH}px` : `${COLLAPSED_WIDTH}px`,
        maxWidth: isExpanded ? `${MAX_WIDTH}px` : `${COLLAPSED_WIDTH}px`
      }}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-6 w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center text-white hover:bg-cyan-700 transition-colors z-20 shadow-md"
      >
        {isExpanded ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {/* Resize Handle - Only visible when expanded */}
      {isExpanded && (
        <div
          onMouseDown={handleMouseDown}
          className={`
            absolute right-0 top-0 bottom-0 w-1 cursor-col-resize z-10
            hover:bg-cyan-400 transition-colors group
            ${isResizing ? 'bg-cyan-500' : 'bg-transparent hover:bg-cyan-300'}
          `}
        >
          {/* Grip indicator */}
          <div className={`
            absolute top-1/2 -translate-y-1/2 -right-1 
            flex items-center justify-center w-3 h-8 
            rounded bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity
            ${isResizing ? 'opacity-100 bg-cyan-400' : ''}
          `}>
            <GripVertical className="w-3 h-3 text-gray-500" />
          </div>
        </div>
      )}

      {/* Collapsed State */}
      {!isExpanded && (
        <div className="flex flex-col items-center py-4 space-y-3 w-full overflow-hidden">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-full flex items-center justify-center shadow-md">
            <Bot className="w-5 h-5 text-white" />
          </div>
          {/* Vertical text using inline style */}
          <div 
            className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
            style={{ 
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)',
              maxHeight: '100px'
            }}
          >
            AI
          </div>
          <div className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-cyan-600" />
          </div>
        </div>
      )}

      {/* Expanded State */}
      {isExpanded && (
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header Section */}
          <div className="p-4 flex-shrink-0">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                AI Specialist
              </div>
              <h3 className="text-lg font-bold text-gray-900">{specialist.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{specialist.experience}</p>
            </div>

            {/* Description Card */}
            <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
              <p className="text-xs text-gray-600 leading-relaxed">
                {specialist.description}
              </p>
            </div>

            <button className="mt-3 w-full text-sm text-cyan-700 font-medium hover:text-cyan-800 transition-colors flex items-center justify-center gap-1">
              <span>Switch Specialist</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Divider */}
          <div className="px-4">
            <div className="border-t border-gray-200" />
          </div>

          {/* Chat/Ask AI Section - Flexible height */}
          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-600" />
              Ask AI
            </h4>
            
            {/* Response Area */}
            <div className="flex-1 bg-white border border-gray-200 rounded-lg p-3 mb-3 overflow-y-auto">
              <p className="text-sm text-gray-500 italic">
                Ask me anything about {specialist.name.toLowerCase()} topics. I can help with architecture decisions, best practices, and technical recommendations.
              </p>
            </div>

            {/* Input Area */}
            <div className="flex-shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
                  placeholder="Type your question..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <button
                  onClick={handleAskAI}
                  disabled={!aiQuestion.trim()}
                  className={`
                    px-3 py-2 rounded-lg transition-colors flex items-center justify-center
                    ${aiQuestion.trim() 
                      ? 'bg-cyan-600 text-white hover:bg-cyan-700' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Width indicator during resize */}
          {isResizing && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
              {width}px
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AISpecialist;