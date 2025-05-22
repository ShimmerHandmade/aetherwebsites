
import React from 'react';
import { useParams } from 'react-router-dom';

const PageManager = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-6">Page Manager</h1>
      <p>Manage pages for website ID: {id}</p>
      <div className="mt-8 bg-gray-50 p-6 rounded-lg border">
        <p className="text-gray-500">This is a placeholder for the page manager interface.</p>
      </div>
    </div>
  );
};

export default PageManager;
