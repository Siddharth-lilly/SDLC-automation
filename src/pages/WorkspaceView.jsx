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
import StageGateTab from '../components/workspace/StageGateTab';
import HistoryTab from '../components/workspace/HistoryTab';

const WorkspaceView = () => {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState('workspace');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  
  // ✅ NEW: Current stage (the actual project progress)
  const currentStage = 'design';
  
  // ✅ NEW: Viewing stage (which stage's files are being viewed)
  const [viewingStage, setViewingStage] = useState(currentStage);

  // Mock data for project files - includes all stages
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
      gateStatus: 'active',
      files: [
        { id: 'arch', name: 'Architecture Diagram.mermaid', modified: true, lastEditedBy: 'Priya', lastEditedTime: '2h ago' },
        { id: 'sdd', name: 'SDD draft.md', modified: false, lastEditedBy: 'Priya', lastEditedTime: '4h ago' }
      ]
    },
    {
      id: 'develop',
      name: 'Develop',
      gateStatus: 'pending',
      files: [
        { id: 'api-spec', name: 'API Specification.md', modified: false, lastEditedBy: null, lastEditedTime: null },
        { id: 'db-schema', name: 'Database Schema.md', modified: false, lastEditedBy: null, lastEditedTime: null }
      ]
    },
    {
      id: 'build',
      name: 'Build',
      gateStatus: 'pending',
      files: []
    },
    {
      id: 'testing',
      name: 'Testing',
      gateStatus: 'pending',
      files: []
    },
    {
      id: 'delivery',
      name: 'Delivery',
      gateStatus: 'pending',
      files: []
    }
  ];

  // Mock data for chat messages
  const [chatMessages, setChatMessages] = useState([
    { id: 1, author: 'Priya', content: 'Updated the diagram to show async queue for SAP integration', time: '2h ago', isAI: false },
    { id: 2, author: 'Siva', content: 'Looks good. What about the cache layer?', time: '1h ago', isAI: false },
    { id: 3, author: 'AI', content: 'Consider Redis for caching. Given your 200 concurrent users and real-time requirements, Redis would provide sub-millisecond latency for session management.', time: '1h ago', isAI: true },
    { id: 4, author: 'Raj', content: '+1, we used that on PPS project', time: '45m ago', isAI: false }
  ]);

  // Mock data for online users
  const onlineUsers = [
    { id: 1, name: 'Siva', initials: 'S', color: 'bg-red-600' },
    { id: 2, name: 'Priya', initials: 'P', color: 'bg-purple-600' },
    { id: 3, name: 'Raj', initials: 'R', color: 'bg-blue-600' },
    { id: 4, name: 'Maya', initials: 'M', color: 'bg-green-600' },
    { id: 5, name: 'Amit', initials: 'A', color: 'bg-orange-600' }
  ];

  // Mock data for AI specialist - changes based on viewing stage
  const specialistByStage = {
    discover: {
      name: 'Business Analyst',
      experience: '10+ years requirements gathering',
      description: 'I can help you understand stakeholder needs, document current state, and identify pain points.'
    },
    define: {
      name: 'Technical Writer',
      experience: '12+ years documentation',
      description: 'I can help you create BRDs, user stories, and requirements traceability matrices.'
    },
    design: {
      name: 'Solution Architect',
      experience: '15+ years enterprise experience',
      description: 'I can help you design scalable architectures, choose the right technologies, and create technical documentation.'
    },
    develop: {
      name: 'Senior Developer',
      experience: '10+ years full-stack development',
      description: 'I can help you write clean code, implement best practices, and review technical implementations.'
    },
    build: {
      name: 'DevOps Engineer',
      experience: '8+ years CI/CD pipelines',
      description: 'I can help you set up build pipelines, deployments, and infrastructure as code.'
    },
    testing: {
      name: 'QA Lead',
      experience: '10+ years testing',
      description: 'I can help you create test plans, write test cases, and ensure quality standards.'
    },
    delivery: {
      name: 'Release Manager',
      experience: '8+ years release management',
      description: 'I can help you plan releases, coordinate deployments, and manage go-live activities.'
    }
  };

  const specialist = specialistByStage[viewingStage] || specialistByStage.design;

  // Mock data for stage indicator
  const stageData = {
    discover: { status: 'passed', itemCount: 12 },
    define: { status: 'passed', itemCount: 8 },
    design: { status: 'active', itemCount: 3 },
    develop: { status: 'pending', itemCount: 0 },
    build: { status: 'pending', itemCount: 0 },
    testing: { status: 'pending', itemCount: 0 },
    delivery: { status: 'pending', itemCount: 0 }
  };

  // Mock data for Stage Gate - different data for each stage
  const gateDataByStage = {
    discover: {
      currentStage: 'discover',
      nextStage: 'define',
      gateName: 'Discovery Review',
      gateType: 'approval',
      requiredApprovals: 2,
      totalApprovers: 3,
      status: 'passed',
      checklist: [
        { id: 1, label: 'Problem statement documented', completed: true, completedBy: 'Siva', completedAt: '1 week ago' },
        { id: 2, label: 'Stakeholder interviews completed', completed: true, completedBy: 'Maya', completedAt: '1 week ago' },
        { id: 3, label: 'Current state analysis done', completed: true, completedBy: 'Raj', completedAt: '6 days ago' },
        { id: 4, label: 'Pain points identified', completed: true, completedBy: 'Maya', completedAt: '6 days ago' },
      ],
      approvals: [
        { id: 1, user: 'Siva', role: 'PM', status: 'approved', comment: 'Good discovery work, ready to move forward', timestamp: '5 days ago', avatar: 'S' },
        { id: 2, user: 'Maya', role: 'BA Lead', status: 'approved', comment: 'All stakeholders aligned', timestamp: '5 days ago', avatar: 'M' },
        { id: 3, user: 'Priya', role: 'Architect', status: 'approved', comment: 'Clear problem definition', timestamp: '5 days ago', avatar: 'P' },
      ],
      autoChecks: [
        { id: 1, label: 'All checklist items complete', passed: true },
        { id: 2, label: 'Stakeholder sign-off obtained', passed: true },
        { id: 3, label: 'AI quality score > 80%', passed: true, score: 92 },
      ]
    },
    define: {
      currentStage: 'define',
      nextStage: 'design',
      gateName: 'Requirements Review',
      gateType: 'approval',
      requiredApprovals: 3,
      totalApprovers: 4,
      status: 'passed',
      checklist: [
        { id: 1, label: 'BRD completed and reviewed', completed: true, completedBy: 'Raj', completedAt: '3 days ago' },
        { id: 2, label: 'User stories written', completed: true, completedBy: 'Maya', completedAt: '3 days ago' },
        { id: 3, label: 'RTM created', completed: true, completedBy: 'Raj', completedAt: '2 days ago' },
        { id: 4, label: 'Acceptance criteria defined', completed: true, completedBy: 'Maya', completedAt: '2 days ago' },
        { id: 5, label: 'Business sign-off obtained', completed: true, completedBy: 'Siva', completedAt: '2 days ago' },
      ],
      approvals: [
        { id: 1, user: 'Siva', role: 'PM', status: 'approved', comment: 'Requirements are comprehensive', timestamp: '2 days ago', avatar: 'S' },
        { id: 2, user: 'Raj', role: 'BA', status: 'approved', comment: 'All user stories have acceptance criteria', timestamp: '2 days ago', avatar: 'R' },
        { id: 3, user: 'Priya', role: 'Architect', status: 'approved', comment: 'Ready for design phase', timestamp: '2 days ago', avatar: 'P' },
        { id: 4, user: 'Ananya', role: 'QA Lead', status: 'approved', comment: 'Testable requirements', timestamp: '2 days ago', avatar: 'A' },
      ],
      autoChecks: [
        { id: 1, label: 'All checklist items complete', passed: true },
        { id: 2, label: 'No unresolved comments', passed: true },
        { id: 3, label: 'AI quality score > 80%', passed: true, score: 88 },
      ]
    },
    design: {
      currentStage: 'design',
      nextStage: 'develop',
      gateName: 'Design Review',
      gateType: 'approval',
      requiredApprovals: 3,
      totalApprovers: 5,
      status: 'ready',
      checklist: [
        { id: 1, label: 'Architecture diagram committed', completed: true, completedBy: 'Priya', completedAt: '2 days ago' },
        { id: 2, label: 'Solution Design Document complete', completed: true, completedBy: 'Raj', completedAt: '1 day ago' },
        { id: 3, label: 'NFRs mapped to architecture', completed: true, completedBy: 'Priya', completedAt: '1 day ago' },
        { id: 4, label: 'Security review completed', completed: true, completedBy: 'Siva', completedAt: '12 hours ago' },
        { id: 5, label: 'Cost estimate approved', completed: false, completedBy: null, completedAt: null },
        { id: 6, label: 'Tech lead sign-off', completed: false, completedBy: null, completedAt: null },
      ],
      approvals: [
        { id: 1, user: 'Siva', role: 'PM', status: 'approved', comment: 'LGTM, cost looks reasonable', timestamp: '3 hours ago', avatar: 'S' },
        { id: 2, user: 'Priya', role: 'Architect', status: 'approved', comment: 'Ready for build', timestamp: '2 hours ago', avatar: 'P' },
        { id: 3, user: 'Raj', role: 'Dev Lead', status: 'pending', comment: null, timestamp: null, avatar: 'R' },
        { id: 4, user: 'Ananya', role: 'QA Lead', status: 'pending', comment: null, timestamp: null, avatar: 'A' },
        { id: 5, user: 'Kumar', role: 'Security', status: 'pending', comment: null, timestamp: null, avatar: 'K' },
      ],
      autoChecks: [
        { id: 1, label: 'All checklist items complete', passed: false },
        { id: 2, label: 'No unresolved comments', passed: true },
        { id: 3, label: 'AI quality score > 80%', passed: true, score: 87 },
      ]
    },
    develop: {
      currentStage: 'develop',
      nextStage: 'build',
      gateName: 'Development Review',
      gateType: 'approval',
      requiredApprovals: 3,
      totalApprovers: 4,
      status: 'pending',
      checklist: [
        { id: 1, label: 'API specifications complete', completed: false, completedBy: null, completedAt: null },
        { id: 2, label: 'Database schema finalized', completed: false, completedBy: null, completedAt: null },
        { id: 3, label: 'Code review completed', completed: false, completedBy: null, completedAt: null },
        { id: 4, label: 'Unit tests written', completed: false, completedBy: null, completedAt: null },
      ],
      approvals: [
        { id: 1, user: 'Priya', role: 'Architect', status: 'pending', comment: null, timestamp: null, avatar: 'P' },
        { id: 2, user: 'Raj', role: 'Dev Lead', status: 'pending', comment: null, timestamp: null, avatar: 'R' },
        { id: 3, user: 'Amit', role: 'Senior Dev', status: 'pending', comment: null, timestamp: null, avatar: 'A' },
        { id: 4, user: 'Kumar', role: 'Security', status: 'pending', comment: null, timestamp: null, avatar: 'K' },
      ],
      autoChecks: [
        { id: 1, label: 'All checklist items complete', passed: false },
        { id: 2, label: 'Code coverage > 80%', passed: false },
        { id: 3, label: 'No critical vulnerabilities', passed: false },
      ]
    },
    build: {
      currentStage: 'build',
      nextStage: 'testing',
      gateName: 'Build Review',
      gateType: 'approval',
      requiredApprovals: 2,
      totalApprovers: 3,
      status: 'pending',
      checklist: [],
      approvals: [],
      autoChecks: []
    },
    testing: {
      currentStage: 'testing',
      nextStage: 'delivery',
      gateName: 'UAT Review',
      gateType: 'approval',
      requiredApprovals: 2,
      totalApprovers: 3,
      status: 'pending',
      checklist: [],
      approvals: [],
      autoChecks: []
    },
    delivery: {
      currentStage: 'delivery',
      nextStage: 'delivery',
      gateName: 'Go-Live Review',
      gateType: 'approval',
      requiredApprovals: 4,
      totalApprovers: 5,
      status: 'pending',
      checklist: [],
      approvals: [],
      autoChecks: []
    }
  };

  // Get gate data for the currently viewing stage
  const gateData = gateDataByStage[viewingStage] || gateDataByStage.design;

  // Mock data for History
  const commitHistory = [
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
      description: 'Added authentication flow diagrams and security considerations.',
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
    }
  ];

  // Helper function to get next stage
  function getNextStage(stage) {
    const stageOrder = ['discover', 'define', 'design', 'develop', 'build', 'testing', 'delivery'];
    const currentIndex = stageOrder.indexOf(stage);
    return currentIndex < stageOrder.length - 1 ? stageOrder[currentIndex + 1] : stage;
  }

  // ✅ NEW: Handle stage click from StageIndicator
  const handleStageClick = (stageId) => {
    setViewingStage(stageId);
    setSelectedFile(null); // Clear selected file when changing stages
    setFileContent('');
  };

  // Handler functions
  const handleApprove = (comment) => {
    console.log('Approved with comment:', comment);
  };

  const handleReject = (comment) => {
    console.log('Rejected with comment:', comment);
  };

  const handleRollback = (commit) => {
    console.log('Rolling back to commit:', commit.id);
  };

  const handleSendMessage = (message) => {
    const newMsg = {
      id: chatMessages.length + 1,
      author: 'You',
      content: message,
      time: 'Just now',
      isAI: false
    };
    setChatMessages([...chatMessages, newMsg]);
  };

  const handleAskAI = (question) => {
    console.log('AI Question:', question);
    // Add AI response to chat
    const aiResponse = {
      id: chatMessages.length + 1,
      author: 'AI',
      content: `Based on your question about "${question}", here's my recommendation for the ${viewingStage} stage...`,
      time: 'Just now',
      isAI: true
    };
    setChatMessages([...chatMessages, aiResponse]);
  };

  // Function to render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'stagegate':
        return (
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <StageGateTab 
              gateData={gateData}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </div>
        );
      
      case 'history':
        return (
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <HistoryTab 
              commits={commitHistory}
              onRollback={handleRollback}
            />
          </div>
        );
      
      case 'workspace':
      default:
        return (
          <div className="flex-1 flex overflow-hidden">
            <AISpecialist 
              specialist={specialist} 
              onAskAI={handleAskAI} 
            />
            
            <Sidebar 
              projectFiles={projectFiles} 
              onFileSelect={(file) => {
                setSelectedFile(file);
                setFileContent(`# ${file.name}\n\nContent for ${file.name}`);
              }}
              selectedFile={selectedFile}
              viewingStage={viewingStage}
              currentStage={currentStage}
            />
            
            <EditorPanel 
              file={selectedFile}
              content={fileContent}
              onContentChange={setFileContent}
              onCommit={() => {}}
            />
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header projectName="Legal Request Intake App" onShareClick={() => {}} />
      
      {/* ✅ UPDATED: Pass viewingStage and onStageClick */}
      <StageIndicator 
        currentStage={currentStage} 
        viewingStage={viewingStage}
        stageData={stageData}
        onStageClick={handleStageClick}
      />
      
      <OnlineUsers users={onlineUsers} count={5} />
      
      <WorkspaceTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      {renderTabContent()}

      <TeamChat 
        messages={chatMessages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default WorkspaceView;