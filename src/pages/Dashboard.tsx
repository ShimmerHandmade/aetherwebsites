
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import DashboardNavbar from '../components/DashboardNavbar';
import WebsiteCard from '../components/WebsiteCard';
import TemplateSelection from '../components/TemplateSelection';
import { toast } from 'sonner';
import usePlanInfo from '../hooks/usePlanInfo';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

const Dashboard = () => {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const { userPlan, isLoading: planLoading } = usePlanInfo();
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  
  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/login');
          return;
        }
        
        const { data, error } = await supabase
          .from('websites')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setWebsites(data || []);
      } catch (error) {
        console.error('Error fetching websites:', error);
        toast.error('Failed to load websites');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWebsites();
  }, [navigate]);

  const handleCreateWebsite = () => {
    const hasReachedLimit = userPlan && websites.length >= userPlan.website_limit;
    
    if (hasReachedLimit) {
      toast.error(`You've reached the maximum number of websites for your plan (${userPlan.website_limit})`);
      return;
    }
    
    setShowTemplateSelection(true);
  };

  const handleDeleteWebsite = async (websiteId) => {
    try {
      const { error } = await supabase
        .from('websites')
        .delete()
        .eq('id', websiteId);
        
      if (error) throw error;
      
      setWebsites(websites.filter(site => site.id !== websiteId));
      toast.success('Website deleted successfully');
    } catch (error) {
      console.error('Error deleting website:', error);
      toast.error('Failed to delete website');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Websites</h1>
          <Button 
            onClick={handleCreateWebsite}
            disabled={isCreating || planLoading}
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Website
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center my-12">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {websites.map(website => (
              <WebsiteCard 
                key={website.id}
                website={website}
                onDelete={() => handleDeleteWebsite(website.id)}
              />
            ))}
            
            {websites.length === 0 && (
              <div className="col-span-full text-center py-12 bg-white rounded-lg border">
                <p className="text-gray-500">You don't have any websites yet. Create one to get started!</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {showTemplateSelection && (
        <TemplateSelection 
          open={showTemplateSelection}
          onClose={() => setShowTemplateSelection(false)}
          setWebsites={setWebsites}
        />
      )}
    </div>
  );
};

export default Dashboard;
