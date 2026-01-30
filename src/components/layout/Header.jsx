// src/components/layout/Header.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Bell, 
  ChevronDown, 
  Settings, 
  Users, 
  Share2, 
  LogOut,
  Plus,
  FolderOpen
} from 'lucide-react';
import OnlineUsers from '../workspace/OnlineUsers';

const Header = ({ projectName, teamMembers = [] }) => {
  const navigate = useNavigate();
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setIsProjectDropdownOpen(false);
        setIsUserDropdownOpen(false);
      }
    };

    if (isProjectDropdownOpen || isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isProjectDropdownOpen, isUserDropdownOpen]);

  // Mock data - Replace with actual data from your backend/state management
  const projects = [
    { id: 1, name: 'Legal Request Intake App', active: true },
    { id: 2, name: 'HR Portal Redesign', active: false },
    { id: 3, name: 'Customer Analytics Dashboard', active: false },
  ];

  const currentUser = {
    name: 'Siva Kumar',
    email: 'siva.kumar@example.com',
    role: 'Project Lead',
    avatar: null
  };

  const handleProjectChange = (projectId) => {
    // Navigate to the selected project
    const project = projects.find(p => p.id === projectId);
    if (project) {
      navigate(`/project/${projectId}`);
    }
    setIsProjectDropdownOpen(false);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/shared/project/${encodeURIComponent(projectName)}`;
    
    if (navigator.share) {
      // Use native share API if available
      navigator.share({
        title: `SDLC Studio - ${projectName}`,
        text: `Check out this project: ${projectName}`,
        url: shareUrl
      }).catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        setShowShareModal(true);
        setTimeout(() => setShowShareModal(false), 3000);
      });
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left Section - Logo and Project Selector */}
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 hover:opacity-80 transition"
            >
              <Home className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">SDLC Studio</span>
            </button>

            {/* Project Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition border border-gray-200"
              >
                <FolderOpen className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-900">
                  {projectName || 'Select Project'}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isProjectDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Project Dropdown Menu */}
              {isProjectDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Your Projects</p>
                  </div>
                  
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => handleProjectChange(project.id)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-center justify-between ${
                        project.active ? 'bg-blue-50' : ''
                      }`}
                    >
                      <span className={`text-sm ${project.active ? 'font-semibold text-blue-600' : 'text-gray-700'}`}>
                        {project.name}
                      </span>
                      {project.active && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Active</span>
                      )}
                    </button>
                  ))}

                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={() => {
                        navigate('/new-project');
                        setIsProjectDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-center space-x-2 text-blue-600"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm font-medium">Create New Project</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Actions and User */}
          <div className="flex items-center space-x-4">
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-lg transition relative group"
              title="Share Project"
            >
              <Share2 className="w-5 h-5 text-gray-600" />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                Share Project
              </span>
            </button>

            {/* Notifications */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Online Users Component */}
            {teamMembers.length > 0 && (
              <OnlineUsers users={teamMembers} count={teamMembers.filter(m => m.online).length} />
            )}

            {/* Settings */}
            <button 
              onClick={() => navigate('/settings')}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>

            {/* User Dropdown */}
            <div className="relative dropdown-container">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center space-x-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                  <p className="text-xs text-gray-500">{currentUser.role}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              {isUserDropdownOpen && (
                <div 
                  className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsUserDropdownOpen(false);
                      navigate('/profile');
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-center space-x-2"
                  >
                    <Users className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Profile Settings</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsUserDropdownOpen(false);
                      navigate('/team');
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-center space-x-2"
                  >
                    <Users className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Team Management</span>
                  </button>

                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsUserDropdownOpen(false);
                        // Handle logout
                        navigate('/login');
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-red-50 transition flex items-center space-x-2 text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed top-20 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-slide-in">
          <div className="flex items-center space-x-2">
            <Share2 className="w-5 h-5" />
            <span className="font-medium">Link copied to clipboard!</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;