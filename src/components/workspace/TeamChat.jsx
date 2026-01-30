// src/components/workspace/TeamChat.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, MessageCircle, Minimize2 } from 'lucide-react';

const TeamChat = ({ messages, onSendMessage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(2); // Mock unread count
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Clear unread when opened
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getUserInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getUserColor = (name) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-indigo-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <>
      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Team Chat</h3>
                <p className="text-xs text-red-100">5 members online</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                title="Minimize"
              >
                <Minimize2 className="w-4 h-4 text-white" />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                title="Close"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isAI ? 'justify-start' : 'justify-start'}`}>
                <div className="flex space-x-3 max-w-[85%]">
                  {/* Avatar */}
                  {msg.isAI ? (
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0 shadow-sm
                      ${getUserColor(msg.author)}
                    `}>
                      {getUserInitials(msg.author)}
                    </div>
                  )}

                  {/* Message Content */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-sm text-gray-900">
                        {msg.isAI ? 'AI Architect' : msg.author}
                      </span>
                      <span className="text-xs text-gray-400">{msg.time}</span>
                    </div>
                    <div className={`
                      p-3 rounded-2xl rounded-tl-sm text-sm
                      ${msg.isAI 
                        ? 'bg-gradient-to-br from-cyan-50 to-blue-50 text-gray-800 border border-cyan-100' 
                        : 'bg-white text-gray-700 shadow-sm border border-gray-100'
                      }
                    `}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 bg-gray-100 border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all
                  ${newMessage.trim() 
                    ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center
          transition-all duration-300 z-50 group
          ${isOpen 
            ? 'bg-gray-700 hover:bg-gray-800 rotate-0' 
            : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:scale-110'
          }
        `}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 text-white" />
            {/* Unread Badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
            {/* Ripple Effect */}
            <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-20"></span>
          </>
        )}
      </button>

      {/* Tooltip on hover (when closed) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-24 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-gray-900 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap">
            Team Chat
          </div>
        </div>
      )}
    </>
  );
};

export default TeamChat;