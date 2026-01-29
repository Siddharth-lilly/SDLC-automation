// src/components/workspace/EditorPanel.jsx
import React from 'react';
import { Clock, History, FileText } from 'lucide-react'; // Add FileText here

const EditorPanel = ({ file, content, onContentChange, onCommit }) => {
  if (!file) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p>Select a file to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-semibold text-gray-900">{file.name}</h2>
          {file.modified && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
              Modified
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <button className="btn-ghost text-sm flex items-center space-x-2">
            <History className="w-4 h-4" />
            <span>History</span>
          </button>
          <button onClick={onCommit} className="btn-primary">
            Commit
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className="w-full h-full min-h-[500px] font-mono text-sm p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
          placeholder="Start typing..."
        />
      </div>

      <div className="border-t border-gray-200 px-6 py-2 text-xs text-gray-500 flex items-center space-x-4">
        <span className="flex items-center space-x-2">
          <Clock className="w-3 h-3" />
          <span>Edited by: {file.lastEditedBy} ({file.lastEditedTime})</span>
        </span>
      </div>
    </div>
  );
};

export default EditorPanel;