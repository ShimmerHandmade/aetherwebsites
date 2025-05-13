
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DashboardNavbar from "@/components/DashboardNavbar";
import { Profile as ProfileType } from "@/pages/Dashboard";
import SubscriptionManager from "@/components/SubscriptionManager";
import PlanLimitsInfo from "@/components/PlanLimitsInfo";
import PlanStatusBadge from "@/components/PlanStatusBadge";
import { getUserPlan } from "@/api/websites/getUserPlan";

const profileSchema = z.object({
  full_name: z.string().min(2, { message: "Name must be at least 2 characters" }).optional(),
  email: z.string().email({ message: "Please enter a valid email address" }).optional(),
});

const Profile = () => {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [productCount, setProductCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [planInfo, setPlanInfo] = useState<any>(null);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      email: "",
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please log in to view your profile");
        navigate("/auth");
        return;
      }
      
      fetchUserData();
      fetchStatsData();
      fetchPlanData();
    };

    checkAuth();
  }, [navigate]);

  const fetchPlanData = async () => {
    try {
      const { data, error } = await getUserPlan();
      if (error) {
        console.error("Error fetching plan data:", error);
        return;
      }
      setPlanInfo(data);
    } catch (err) {
      console.error("Error in fetchPlanData:", err);
    }
  };

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*, plans:plan_id(*)")
        .eq("id", user.id)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile information");
        return;
      }
      
      setProfile(data);
      form.reset({
        full_name: data.full_name || "",
        email: data.email || "",
      });
    } catch (error) {
      console.error("Error in fetchUserData:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatsData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      // Count products
      const { count: productsCount, error: productsError } = await supabase
        .from("products")
        .select("id", { count: 'exact', head: true })
        .eq("user_id", user.id);
      
      if (productsError) {
        console.error("Error counting products:", productsError);
      } else {
        setProductCount(productsCount || 0);
      }
      
      // Count pages (simplified, in a real app you would count pages from websites)
      const { data: websites, error: websitesError } = await supabase
        .from("websites")
        .select("id")
        .eq("owner_id", user.id);
      
      if (websitesError) {
        console.error("Error fetching websites:", websitesError);
      } else {
        // This is a simplified example, in a real app you would count actual pages
        setPageCount(websites?.length || 0);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: values.full_name,
        })
        .eq("id", user.id);
      
      if (error) {
        toast.error("Failed to update profile");
        console.error("Error updating profile:", error);
        return;
      }
      
      toast.success("Profile updated successfully");
      fetchUserData();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubscriptionUpdated = () => {
    fetchUserData();
    fetchPlanData();
    toast.success("Subscription information updated");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar profile={profile} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Account Management</h1>
            {planInfo && (
              <PlanStatusBadge className="text-sm px-3 py-1.5" />
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Profile Settings</h2>
              
              {isLoading ? (
                <div className="py-8 text-center">
                  <div className="h-12 w-12 border-4 border-t-indigo-600 border-r-indigo-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading profile...</p>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="example@email.com" 
                              disabled 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-indigo-600 to-purple-600"
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </Form>
              )}
            </div>
            
            {/* Subscription Management */}
            <SubscriptionManager 
              profile={profile} 
              productCount={productCount}
              pageCount={pageCount}
              onSubscriptionUpdated={handleSubscriptionUpdated}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
