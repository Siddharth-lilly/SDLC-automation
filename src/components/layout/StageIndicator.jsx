// src/components/layout/StageIndicator.jsx
import React from 'react';
import { Check, Circle } from 'lucide-react';

const stages = [
  { id: 'discover', name: 'Discover', order: 1, navigable: true },
  { id: 'define', name: 'Define', order: 2, navigable: true },
  { id: 'design', name: 'Design', order: 3, navigable: true },
  { id: 'develop', name: 'Develop', order: 4, navigable: true },
  { id: 'build', name: 'Build', order: 5, navigable: false },
  { id: 'testing', name: 'Testing (UAT)', order: 6, navigable: false },
  { id: 'delivery', name: 'Delivery', order: 7, navigable: false }
];

const StageIndicator = ({ currentStage, stageData = {} }) => {
  const getStageStatus = (stageId) => {
    const data = stageData[stageId];
    if (!data) return 'pending';
    return data.status || 'pending';
  };

  const getStageItemCount = (stageId) => {
    return stageData[stageId]?.itemCount || 0;
  };

  return (
    <div className="bg-white border-b border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {stages.map((stage, index) => {
            const status = getStageStatus(stage.id);
            const isActive = currentStage === stage.id;
            const isPassed = status === 'passed';
            const itemCount = getStageItemCount(stage.id);
            const isNavigable = stage.navigable;
            
            return (
              <React.Fragment key={stage.id}>
                <div className="flex flex-col items-center flex-1">
                  <div className={`
                    w-28 h-28 rounded-lg border-2 flex flex-col items-center justify-center
                    transition-all
                    ${isNavigable ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'}
                    ${isActive ? 'border-red-600 bg-red-50' : ''}
                    ${isPassed ? 'border-green-500 bg-green-50' : ''}
                    ${!isActive && !isPassed ? 'border-gray-300 bg-white' : ''}
                    ${isNavigable && !isActive ? 'hover:border-gray-400' : ''}
                  `}>
                    <div className="mb-2">
                      {isPassed ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : isActive ? (
                        <Circle className="w-4 h-4 text-red-600 fill-red-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className={`
                      text-xs font-semibold uppercase tracking-wide text-center
                      ${isActive ? 'text-red-600' : ''}
                      ${isPassed ? 'text-green-600' : ''}
                      ${!isActive && !isPassed ? 'text-gray-600' : ''}
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
      </div>
    </div>
  );
};

export default StageIndicator;
