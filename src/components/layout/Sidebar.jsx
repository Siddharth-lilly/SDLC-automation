// src/components/layout/Sidebar.jsx
import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  FileText, 
  Folder,
  FolderOpen,
  Check,
  Circle,
  Clock,
  Lock,
  Eye
} from 'lucide-react';
import { getStageOrder } from './StageIndicator';

const Sidebar = ({ 
  projectFiles, 
  onFileSelect, 
  selectedFile,
  viewingStage,
  currentStage 
}) => {
  const [expandedFolders, setExpandedFolders] = useState({
    discover: true,
    define: true,
    design: true,
    develop: true,
    build: true,
    testing: true,
    delivery: true
  });

  // Filter project files based on viewing stage
  const filteredFiles = useMemo(() => {
    if (!viewingStage || !projectFiles) return projectFiles;
    
    const viewingOrder = getStageOrder(viewingStage);
    
    return projectFiles.filter(folder => {
      const folderOrder = getStageOrder(folder.id);
      return folderOrder <= viewingOrder;
    });
  }, [projectFiles, viewingStage]);

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
      case 'active':
        return <Circle className="w-4 h-4 text-red-600 fill-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getGateStatusText = (status) => {
    switch (status) {
      case 'passed':
        return 'Gate Passed';
      case 'active':
        return 'In Progress';
      case 'pending':
        return 'Gate Pending';
      default:
        return 'Not Started';
    }
  };

  const isCurrentViewingFolder = (folderId) => {
    return viewingStage === folderId;
  };

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-full overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center justify-between">
          <span>Project Files</span>
          {viewingStage && (
            <span className="flex items-center gap-1 text-blue-600 normal-case font-medium">
              <Eye className="w-3 h-3" />
              {viewingStage}
            </span>
          )}
        </h3>
      </div>

      {/* File Tree */}
      <nav className="flex-1 p-4 space-y-1">
        {filteredFiles && filteredFiles.length > 0 ? (
          filteredFiles.map((folder) => {
            const isExpanded = expandedFolders[folder.id];
            const isViewing = isCurrentViewingFolder(folder.id);
            
            return (
              <div key={folder.id} className="mb-2">
                {/* Folder Header */}
                <button
                  onClick={() => toggleFolder(folder.id)}
                  className={`
                    w-full flex items-center justify-between px-2 py-2 text-sm rounded-md transition-colors
                    ${isViewing 
                      ? 'bg-blue-100 hover:bg-blue-150' 
                      : 'hover:bg-gray-200'
                    }
                  `}
                >
                  <div className="flex items-center space-x-2">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    )}
                    {isExpanded ? (
                      <FolderOpen className={`w-4 h-4 ${isViewing ? 'text-blue-600' : 'text-yellow-600'}`} />
                    ) : (
                      <Folder className={`w-4 h-4 ${isViewing ? 'text-blue-600' : 'text-yellow-600'}`} />
                    )}
                    <span className={`
                      font-medium capitalize
                      ${isViewing ? 'text-blue-700' : 'text-gray-700'}
                    `}>
                      {folder.name}
                    </span>
                  </div>
                  {getGateStatusIcon(folder.gateStatus)}
                </button>

                {/* Gate Status Badge */}
                {isExpanded && (
                  <div className={`
                    ml-6 mt-1 mb-2 px-2 py-1 rounded text-xs flex items-center gap-1
                    ${folder.gateStatus === 'passed' ? 'bg-green-100 text-green-700' : ''}
                    ${folder.gateStatus === 'active' ? 'bg-red-100 text-red-700' : ''}
                    ${folder.gateStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                    ${!folder.gateStatus ? 'bg-gray-100 text-gray-600' : ''}
                  `}>
                    {getGateStatusIcon(folder.gateStatus)}
                    <span>{getGateStatusText(folder.gateStatus)}</span>
                  </div>
                )}

                {/* Files */}
                {isExpanded && folder.files && (
                  <div className="ml-6 mt-1 space-y-1">
                    {folder.files.map((file) => (
                      <button
                        key={file.id}
                        onClick={() => onFileSelect(file)}
                        className={`
                          w-full flex items-center space-x-2 px-2 py-2 text-sm rounded-md transition-colors
                          ${selectedFile?.id === file.id 
                            ? 'bg-red-100 text-red-700 font-medium' 
                            : 'hover:bg-gray-200 text-gray-700'
                          }
                        `}
                      >
                        <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="truncate flex-1 text-left">{file.name}</span>
                        {file.modified && (
                          <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" title="Modified" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Lock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No files available</p>
            <p className="text-xs mt-1">Select a stage to view files</p>
          </div>
        )}
      </nav>

      {/* Footer with stage count */}
      {filteredFiles && filteredFiles.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-white text-xs text-gray-500">
          Showing {filteredFiles.length} stage{filteredFiles.length !== 1 ? 's' : ''} 
          {viewingStage && viewingStage !== currentStage && (
            <span className="text-blue-600"> (up to {viewingStage})</span>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;