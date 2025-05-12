
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useWebsite } from "@/hooks/useWebsite";

const BuilderPages = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    website, 
    isLoading, 
    websiteName
  } = useWebsite(id, navigate);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-blue-600 border-r-blue-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!website) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Website not found</h2>
          <p className="text-gray-600 mb-6">The website you're looking for doesn't exist or you don't have permission to access it.</p>
          <Button onClick={() => navigate("/dashboard")} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate(`/builder/${id}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Builder
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6">Pages - {websiteName}</h1>
          
          <div className="text-gray-600">
            <p>This is where you can manage all the pages of your website.</p>
            <p className="mt-4">Current website: {websiteName}</p>
            
            {/* Placeholder for future page management functionality */}
            <div className="mt-8 p-6 border border-dashed border-gray-300 rounded-lg text-center">
              <p className="text-gray-500">Page management functionality will be implemented here.</p>
              <p className="mt-2 text-sm text-gray-400">You'll be able to create, edit, and organize pages for {websiteName}.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderPages;
