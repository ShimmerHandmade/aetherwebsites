
import React from 'react';
import { useParams } from 'react-router-dom';

const Shop = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-6">Shop Management</h1>
      <p>Configure your shop settings for website ID: {id}</p>
      <div className="mt-8 bg-gray-50 p-6 rounded-lg border">
        <p className="text-gray-500">This is a placeholder for the shop management interface.</p>
      </div>
    </div>
  );
};

export default Shop;
