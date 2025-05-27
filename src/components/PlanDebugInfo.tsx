
import React from 'react';
import { usePlan } from '@/contexts/PlanContext';

const PlanDebugInfo: React.FC = () => {
  const { planName, loading, error, isPremium, isEnterprise, restrictions } = usePlan();
  
  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white text-xs p-2 rounded max-w-xs z-50">
      <div className="font-bold mb-1">Plan Debug Info:</div>
      <div>Loading: {loading ? 'Yes' : 'No'}</div>
      <div>Error: {error || 'None'}</div>
      <div>Plan: {planName || 'Free'}</div>
      <div>Premium: {isPremium ? 'Yes' : 'No'}</div>
      <div>Enterprise: {isEnterprise ? 'Yes' : 'No'}</div>
      <div>Restrictions: {restrictions ? 'Loaded' : 'None'}</div>
    </div>
  );
};

export default PlanDebugInfo;
