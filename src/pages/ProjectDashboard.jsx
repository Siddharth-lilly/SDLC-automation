// src/pages/ProjectDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import StageIndicator from '../components/layout/StageIndicator';
import { Settings, ArrowRight, TrendingUp, AlertCircle } from 'lucide-react';

const ProjectDashboard = () => {
  const navigate = useNavigate();

  const stageData = {
    discover: { status: 'passed', itemCount: 12 },
    define: { status: 'passed', itemCount: 8 },
    design: { status: 'active', itemCount: 3 },
    build: { status: 'pending', itemCount: 0 },
    deliver: { status: 'pending', itemCount: 0 }
  };

  const recentActivity = [
    { user: 'Priya', action: 'committed arch diagram v2', time: '2h ago' },
    { user: 'Siva', action: 'approved BRD gate', time: 'yesterday' },
    { user: 'AI', action: 'suggested 3 NFRs', time: 'yesterday' }
  ];

  const teamMembers = [
    { id: 1, name: 'Siva', initials: 'S', color: 'bg-red-600' },
    { id: 2, name: 'Raj', initials: 'R', color: 'bg-blue-600' },
    { id: 3, name: 'Priya', initials: 'P', color: 'bg-purple-600' },
    { id: 4, name: 'Amit', initials: 'A', color: 'bg-green-600' },
    { id: 5, name: 'Maya', initials: 'M', color: 'bg-orange-600' }
  ];

  const handleEnterWorkspace = () => {
    console.log('Navigating to workspace...'); // Debug log
    navigate('/workspace/legal-request-intake');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header projectName="Legal Request Intake App" />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Legal Request Intake App
            </h1>
            <p className="text-gray-600">Track progress across all development stages</p>
          </div>
          <button className="btn-ghost flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>

        <StageIndicator currentStage="design" stageData={stageData} />

        <div className="grid grid-cols-3 gap-6 mt-8">
          <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <span>📊</span>
              <span>Project Dashboard</span>
            </h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Team ({teamMembers.length})</h3>
                <div className="grid grid-cols-3 gap-3">
                  {teamMembers.map(member => (
                    <div key={member.id} className="text-center">
                      <div className={`
                        w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold mx-auto mb-2
                        ${member.color}
                      `}>
                        {member.initials}
                      </div>
                      <span className="text-xs text-gray-600">{member.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium text-gray-900">{activity.user}</span>
                      <span className="text-gray-600"> {activity.action}</span>
                      <span className="text-gray-400 text-xs block">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleEnterWorkspace}
              className="mt-6 w-full btn-primary flex items-center justify-center space-x-2"
            >
              <span>Enter Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Stage: DESIGN</h3>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold text-gray-900">60%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm mb-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <span className="text-gray-900 font-medium">Blockers: 1</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600">Next Gate: Design Review</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;