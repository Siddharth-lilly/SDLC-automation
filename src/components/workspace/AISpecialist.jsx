// src/components/workspace/AISpecialist.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, Sparkles, ChevronLeft, ChevronRight, GripVertical, Send, User } from 'lucide-react';

const AISpecialist = ({ specialist, onAskAI, conversation = [] }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [width, setWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const panelRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  const MIN_WIDTH = 280;
  const MAX_WIDTH = 500;
  const COLLAPSED_WIDTH = 48;

  // ✅ Auto-scroll to bottom when conversation updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

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

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskAI();
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
      {/* Resize Handle */}
      {isExpanded && (
        <div
          onMouseDown={handleMouseDown}
          className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-cyan-400 transition-colors z-10 group"
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-3 h-3 text-gray-400" />
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-4 z-20 w-6 h-6 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
      >
        {isExpanded ? <ChevronLeft className="w-4 h-4 text-gray-600" /> : <ChevronRight className="w-4 h-4 text-gray-600" />}
      </button>

      {/* Collapsed State */}
      {!isExpanded && (
        <div className="flex flex-col items-center py-4 space-y-4">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-full flex items-center justify-center shadow-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-medium text-gray-600 writing-mode-vertical" style={{ writingMode: 'vertical-rl' }}>
            AI Specialist
          </span>
        </div>
      )}

      {/* Expanded State */}
      {isExpanded && (
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header Section */}
          <div className="p-4 flex-shrink-0 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  AI Specialist
                </div>
                <h3 className="text-base font-bold text-gray-900 truncate">{specialist.name}</h3>
                <p className="text-xs text-gray-500 truncate">{specialist.experience}</p>
              </div>
            </div>
          </div>

          {/* ✅ Conversation Area - Now displays actual messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50/50">
            {conversation.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <Sparkles className="w-8 h-8 text-cyan-400 mb-3" />
                <p className="text-sm text-gray-500 leading-relaxed">
                  {specialist.description}
                </p>
                <p className="text-xs text-gray-400 mt-3">
                  Ask me anything about {specialist.name.toLowerCase()} topics!
                </p>
              </div>
            ) : (
              <>
                {conversation.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-2 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      {/* Avatar */}
                      <div className={`
                        w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0
                        ${msg.role === 'user' 
                          ? 'bg-gray-600' 
                          : 'bg-gradient-to-br from-cyan-500 to-cyan-700'
                        }
                      `}>
                        {msg.role === 'user' 
                          ? <User className="w-4 h-4 text-white" />
                          : <Bot className="w-4 h-4 text-white" />
                        }
                      </div>
                      
                      {/* Message Bubble */}
                      <div className={`
                        p-3 rounded-2xl text-sm
                        ${msg.role === 'user'
                          ? 'bg-gray-600 text-white rounded-tr-sm'
                          : 'bg-white border border-cyan-100 text-gray-700 rounded-tl-sm shadow-sm'
                        }
                      `}>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        <span className={`text-xs mt-1 block ${msg.role === 'user' ? 'text-gray-300' : 'text-gray-400'}`}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-gray-200 bg-white flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask ${specialist.name}...`}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <button
                onClick={handleAskAI}
                disabled={!aiQuestion.trim()}
                className={`
                  w-9 h-9 rounded-full transition-colors flex items-center justify-center flex-shrink-0
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

          {/* Resize Indicator */}
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