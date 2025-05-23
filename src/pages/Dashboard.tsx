
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import DashboardNavbar from '../components/DashboardNavbar';
import WebsiteCard from '../components/WebsiteCard';
import TemplateSelection from '../components/TemplateSelection';
import { toast } from 'sonner';
import { usePlanInfo } from '../hooks/usePlanInfo';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Profile, Website } from '@/types/general';

// Fix the infinite type instantiation issue by simplifying types
interface DashboardState {
  websites: Website[];
  loading: boolean;
  isCreating: boolean;
  userProfile: Profile | null;
  showTemplateSelection: boolean;
}

const Dashboard = () => {
  const [state, setState] = useState<DashboardState>({
    websites: [],
    loading: true,
    isCreating: false,
    userProfile: null,
    showTemplateSelection: false
  });
  
  const navigate = useNavigate();
  const planInfo = usePlanInfo();
  
  const { websites, loading, userProfile, showTemplateSelection } = state;
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          navigate('/login');
          return;
        }
        
        // Get user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
        
        setState(prev => ({ ...prev, userProfile: profileData || null }));
        
        // Fetch the websites
        await fetchWebsites();
      } catch (error) {
        console.error('Error in checkAuth:', error);
        toast.error('Failed to check authentication');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const setWebsites = (websites: Website[]) => {
    setState(prev => ({ ...prev, websites }));
  };
  
  const toggleTemplateSelection = () => {
    setState(prev => ({ ...prev, showTemplateSelection: !prev.showTemplateSelection }));
  };
  
  // Helper function for re-fetching websites
  const fetchWebsites = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }
      
      const { data, error } = await supabase
        .from('websites')
        .select('*')
        .eq('owner_id', user.id);
      
      if (error) {
        toast.error('Failed to load websites');
        console.error('Error fetching websites:', error);
        return;
      }
      
      setState(prev => ({
        ...prev,
        websites: data || [],
        loading: false
      }));
    } catch (error) {
      console.error('Error in fetchWebsites:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar profile={userProfile} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Your Websites</h1>
          <Button onClick={toggleTemplateSelection}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Create New
          </Button>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            Loading websites...
          </div>
        ) : websites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">You don't have any websites yet.</p>
            <Button onClick={toggleTemplateSelection}>Create your first website</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {websites.map(website => (
              <WebsiteCard 
                key={website.id} 
                website={website} 
                onWebsiteUpdate={fetchWebsites}
                onWebsiteDeleted={fetchWebsites}
              />
            ))}
          </div>
        )}
      </div>
      
      {showTemplateSelection && (
        <TemplateSelection 
          isOpen={showTemplateSelection}
          onClose={toggleTemplateSelection}
          setWebsites={setWebsites}
        />
      )}
    </div>
  );
};

export default Dashboard;
