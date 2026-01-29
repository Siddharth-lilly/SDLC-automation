// src/components/layout/Sidebar.jsx
import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  FileText, 
  Folder, 
  Check,
  Circle,
  Clock
} from 'lucide-react';

const Sidebar = ({ projectFiles, onFileSelect, selectedFile }) => {
  const [expandedFolders, setExpandedFolders] = useState({
    discover: true,
    define: true,
    design: true
  });

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const getGateStatusIcon = (status) => {
    switch (status) {
      case 'passed':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Project Files
        </h3>

        <nav className="space-y-1">
          {projectFiles.map((folder) => (
            <div key={folder.id}>
              <button
                onClick={() => toggleFolder(folder.id)}
                className="w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-gray-200 rounded-md transition-colors"
              >
                <div className="flex items-center space-x-2">
                  {expandedFolders[folder.id] ? (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  )}
                  <Folder className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-700 capitalize">
                    {folder.name}
                  </span>
                </div>
              </button>

              {expandedFolders[folder.id] && (
                <div className="ml-6 mt-1 space-y-1">
                  {folder.files.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => onFileSelect(file)}
                      className={`
                        w-full flex items-center space-x-2 px-2 py-2 text-sm rounded-md transition-colors
                        ${selectedFile?.id === file.id ? 'bg-red-100 text-red-700' : 'hover:bg-gray-200 text-gray-700'}
                      `}
                    >
                      <FileText className="w-4 h-4" />
                      <span className="flex-1 text-left">{file.name}</span>
                      {file.modified && (
                        <span className="text-xs text-yellow-600">●</span>
                      )}
                    </button>
                  ))}

                  {folder.gateStatus && (
                    <div className={`
                      flex items-center space-x-2 px-2 py-2 text-xs rounded-md mt-2
                      ${folder.gateStatus === 'passed' ? 'bg-green-100 text-green-700' : ''}
                      ${folder.gateStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                    `}>
                      {getGateStatusIcon(folder.gateStatus)}
                      <span className="font-semibold uppercase">
                        Gate {folder.gateStatus}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;