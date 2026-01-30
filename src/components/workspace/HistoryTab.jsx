// src/components/workspace/HistoryTab.jsx
import React, { useState } from 'react';
import { 
  GitCommit, 
  Clock, 
  FileText, 
  ChevronRight, 
  RotateCcw, 
  Eye, 
  GitCompare, 
  Filter, 
  Search 
} from 'lucide-react';

// Stage color mapping
const stageColors = {
  discover: 'bg-purple-100 text-purple-700',
  define: 'bg-blue-100 text-blue-700',
  design: 'bg-orange-100 text-orange-700',
  develop: 'bg-green-100 text-green-700',
  build: 'bg-cyan-100 text-cyan-700',
  testing: 'bg-yellow-100 text-yellow-700',
  delivery: 'bg-pink-100 text-pink-700'
};

// Commit Card Component
const CommitCard = ({ commit, isSelected, onSelect, onViewDiff, onRollback }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className={`
      border rounded-lg transition-all
      ${isSelected ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'}
    `}>
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Commit indicator */}
          <div className="flex flex-col items-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center
              ${isSelected ? 'bg-red-600' : 'bg-gray-700'}
            `}>
              <GitCommit className="w-5 h-5 text-white" />
            </div>
            <div className="w-0.5 h-full bg-gray-200 mt-2" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="font-semibold text-gray-900">{commit.message}</h4>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium">
                      {commit.author.avatar}
                    </div>
                    {commit.author.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {commit.timestamp}
                  </span>
                  <span className={`
                    px-2 py-0.5 rounded text-xs font-medium capitalize
                    ${stageColors[commit.stage] || 'bg-gray-100 text-gray-700'}
                  `}>
                    {commit.stage}
                  </span>
                </div>
              </div>
              <code className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {commit.id}
              </code>
            </div>
            
            {/* Artifacts changed */}
            <div className="mt-3 flex flex-wrap gap-2">
              {commit.artifacts.map((artifact, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm"
                >
                  <FileText className="w-3 h-3 text-gray-500" />
                  {artifact.name}
                  <span className="text-green-600 text-xs">{artifact.changes}</span>
                </span>
              ))}
            </div>
            
            {/* Expandable description */}
            {commit.description && (
              <button 
                onClick={() => setExpanded(!expanded)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <ChevronRight className={`
                  w-4 h-4 transition-transform
                  ${expanded ? 'rotate-90' : ''}
                `} />
                {expanded ? 'Hide details' : 'Show details'}
              </button>
            )}
            
            {expanded && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{commit.description}</p>
                {commit.linkedItems && commit.linkedItems.length > 0 && (
                  <div className="mt-2 flex gap-2">
                    <span className="text-xs text-gray-500">Linked:</span>
                    {commit.linkedItems.map((item, idx) => (
                      <span 
                        key={idx} 
                        className="text-xs text-blue-600 hover:underline cursor-pointer"
                      >
                        {item.id}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Actions */}
            <div className="mt-3 flex items-center gap-2">
              <button 
                onClick={() => onViewDiff(commit)}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100"
              >
                <GitCompare className="w-4 h-4" /> View Changes
              </button>
              <button 
                onClick={() => onSelect(commit)}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100"
              >
                <Eye className="w-4 h-4" /> Preview
              </button>
              <button 
                onClick={() => onRollback(commit)}
                className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-orange-50"
              >
                <RotateCcw className="w-4 h-4" /> Rollback
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HistoryTab = ({ commits, onRollback }) => {
  const [selectedCommit, setSelectedCommit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [showDiffModal, setShowDiffModal] = useState(false);
  const [diffCommit, setDiffCommit] = useState(null);
  
  // Default mock data if no commits provided
  const defaultCommits = [
    {
      id: 'c8f2a1b',
      message: 'Updated architecture diagram with async queue pattern',
      description: 'Addresses NFR-007 (async processing). Added message queue between API gateway and processing service.',
      author: { name: 'Priya', avatar: 'P', role: 'Solution Architect' },
      timestamp: '2 hours ago',
      date: '2024-01-15 14:32',
      stage: 'design',
      artifacts: [
        { name: 'Architecture Diagram', type: 'diagram', changes: '+15 -3' },
        { name: 'Solution Design Document', type: 'document', changes: '+42 -8' }
      ],
      linkedItems: [{ type: 'requirement', id: 'FR-012' }, { type: 'task', id: 'TASK-045' }]
    },
    {
      id: 'b7e3d2c',
      message: 'Completed security review section in SDD',
      description: 'Added authentication flow diagrams and security considerations for API endpoints.',
      author: { name: 'Siva', avatar: 'S', role: 'PM' },
      timestamp: '5 hours ago',
      date: '2024-01-15 11:15',
      stage: 'design',
      artifacts: [
        { name: 'Solution Design Document', type: 'document', changes: '+28 -2' }
      ],
      linkedItems: [{ type: 'requirement', id: 'NFR-003' }]
    },
    {
      id: 'a6d4c3e',
      message: 'Added NFR mapping to architecture components',
      description: 'Mapped all non-functional requirements to specific architecture components and patterns.',
      author: { name: 'Priya', avatar: 'P', role: 'Solution Architect' },
      timestamp: '1 day ago',
      date: '2024-01-14 16:45',
      stage: 'design',
      artifacts: [
        { name: 'NFR Traceability Matrix', type: 'spreadsheet', changes: '+56 -0' },
        { name: 'Architecture Diagram', type: 'diagram', changes: '+8 -2' }
      ],
      linkedItems: []
    },
    {
      id: 'f5b2a1d',
      message: 'Finalized Business Requirements Document',
      description: 'Completed all sections of the BRD including stakeholder sign-off.',
      author: { name: 'Raj', avatar: 'R', role: 'Business Analyst' },
      timestamp: '2 days ago',
      date: '2024-01-13 10:20',
      stage: 'define',
      artifacts: [
        { name: 'Business Requirements Document', type: 'document', changes: '+124 -15' }
      ],
      linkedItems: [{ type: 'gate', id: 'Define → Design' }]
    },
    {
      id: 'e4c1b0f',
      message: 'Initial stakeholder interview notes',
      description: 'Captured requirements from initial stakeholder interviews with Legal and Operations teams.',
      author: { name: 'Raj', avatar: 'R', role: 'Business Analyst' },
      timestamp: '5 days ago',
      date: '2024-01-10 14:00',
      stage: 'discover',
      artifacts: [
        { name: 'Interview Notes', type: 'document', changes: '+89 -0' },
        { name: 'Stakeholder Map', type: 'diagram', changes: '+12 -0' }
      ],
      linkedItems: []
    }
  ];

  const data = commits || defaultCommits;
  const stages = ['all', ...new Set(data.map(c => c.stage))];
  
  // Filter commits
  const filteredCommits = data.filter(commit => {
    const matchesSearch = commit.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         commit.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === 'all' || commit.stage === stageFilter;
    return matchesSearch && matchesStage;
  });
  
  const handleViewDiff = (commit) => {
    setDiffCommit(commit);
    setShowDiffModal(true);
  };
  
  const handleRollback = (commit) => {
    if (window.confirm(`Are you sure you want to rollback to commit ${commit.id}?\n\nThis will revert all changes made after "${commit.message}"`)) {
      if (onRollback) {
        onRollback(commit);
      } else {
        alert(`Rollback to ${commit.id} initiated`);
      }
    }
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <GitCommit className="w-6 h-6" />
            Version History
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {data.length} commits in this project
          </p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search commits by message or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {stages.map(stage => (
                <option key={stage} value={stage}>
                  {stage === 'all' ? 'All Stages' : stage.charAt(0).toUpperCase() + stage.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Timeline */}
      <div className="space-y-4">
        {filteredCommits.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <GitCommit className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No commits found matching your filters</p>
          </div>
        ) : (
          filteredCommits.map((commit) => (
            <CommitCard
              key={commit.id}
              commit={commit}
              isSelected={selectedCommit?.id === commit.id}
              onSelect={setSelectedCommit}
              onViewDiff={handleViewDiff}
              onRollback={handleRollback}
            />
          ))
        )}
      </div>
      
      {/* Diff Modal */}
      {showDiffModal && diffCommit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">
                  Changes in {diffCommit.id}
                </h3>
                <p className="text-sm text-gray-500">{diffCommit.message}</p>
              </div>
              <button 
                onClick={() => setShowDiffModal(false)} 
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-96">
              {diffCommit.artifacts.map((artifact, idx) => (
                <div key={idx} className="mb-4 border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 flex items-center justify-between">
                    <span className="font-medium text-sm">{artifact.name}</span>
                    <span className="text-sm text-green-600">{artifact.changes}</span>
                  </div>
                  <div className="p-4 bg-gray-50 font-mono text-sm">
                    <div className="text-green-600">+ Added async message queue pattern</div>
                    <div className="text-green-600">+ Added Redis caching layer</div>
                    <div className="text-red-600">- Removed synchronous API calls</div>
                    <div className="text-gray-500">  // ... more changes</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
              <button 
                onClick={() => setShowDiffModal(false)} 
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  handleRollback(diffCommit);
                  setShowDiffModal(false);
                }} 
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Rollback to this version
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryTab;