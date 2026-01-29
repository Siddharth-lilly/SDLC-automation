// src/pages/WorkspaceView.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import StageIndicator from '../components/layout/StageIndicator';
import Sidebar from '../components/layout/Sidebar';
import EditorPanel from '../components/workspace/EditorPanel';
import TeamChat from '../components/workspace/TeamChat';
import AISpecialist from '../components/workspace/AISpecialist';
import OnlineUsers from '../components/workspace/OnlineUsers';
import WorkspaceTabs from '../components/workspace/WorkspaceTabs';

const WorkspaceView = () => {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState('workspace');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [chatCollapsed, setChatCollapsed] = useState(false);

  // Mock data
  const projectFiles = [
    {
      id: 'discover',
      name: 'Discover',
      gateStatus: 'passed',
      files: [
        { id: 'problem', name: 'Problem Statement.md', modified: false, lastEditedBy: 'Siva', lastEditedTime: '2h ago' },
        { id: 'stakeholder', name: 'Stakeholder Analysis.md', modified: false, lastEditedBy: 'Maya', lastEditedTime: '1d ago' },
        { id: 'current', name: 'Current State.md', modified: false, lastEditedBy: 'Priya', lastEditedTime: '2d ago' }
      ]
    },
    {
      id: 'define',
      name: 'Define',
      gateStatus: 'passed',
      files: [
        { id: 'brd', name: 'BRD v1.2.md', modified: false, lastEditedBy: 'Maya', lastEditedTime: '1d ago' },
        { id: 'rtm', name: 'RTM.md', modified: false, lastEditedBy: 'Siva', lastEditedTime: '1d ago' },
        { id: 'stories', name: 'User Stories.md', modified: false, lastEditedBy: 'Amit', lastEditedTime: '3d ago' }
      ]
    },
    {
      id: 'design',
      name: 'Design',
      gateStatus: 'pending',
      files: [
        { id: 'arch', name: 'Architecture Diagram.mermaid', modified: true, lastEditedBy: 'Priya', lastEditedTime: '2h ago' },
        { id: 'sdd', name: 'SDD draft.md', modified: false, lastEditedBy: 'Priya', lastEditedTime: '4h ago' }
      ]
    }
  ];

  const chatMessages = [
    { id: 1, author: 'Priya', content: 'Updated the diagram to show async queue for SAP integration', time: '2h ago', isAI: false },
    { id: 2, author: 'Siva', content: 'Looks good. What about the cache layer?', time: '1h ago', isAI: false },
    { id: 3, author: 'AI', content: 'Consider Redis for caching. Given your 200 concurrent users and real-time requirements, Redis would provide sub-millisecond latency for session management.', time: '1h ago', isAI: true }
  ];

  const onlineUsers = [
    { id: 1, name: 'Siva', initials: 'S', color: 'bg-red-600' },
    { id: 2, name: 'Priya', initials: 'P', color: 'bg-purple-600' },
    { id: 3, name: 'Raj', initials: 'R', color: 'bg-blue-600' },
    { id: 4, name: 'Maya', initials: 'M', color: 'bg-green-600' },
    { id: 5, name: 'Amit', initials: 'A', color: 'bg-orange-600' }
  ];

  const specialist = {
    name: 'Solution Architect',
    experience: '15+ years enterprise experience',
    description: 'I can help you design scalable architectures, choose the right technologies, and create technical documentation.'
  };

  const stageData = {
    discover: { status: 'passed', itemCount: 12 },
    define: { status: 'passed', itemCount: 8 },
    design: { status: 'active', itemCount: 3 },
    build: { status: 'pending', itemCount: 0 },
    deliver: { status: 'pending', itemCount: 0 }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header projectName="Legal Request Intake App" onShareClick={() => {}} />
      
      <StageIndicator currentStage="design" stageData={stageData} />
      
      <OnlineUsers users={onlineUsers} count={5} />
      
      <WorkspaceTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex overflow-hidden">
        <AISpecialist specialist={specialist} onAskAI={() => {}} />
        
        <Sidebar 
          projectFiles={projectFiles} 
          onFileSelect={(file) => {
            setSelectedFile(file);
            setFileContent(`# ${file.name}\n\n`);
          }}
          selectedFile={selectedFile}
        />
        
        <EditorPanel 
          file={selectedFile}
          content={fileContent}
          onContentChange={setFileContent}
          onCommit={() => {}}
        />
        
        <TeamChat 
          messages={chatMessages}
          onSendMessage={(msg) => {}}
          collapsed={chatCollapsed}
          onToggleCollapse={() => setChatCollapsed(!chatCollapsed)}
        />
      </div>
    </div>
  );
};

export default WorkspaceView;