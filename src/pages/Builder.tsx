
import { useParams, useNavigate } from "react-router-dom";
import { BuilderProvider } from "@/contexts/BuilderContext";
import BuilderLayout from "@/components/builder/BuilderLayout";
import BuilderNavbar from "@/components/builder/BuilderNavbar";
import BuilderContent from "@/components/builder/BuilderContent";
import { useWebsite } from "@/hooks/useWebsite";
import { BuilderElement, PageSettings } from "@/contexts/BuilderContext";
import { useState } from "react";

const Builder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    website, 
    isLoading, 
    websiteName, 
    elements,
    pageSettings,
    setWebsiteName, 
    saveWebsite, 
    publishWebsite,
    updateElements
  } = useWebsite(id, navigate);
  
  // Track preview mode state at this level
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleSave = async (updatedElements: BuilderElement[], updatedPageSettings: PageSettings) => {
    await saveWebsite(updatedElements, updatedPageSettings);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-blue-600 border-r-blue-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
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
          <button onClick={() => navigate("/dashboard")} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <BuilderProvider 
      initialElements={elements} 
      initialPageSettings={pageSettings || { title: websiteName }}
      onSave={handleSave}
    >
      <BuilderLayout isPreviewMode={isPreviewMode} setIsPreviewMode={setIsPreviewMode}>
        <BuilderNavbar 
          websiteName={websiteName} 
          setWebsiteName={setWebsiteName} 
          onSave={async () => {
            document.dispatchEvent(new CustomEvent('save-website'));
          }} 
          onPublish={publishWebsite}
          isPublished={website.published}
          isPreviewMode={isPreviewMode}
          setIsPreviewMode={setIsPreviewMode}
        />
        <BuilderContent isPreviewMode={isPreviewMode} />
      </BuilderLayout>
    </BuilderProvider>
  );
};

export default Builder;
