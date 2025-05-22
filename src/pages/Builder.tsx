
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BuilderLayout from '../components/builder/BuilderLayout';
import BuilderContent from '../components/builder/BuilderContent';
import BuilderNavbar from '../components/builder/BuilderNavbar';
import { BuilderProvider } from '../contexts/builder';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

const Builder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [websiteData, setWebsiteData] = useState<any>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showElementPalette, setShowElementPalette] = useState(true);

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
          
        if (error) throw error;
        
        if (!data) {
          toast.error('Website not found');
          navigate('/dashboard');
          return;
        }
        
        setWebsiteData(data);
      } catch (error) {
        console.error('Error fetching website:', error);
        toast.error('Failed to load website data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWebsite();
  }, [id, navigate]);
  
  const handleSave = () => {
    // Implement save functionality
    toast.success('Changes saved');
  };
  
  const handlePublish = () => {
    // Implement publish functionality
    toast.success('Website published');
  };
  
  const toggleElementPalette = () => {
    setShowElementPalette(!showElementPalette);
  };
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <BuilderProvider initialElements={[]} initialPageSettings={{title: 'Untitled'}}>
      <BuilderLayout>
        <BuilderNavbar 
          websiteName={websiteData?.name} 
          setWebsiteName={() => {}} 
          onSave={handleSave}
          onPublish={handlePublish}
          isPreviewMode={isPreviewMode}
          showElementPalette={showElementPalette}
          toggleElementPalette={toggleElementPalette}
        />
        <BuilderContent />
      </BuilderLayout>
    </BuilderProvider>
  );
};

export default Builder;
