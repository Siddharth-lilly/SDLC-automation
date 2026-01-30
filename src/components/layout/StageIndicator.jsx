// src/components/layout/StageIndicator.jsx
import React from 'react';
import { Check, Circle, Eye } from 'lucide-react';

// Export stages so other components can use it
export const stages = [
  { id: 'discover', name: 'Discover', order: 1 },
  { id: 'define', name: 'Define', order: 2 },
  { id: 'design', name: 'Design', order: 3 },
  { id: 'develop', name: 'Develop', order: 4 },
  { id: 'build', name: 'Build', order: 5 },
  { id: 'testing', name: 'Testing (UAT)', order: 6 },
  { id: 'delivery', name: 'Delivery', order: 7 }
];

// Helper function to get stage order
export const getStageOrder = (stageId) => {
  const stage = stages.find(s => s.id === stageId);
  return stage ? stage.order : 0;
};

// Helper function to check if a stage is accessible (at or before current stage)
export const isStageAccessible = (stageId, currentStageId) => {
  return getStageOrder(stageId) <= getStageOrder(currentStageId);
};

const StageIndicator = ({ 
  currentStage, 
  viewingStage,
  stageData = {}, 
  onStageClick 
}) => {
  const getStageStatus = (stageId) => {
    const data = stageData[stageId];
    if (!data) return 'pending';
    return data.status || 'pending';
  };

  const getStageItemCount = (stageId) => {
    return stageData[stageId]?.itemCount || 0;
  };

  const currentStageOrder = getStageOrder(currentStage);

  const handleStageClick = (stage) => {
    // Only allow clicking on stages at or before the current stage
    if (isStageAccessible(stage.id, currentStage) && onStageClick) {
      onStageClick(stage.id);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {stages.map((stage, index) => {
            const status = getStageStatus(stage.id);
            const isCurrentStage = currentStage === stage.id;
            const isViewingStage = viewingStage === stage.id;
            const isPassed = status === 'passed';
            const itemCount = getStageItemCount(stage.id);
            const isAccessible = isStageAccessible(stage.id, currentStage);
            const stageOrder = getStageOrder(stage.id);
            
            return (
              <React.Fragment key={stage.id}>
                <div className="flex flex-col items-center flex-1">
                  <div 
                    onClick={() => handleStageClick(stage)}
                    className={`
                      w-28 h-28 rounded-lg border-2 flex flex-col items-center justify-center
                      transition-all relative
                      ${isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                      ${isViewingStage ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-300' : ''}
                      ${isCurrentStage && !isViewingStage ? 'border-red-600 bg-red-50' : ''}
                      ${isPassed && !isViewingStage && !isCurrentStage ? 'border-green-500 bg-green-50' : ''}
                      ${!isCurrentStage && !isPassed && !isViewingStage ? 'border-gray-300 bg-white' : ''}
                      ${isAccessible && !isViewingStage ? 'hover:border-blue-400 hover:bg-blue-50/50' : ''}
                    `}
                  >
                    {/* Viewing indicator */}
                    {isViewingStage && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                        <Eye className="w-3 h-3 text-white" />
                      </div>
                    )}
                    
                    <div className="mb-2">
                      {isPassed ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : isCurrentStage ? (
                        <Circle className="w-4 h-4 text-red-600 fill-red-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className={`
                      text-xs font-semibold uppercase tracking-wide text-center
                      ${isViewingStage ? 'text-blue-600' : ''}
                      ${isCurrentStage && !isViewingStage ? 'text-red-600' : ''}
                      ${isPassed && !isViewingStage && !isCurrentStage ? 'text-green-600' : ''}
                      ${!isCurrentStage && !isPassed && !isViewingStage ? 'text-gray-600' : ''}
                    `}>
                      {stage.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {itemCount} items
                    </div>
                  </div>
                </div>
                
                {index < stages.length - 1 && (
                  <div className="flex-shrink-0 w-8 flex items-center justify-center mb-12">
                    <div className={`
                      h-0.5 w-full
                      ${isPassed ? 'bg-green-500' : 'bg-gray-300'}
                    `} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        
        {/* Viewing stage indicator banner */}
        {viewingStage && viewingStage !== currentStage && (
          <div className="mt-4 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              <Eye className="w-4 h-4" />
              <span>
                Viewing: <strong className="uppercase">{viewingStage}</strong> stage
              </span>
              <span className="text-blue-600">•</span>
              <span className="text-blue-600">
                Current: <strong className="uppercase">{currentStage}</strong>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StageIndicator;