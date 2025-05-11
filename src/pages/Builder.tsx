
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BuilderProvider } from "@/contexts/BuilderContext";
import BuilderLayout from "@/components/builder/BuilderLayout";
import BuilderNavbar from "@/components/builder/BuilderNavbar";
import BuilderContent from "@/components/builder/BuilderContent";
import { useWebsite } from "@/hooks/useWebsite";

const Builder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { website, isLoading, websiteName, setWebsiteName, saveWebsite, publishWebsite } = useWebsite(id, navigate);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-indigo-600 border-r-indigo-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading builder...</p>
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
          <button onClick={() => navigate("/dashboard")} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <BuilderProvider>
      <BuilderLayout>
        <BuilderNavbar 
          websiteName={websiteName} 
          setWebsiteName={setWebsiteName} 
          onSave={saveWebsite} 
          onPublish={publishWebsite}
          isPublished={website.published}
        />
        <BuilderContent />
      </BuilderLayout>
    </BuilderProvider>
  );
};

export default Builder;
