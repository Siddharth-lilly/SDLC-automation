// src/components/workspace/StageGateTab.jsx
import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Clock, 
  AlertCircle, 
  Lock, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  User,
  CheckCircle2
} from 'lucide-react';

// Status Badge Component
const StatusBadge = ({ status }) => {
  const configs = {
    pending: { icon: Clock, bg: 'bg-gray-100', text: 'text-gray-600', label: 'Pending' },
    ready: { icon: AlertCircle, bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Ready for Review' },
    passed: { icon: Check, bg: 'bg-green-100', text: 'text-green-700', label: 'Passed' },
    failed: { icon: X, bg: 'bg-red-100', text: 'text-red-700', label: 'Failed' },
    blocked: { icon: Lock, bg: 'bg-orange-100', text: 'text-orange-700', label: 'Blocked' },
  };
  const config = configs[status] || configs.pending;
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      <Icon className="w-4 h-4" />
      {config.label}
    </span>
  );
};

// Approval Status Component
const ApprovalStatus = ({ status }) => {
  if (status === 'approved') {
    return (
      <span className="flex items-center gap-1 text-green-600 font-medium">
        <Check className="w-4 h-4" /> Approved
      </span>
    );
  }
  if (status === 'rejected') {
    return (
      <span className="flex items-center gap-1 text-red-600 font-medium">
        <X className="w-4 h-4" /> Rejected
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-gray-400">
      <Clock className="w-4 h-4" /> Pending
    </span>
  );
};

const StageGateTab = ({ gateData, onApprove, onReject }) => {
  const [showAllApprovers, setShowAllApprovers] = useState(false);
  const [approvalComment, setApprovalComment] = useState('');

  if (!gateData) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center py-12">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500">No gate data available for this stage</p>
      </div>
    );
  }

  const completedChecks = gateData.checklist?.filter(c => c.completed).length || 0;
  const totalChecks = gateData.checklist?.length || 0;
  const approvedCount = gateData.approvals?.filter(a => a.status === 'approved').length || 0;
  const displayedApprovals = showAllApprovers 
    ? gateData.approvals 
    : gateData.approvals?.slice(0, 3) || [];
  
  const isGatePassed = gateData.status === 'passed';
  const hasComment = approvalComment.trim().length > 0;
  
  const handleApprove = () => {
    if (onApprove && hasComment) {
      onApprove(approvalComment);
      setApprovalComment('');
    }
  };

  const handleReject = () => {
    if (onReject && hasComment) {
      onReject(approvalComment);
      setApprovalComment('');
    }
  };

  // Calculate progress percentages (capped at 100%)
  const checklistProgress = totalChecks > 0 ? Math.min((completedChecks / totalChecks) * 100, 100) : 0;
  const approvalProgress = gateData.requiredApprovals > 0 ? Math.min((approvedCount / gateData.requiredApprovals) * 100, 100) : 0;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isGatePassed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {isGatePassed ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Stage Gate: {gateData.gateName}
              </h2>
              <p className="text-sm text-gray-500">
                {gateData.currentStage?.toUpperCase()} → {gateData.nextStage?.toUpperCase()}
              </p>
            </div>
          </div>
          <StatusBadge status={gateData.status} />
        </div>
        
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <span>
            Gate Type: <strong className="text-gray-900 capitalize">{gateData.gateType}</strong>
          </span>
          <span>
            Required Approvals: <strong className="text-gray-900">{gateData.requiredApprovals} of {gateData.totalApprovers}</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Checklist Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              Checklist
            </h3>
            <span className={`text-sm ${completedChecks === totalChecks && totalChecks > 0 ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
              {completedChecks}/{totalChecks} complete
              {completedChecks === totalChecks && totalChecks > 0 && ' ✓'}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${checklistProgress}%` }}
            />
          </div>
          
          {/* Checklist Items */}
          {gateData.checklist && gateData.checklist.length > 0 ? (
            <ul className="space-y-3">
              {gateData.checklist.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <div className={`
                    mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                    ${item.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'}
                  `}>
                    {item.completed && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1">
                    <span className={item.completed ? 'text-gray-900' : 'text-gray-600'}>
                      {item.label}
                    </span>
                    {item.completed && item.completedBy && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.completedBy} • {item.completedAt}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No checklist items</p>
          )}
        </div>

        {/* Approvals Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Approvals
            </h3>
            <span className={`text-sm ${approvedCount >= gateData.requiredApprovals ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
              {approvedCount}/{gateData.requiredApprovals} required
              {approvedCount >= gateData.requiredApprovals && ' ✓'}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${approvalProgress}%` }}
            />
          </div>
          
          {/* Approval List */}
          {gateData.approvals && gateData.approvals.length > 0 ? (
            <>
              <ul className="space-y-4">
                {displayedApprovals.map((approval) => (
                  <li key={approval.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold flex-shrink-0">
                      {approval.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-900">{approval.user}</span>
                          <span className="text-gray-500 text-sm ml-2">({approval.role})</span>
                        </div>
                        <ApprovalStatus status={approval.status} />
                      </div>
                      {approval.comment && (
                        <p className="text-sm text-gray-600 mt-1 flex items-start gap-1">
                          <MessageSquare className="w-3 h-3 mt-1 flex-shrink-0" />
                          "{approval.comment}"
                        </p>
                      )}
                      {approval.timestamp && (
                        <p className="text-xs text-gray-400 mt-1">{approval.timestamp}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              
              {gateData.approvals.length > 3 && (
                <button
                  onClick={() => setShowAllApprovers(!showAllApprovers)}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  {showAllApprovers ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                  {showAllApprovers ? 'Show less' : `Show ${gateData.approvals.length - 3} more`}
                </button>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-500 italic">No approvals required</p>
          )}
        </div>
      </div>

      {/* Auto Checks */}
      {gateData.autoChecks && gateData.autoChecks.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Automated Checks</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {gateData.autoChecks.map((check) => (
              <div 
                key={check.id} 
                className={`p-4 rounded-lg border ${
                  check.passed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {check.passed ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <X className="w-5 h-5 text-red-600" />
                  )}
                  <span className={check.passed ? 'text-green-800' : 'text-red-800'}>
                    {check.label}
                  </span>
                </div>
                {check.score && (
                  <p className="text-sm text-gray-500 mt-1 ml-7">Score: {check.score}%</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons - Only show if gate is NOT passed */}
      {!isGatePassed && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Your Decision</h3>
          
          <div className="flex items-center gap-4">
            {/* Comment Input */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Add a comment with your decision (required)..."
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              {!hasComment && (
                <p className="text-xs text-gray-400 mt-1">
                  Enter a comment to enable Approve/Reject buttons
                </p>
              )}
            </div>
            
            {/* Buttons - Only enabled when comment exists */}
            <div className="flex gap-3">
              <button 
                onClick={handleReject}
                disabled={!hasComment}
                className={`
                  px-4 py-2 border rounded-lg flex items-center gap-2 transition-all
                  ${hasComment 
                    ? 'border-red-300 text-red-700 hover:bg-red-50 cursor-pointer' 
                    : 'border-gray-200 text-gray-300 cursor-not-allowed'
                  }
                `}
              >
                <X className="w-4 h-4" /> Reject
              </button>
              <button 
                onClick={handleApprove}
                disabled={!hasComment}
                className={`
                  px-4 py-2 rounded-lg flex items-center gap-2 transition-all
                  ${hasComment 
                    ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                <Check className="w-4 h-4" /> Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gate Passed Message */}
      {isGatePassed && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6 text-center">
          <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-green-800">Gate Passed!</h3>
          <p className="text-sm text-green-600 mt-1">
            This stage has been approved and completed.
          </p>
        </div>
      )}
    </div>
  );
};

export default StageGateTab;