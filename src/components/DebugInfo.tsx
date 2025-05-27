
import React from 'react';
import { usePlan } from '@/contexts/PlanContext';
import { useBuilder } from '@/contexts/builder/useBuilder';

const DebugInfo: React.FC = () => {
  const { planName, loading, error, isPremium, isEnterprise, restrictions } = usePlan();
  const builderContext = useBuilder();
  
  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 left-4 bg-black text-white text-xs p-3 rounded max-w-sm z-50 max-h-96 overflow-y-auto">
      <div className="font-bold mb-2">🐛 Debug Info</div>
      
      <div className="mb-2">
        <div className="text-yellow-300 font-semibold">Plan Status:</div>
        <div>Loading: {loading ? 'Yes' : 'No'}</div>
        <div>Error: {error || 'None'}</div>
        <div>Plan: {planName || 'Free'}</div>
        <div>Premium: {isPremium ? 'Yes' : 'No'}</div>
        <div>Enterprise: {isEnterprise ? 'Yes' : 'No'}</div>
        <div>Restrictions: {restrictions ? 'Loaded' : 'None'}</div>
      </div>
      
      <div className="mb-2">
        <div className="text-green-300 font-semibold">Builder Status:</div>
        <div>Elements: {builderContext?.elements?.length || 0}</div>
        <div>Selected: {builderContext?.selectedElementId || 'None'}</div>
        <div>Context: {builderContext ? 'Loaded' : 'Missing'}</div>
      </div>
      
      <div className="text-xs text-gray-400 mt-2">
        Refresh page to reload debug info
      </div>
    </div>
  );
};

export default DebugInfo;
