
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useWebsite } from "@/hooks/useWebsite";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomDomainManager from "@/components/CustomDomainManager";
import { toast } from "sonner";

const BuilderSiteSettings = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    website, 
    isLoading,
    saveWebsite
  } = useWebsite(id, navigate);

  const handleBackToBuilder = () => {
    navigate(`/builder/${id}`);
  };

  const handleDomainUpdate = async (domain: string) => {
    if (!website) return;

    try {
      const updatedSettings = {
        ...website.settings,
        customDomain: domain
      };

      await saveWebsite(undefined, undefined, updatedSettings);
      toast.success("Domain settings updated successfully!");
    } catch (error) {
      console.error("Error updating domain:", error);
      toast.error("Failed to update domain settings");
    }
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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBackToBuilder}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Builder
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6">Site Settings</h1>
          
          <Tabs defaultValue="domain" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="domain">Domain & Hosting</TabsTrigger>
              <TabsTrigger value="general">General Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="domain" className="space-y-6">
              <CustomDomainManager
                websiteId={website.id}
                websiteName={website.name}
                currentDomain={website.settings?.customDomain}
                onDomainUpdate={handleDomainUpdate}
              />
            </TabsContent>
            
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Website Information</CardTitle>
                  <CardDescription>Basic settings for your website</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Website Name</p>
                    <p className="text-gray-600">{website.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Website ID</p>
                    <p className="text-gray-600 font-mono text-sm">{website.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Status</p>
                    <p className="text-gray-600">{website.published ? "Published" : "Draft"}</p>
                  </div>
                  <Button
                    onClick={handleBackToBuilder}
                    className="mt-4"
                  >
                    Edit Website
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BuilderSiteSettings;
