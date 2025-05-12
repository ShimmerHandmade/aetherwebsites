
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import DashboardNavbar from "@/components/DashboardNavbar";
import WebsiteCard from "@/components/WebsiteCard";
import PlansSection from "@/components/PlansSection";
import OnboardingFlow from "@/components/OnboardingFlow";
import RefreshSubscriptionButton from "@/components/RefreshSubscriptionButton";

export type Website = {
  id: string;
  name: string;
  template: string | null;
  created_at: string;
  published: boolean;
};

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan_id: string | null;
  is_subscribed: boolean;
  subscription_type: string | null;
  subscription_end: string | null;
};

const Dashboard = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [newWebsiteId, setNewWebsiteId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }
      
      fetchUserData();
      fetchWebsites();
    };

    checkAuth();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }
      
      setProfile(data);
    } catch (error) {
      console.error("Error in fetchUserData:", error);
    }
  };

  const fetchWebsites = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      const { data, error } = await supabase
        .from("websites")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) {
        toast.error("Failed to fetch websites");
        console.error("Error fetching websites:", error);
        return;
      }
      
      setWebsites(data || []);
    } catch (error) {
      console.error("Error in fetchWebsites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewWebsite = async () => {
    try {
      const name = `My Store ${websites.length + 1}`;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase
        .from("websites")
        .insert([
          { name, owner_id: user.id }
        ])
        .select()
        .single();
      
      if (error) {
        toast.error("Failed to create new website");
        console.error("Error creating website:", error);
        return;
      }
      
      toast.success("New website created");
      setNewWebsiteId(data.id);
    } catch (error) {
      console.error("Error in createNewWebsite:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const completeOnboarding = () => {
    setNewWebsiteId(null);
    fetchWebsites();
  };

  // Check if user has a subscription or not
  const hasSubscription = profile?.is_subscribed;

  // If onboarding is in progress, show onboarding flow
  if (newWebsiteId) {
    return (
      <OnboardingFlow 
        websiteId={newWebsiteId} 
        onComplete={completeOnboarding} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar profile={profile} />
      
      <main className="container mx-auto px-4 py-8">
        {!hasSubscription ? (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold mb-2">Choose a Plan to Get Started</h2>
                <p className="mb-0">Select a subscription plan to start creating your e-commerce websites.</p>
              </div>
              <RefreshSubscriptionButton 
                onRefresh={fetchUserData}
                variant="outline" 
                className="bg-white text-indigo-600 hover:bg-gray-100 border-none"
              />
            </div>
            
            <PlansSection profile={profile} onPlanSelected={fetchUserData} />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">My Websites</h1>
              <div className="flex space-x-4">
                <RefreshSubscriptionButton onRefresh={fetchUserData} />
                <Button 
                  onClick={createNewWebsite}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600"
                >
                  <Plus className="mr-2 h-4 w-4" /> New Website
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i}
                    className="bg-white p-6 rounded-lg shadow-md border border-gray-100 h-48 animate-pulse"
                  />
                ))}
              </div>
            ) : websites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {websites.map((website) => (
                  <WebsiteCard 
                    key={website.id}
                    website={website}
                    onWebsiteUpdate={fetchWebsites}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-medium text-gray-700 mb-2">No websites yet</h3>
                <p className="text-gray-500 mb-6">Create your first website to get started</p>
                <Button 
                  onClick={createNewWebsite}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600"
                >
                  <Plus className="mr-2 h-4 w-4" /> Create Website
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
