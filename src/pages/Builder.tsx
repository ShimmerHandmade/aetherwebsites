
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BuilderLayout from '../components/builder/BuilderLayout';
import BuilderContent from '../components/builder/BuilderContent';
import BuilderNavbar from '../components/builder/BuilderNavbar';
import { BuilderProvider } from '../contexts/builder';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { v4 as uuidv4 } from '@/lib/uuid';

const Builder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [websiteData, setWebsiteData] = useState<any>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchWebsite = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('websites')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) {
          console.error('Error fetching website:', error);
          setErrorMessage(`Failed to load website: ${error.message}`);
          return;
        }
        
        if (!data) {
          setErrorMessage('Website not found');
          navigate('/dashboard');
          return;
        }
        
        console.log('Successfully loaded website data:', data);
        
        // Initialize a default structure if needed
        if (!data.content || 
            (Array.isArray(data.content) && data.content.length === 0) || 
            (typeof data.content === 'object' && Object.keys(data.content).length === 0)) {
          
          // Create a basic content structure with a navbar and welcome section
          const defaultContent = [
            {
              id: uuidv4(),
              type: "navbar",
              content: "",
              props: {
                siteName: data.name || "My E-Commerce Site",
                links: [
                  { text: "Home", url: "#" },
                  { text: "Shop", url: "#" },
                  { text: "About", url: "#" },
                  { text: "Contact", url: "#" }
                ],
                variant: "default"
              }
            },
            {
              id: uuidv4(),
              type: "section",
              content: "",
              props: {
                padding: "large",
                backgroundColor: "bg-white",
                className: "py-12"
              },
              children: [
                {
                  id: uuidv4(),
                  type: "heading",
                  content: "Welcome to Your Store",
                  props: {
                    level: "h1",
                    className: "text-4xl font-bold text-center"
                  }
                },
                {
                  id: uuidv4(),
                  type: "text",
                  content: "Start building your e-commerce website by customizing this template. Drag and drop elements to create your perfect online store.",
                  props: {
                    className: "text-center text-lg mt-4 max-w-3xl mx-auto"
                  }
                }
              ]
            }
          ];
          
          // Update the data with default content
          data.content = defaultContent;
          
          // Save this default content to the database
          const { error: updateError } = await supabase
            .from('websites')
            .update({ content: defaultContent })
            .eq('id', id);
            
          if (updateError) {
            console.error('Error saving default content:', updateError);
          }
        }
        
        setWebsiteData(data);
      } catch (error: any) {
        console.error('Error in fetchWebsite:', error);
        setErrorMessage(`An unexpected error occurred: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWebsite();
  }, [id, navigate]);
  
  const handleSave = () => {
    // Get the latest elements from the builder context
    document.dispatchEvent(new CustomEvent('save-website'));
    toast.success('Changes saved');
  };
  
  const handlePublish = () => {
    // Implement publish functionality
    toast.success('Website published');
  };
  
  const handleReturnToDashboard = () => {
    navigate('/dashboard');
  };
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-t-primary border-primary/30 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your website builder...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-8">{errorMessage}</p>
          <Button onClick={() => navigate("/dashboard")} className="px-4 py-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!websiteData) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Website not found</h2>
          <p className="text-gray-600 mb-8">The website you're trying to access doesn't exist or you don't have permission to view it.</p>
          <Button onClick={() => navigate("/dashboard")} className="px-4 py-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Extract content from the websiteData
  const initialElements = Array.isArray(websiteData.content) ? websiteData.content : [];
  const initialPageSettings = websiteData.settings?.pageSettings || { title: websiteData.name || "Untitled" };

  // Default empty pages list if not set
  const pages = websiteData.settings?.pages || [];

  return (
    <BuilderProvider 
      initialElements={initialElements} 
      initialPageSettings={initialPageSettings} 
      onSave={() => {}}
    >
      <BuilderLayout 
        isPreviewMode={isPreviewMode} 
        setIsPreviewMode={setIsPreviewMode}
      >
        <BuilderNavbar 
          websiteName={websiteData.name} 
          setWebsiteName={() => {}} 
          onSave={handleSave}
          onPublish={handlePublish}
          isPreviewMode={isPreviewMode}
          setIsPreviewMode={setIsPreviewMode}
          pages={pages}
          onChangePage={() => {}}
          onShopLinkClick={() => navigate(`/builder/${id}/shop`)}
          onReturnToDashboard={handleReturnToDashboard}
        />
        <BuilderContent isPreviewMode={isPreviewMode} />
      </BuilderLayout>
    </BuilderProvider>
  );
};

export default Builder;
