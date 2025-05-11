import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Save, Eye } from "lucide-react";
import { BuilderProvider } from "@/contexts/BuilderContext";
import BuilderCanvas from "@/components/builder/BuilderCanvas";
import ElementPalette from "@/components/builder/ElementPalette";
import ElementProperties from "@/components/builder/ElementProperties";

interface WebsiteData {
  id: string;
  name: string;
  content: any;
  settings: any;
  published: boolean;
}

const Builder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [website, setWebsite] = useState<WebsiteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [websiteName, setWebsiteName] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }
      
      fetchWebsite();
    };

    checkAuth();
  }, [id, navigate]);

  const fetchWebsite = async () => {
    try {
      if (!id) return;
      
      setIsLoading(true);
      const { data, error } = await supabase
        .from("websites")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) {
        console.error("Error fetching website:", error);
        navigate("/dashboard");
        return;
      }
      
      setWebsite(data);
      setWebsiteName(data.name);
    } catch (error) {
      console.error("Error in fetchWebsite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveWebsite = async () => {
    try {
      if (!id || !website) return;
      
      setIsSaving(true);
      
      // In a real builder, you'd save the entire website structure
      const { error } = await supabase
        .from("websites")
        .update({ name: websiteName })
        .eq("id", id);
      
      if (error) {
        toast.error("Failed to save website");
        console.error("Error saving website:", error);
        return;
      }
      
      setWebsite({ ...website, name: websiteName });
      toast.success("Website saved successfully");
    } catch (error) {
      console.error("Error in saveWebsite:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const publishWebsite = async () => {
    try {
      if (!id || !website) return;
      
      const { error } = await supabase
        .from("websites")
        .update({ published: true })
        .eq("id", id);
      
      if (error) {
        toast.error("Failed to publish website");
        console.error("Error publishing website:", error);
        return;
      }
      
      setWebsite({ ...website, published: true });
      toast.success("Website published successfully");
    } catch (error) {
      console.error("Error in publishWebsite:", error);
      toast.error("An unexpected error occurred");
    }
  };

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
          <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <BuilderProvider>
      <div className="flex flex-col h-screen">
        {/* Builder navbar */}
        <div className="bg-gray-900 text-white py-2 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <Menu size={20} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Builder Menu</SheetTitle>
                    <SheetDescription>Configure your e-commerce website.</SheetDescription>
                  </SheetHeader>
                  <div className="py-4">
                    <nav className="space-y-1">
                      <a href="#pages" className="block px-2 py-2 rounded hover:bg-gray-100">Pages</a>
                      <a href="#templates" className="block px-2 py-2 rounded hover:bg-gray-100">Templates</a>
                      <a href="#products" className="block px-2 py-2 rounded hover:bg-gray-100">Products</a>
                      <a href="#settings" className="block px-2 py-2 rounded hover:bg-gray-100">Settings</a>
                    </nav>
                  </div>
                  <div className="mt-auto pt-4">
                    <Button 
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => navigate("/dashboard")}
                    >
                      Back to Dashboard
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <Input
                value={websiteName}
                onChange={(e) => setWebsiteName(e.target.value)}
                className="ml-4 max-w-xs bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                onClick={publishWebsite}
                disabled={website.published}
              >
                <Eye className="h-4 w-4 mr-2" />
                {website.published ? "Published" : "Publish"}
              </Button>
              <Button
                size="sm"
                onClick={saveWebsite}
                disabled={isSaving}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>

        {/* Builder content */}
        <div className="flex-1 bg-gray-100 overflow-auto flex">
          {/* Builder sidebar */}
          <div className="w-60 bg-white border-r border-gray-200 p-4 hidden md:block overflow-auto">
            <ElementPalette />
            <ElementProperties />
          </div>

          {/* Canvas */}
          <div className="flex-1 p-4 overflow-auto">
            <BuilderCanvas />
          </div>
        </div>
      </div>
    </BuilderProvider>
  );
};

export default Builder;
