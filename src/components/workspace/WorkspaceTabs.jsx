// src/components/workspace/WorkspaceTabs.jsx
import React from 'react';
import { FileText, Users, History } from 'lucide-react';

const WorkspaceTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'workspace', label: 'Workspace', icon: FileText },
    { id: 'stagegate', label: 'Stage Gate', icon: Users },
    { id: 'history', label: 'History', icon: History }
  ];

  return (
    <div className="flex border-b border-gray-200 bg-white px-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors
              ${isActive 
                ? 'border-red-600 text-red-600 font-semibold' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default WorkspaceTabs;