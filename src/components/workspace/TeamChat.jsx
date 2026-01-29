// src/components/workspace/TeamChat.jsx
import React, { useState } from 'react';
import { Send, Bot, ChevronDown, ChevronUp } from 'lucide-react';

const TeamChat = ({ messages, onSendMessage, collapsed, onToggleCollapse }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const getUserInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getUserColor = (name) => {
    const colors = [
      'bg-red-600',
      'bg-blue-600',
      'bg-green-600',
      'bg-purple-600',
      'bg-orange-600'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (collapsed) {
    return (
      <button
        onClick={onToggleCollapse}
        className="w-12 bg-gray-100 border-l border-gray-200 flex items-center justify-center hover:bg-gray-200 transition-colors"
      >
        <ChevronUp className="w-5 h-5 text-gray-600" />
      </button>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
          <span>💬</span>
          <span>Team Chat</span>
        </h3>
        <button onClick={onToggleCollapse} className="p-1 hover:bg-gray-100 rounded">
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="flex space-x-3">
            {msg.isAI ? (
              <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
            ) : (
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0
                ${getUserColor(msg.author)}
              `}>
                {getUserInitials(msg.author)}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-semibold text-sm text-gray-900">
                  {msg.isAI ? 'AI Architect' : msg.author}
                </span>
                <span className="text-xs text-gray-500">{msg.time}</span>
              </div>
              <p className="text-sm text-gray-700 break-words">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamChat;