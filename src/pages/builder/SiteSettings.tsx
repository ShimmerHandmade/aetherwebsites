
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWebsite } from "@/hooks/useWebsite";

const BuilderSiteSettings = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    website, 
    isLoading, 
    websiteName, 
    setWebsiteName, 
    saveWebsite 
  } = useWebsite(id, navigate);

  const handleSave = async () => {
    // This will just save the current state
    await saveWebsite(website?.content || [], website?.pageSettings || {});
  };

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
          <h1 className="text-2xl font-bold mb-6">Site Settings</h1>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="site-name">Website Name</Label>
              <Input 
                id="site-name" 
                value={websiteName} 
                onChange={(e) => setWebsiteName(e.target.value)}
                className="max-w-md"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="site-domain">Domain</Label>
              <div className="max-w-md flex items-center space-x-2">
                <span className="text-gray-500">https://</span>
                <Input 
                  id="site-domain" 
                  placeholder="yoursite.com" 
                  disabled
                  className="flex-1"
                />
                <Button variant="outline" size="sm" disabled>Configure</Button>
              </div>
              <p className="text-sm text-gray-500">Domain configuration coming soon</p>
            </div>
            
            <div className="pt-4">
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Save Settings</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderSiteSettings;
