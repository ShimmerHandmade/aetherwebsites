
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useWebsite } from "@/hooks/useWebsite";
import ProductManager from "@/components/builder/ProductManager";

const BuilderProducts = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    website, 
    isLoading, 
    websiteName 
  } = useWebsite(id as string, navigate);

  const handleBackToBuilder = () => {
    navigate(`/builder/${id}`);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-primary border-primary/30 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!website || !id) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h2 className="text-2xl font-bold text-gray-700 mb-3">Website not found</h2>
          <p className="text-gray-600 mb-8">The website you're looking for doesn't exist or you don't have permission to access it.</p>
          <Button onClick={() => navigate("/dashboard")} className="px-6 py-2">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBackToBuilder}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Builder
          </Button>
          <h1 className="text-3xl font-bold mt-4">{websiteName} - Product Management</h1>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden h-[calc(100vh-200px)]">
          <ProductManager 
            websiteId={id} 
            onBackToBuilder={handleBackToBuilder} 
          />
        </div>
      </div>
    </div>
  );
};

export default BuilderProducts;
