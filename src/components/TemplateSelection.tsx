import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateWebsiteTemplate } from "@/api/websites";
import { Badge } from "@/components/ui/badge";
import { usePlan } from "@/contexts/PlanContext";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { checkThemeAccess } from "@/utils/planRestrictions";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AITemplateGenerator from "./AITemplateGenerator";
import { Sparkles, Wand2, Crown } from "lucide-react";
import { getTemplates, saveTemplateWebsite, Template } from "@/api/templates";

// Template definitions with improved store types and fallback images
const templates = [
  {
    id: "fashion",
    name: "Fashion Store",
    description: "Stylish template for clothing and accessories",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1470&auto=format&fit=crop",
    fallbackImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1470&auto=format&fit=crop",
    isPremium: false,
  },
  {
    id: "electronics",
    name: "Electronics Shop",
    description: "Modern template for tech and gadgets",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1470&auto=format&fit=crop", 
    fallbackImage: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1470&auto=format&fit=crop",
    isPremium: false,
  },
  {
    id: "beauty",
    name: "Beauty & Cosmetics",
    description: "Elegant design for beauty products",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1480&auto=format&fit=crop",
    fallbackImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1480&auto=format&fit=crop",
    isPremium: true,
  },
  {
    id: "furniture",
    name: "Home & Furniture",
    description: "Sophisticated template for home decor",
    image: "https://images.unsplash.com/photo-1634712282287-14ed57b9cc89?q=80&w=1406&auto=format&fit=crop",
    fallbackImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1406&auto=format&fit=crop",
    isPremium: true,
  },
  {
    id: "food",
    name: "Gourmet Foods",
    description: "Appetizing template for food products",
    image: "https://images.unsplash.com/photo-1526470498-9ae73c665de8?q=80&w=1298&auto=format&fit=crop",
    fallbackImage: "https://images.unsplash.com/photo-1606797461049-ac8c1b51bea1?q=80&w=1298&auto=format&fit=crop",
    isPremium: false,
  },
  {
    id: "jewelry",
    name: "Luxury Jewelry",
    description: "Premium template for high-end jewelry",
    image: "https://images.unsplash.com/photo-1581252517866-6c03232384a4?q=80&w=1471&auto=format&fit=crop",
    fallbackImage: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1471&auto=format&fit=crop",
    isPremium: true,
  }
];

interface TemplateSelectionProps {
  websiteId: string;
  onComplete: () => void;
}

const TemplateSelection = ({ websiteId, onComplete }: TemplateSelectionProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({});
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const [templateApplying, setTemplateApplying] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiGeneratedTemplates, setAiGeneratedTemplates] = useState<any[]>([]);
  const [databaseTemplates, setDatabaseTemplates] = useState<Template[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const navigate = useNavigate();
  const { isPremium, loading: planLoading, checkUpgrade } = usePlan();
  
  // Load templates from database
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setTemplatesLoading(true);
        const result = await getTemplates();
        
        if (result.success) {
          setDatabaseTemplates(result.data);
        } else {
          console.error("Failed to load templates:", result.error);
          toast.error("Failed to load templates from database");
        }
      } catch (error) {
        console.error("Error loading templates:", error);
        toast.error("Error loading templates");
      } finally {
        setTemplatesLoading(false);
      }
    };

    loadTemplates();
  }, []);
  
  // Pre-load all template images
  useEffect(() => {
    templates.forEach(template => {
      setImageLoading(prev => ({ ...prev, [template.id]: true }));
      
      const img = new Image();
      img.onload = () => {
        setImageLoading(prev => ({ ...prev, [template.id]: false }));
        setImageError(prev => ({ ...prev, [template.id]: false }));
      };
      img.onerror = () => {
        console.log(`Primary image failed for ${template.name}, trying fallback`);
        // Try fallback image
        const fallbackImg = new Image();
        fallbackImg.onload = () => {
          setImageLoading(prev => ({ ...prev, [template.id]: false }));
          setImageError(prev => ({ ...prev, [template.id]: false }));
        };
        fallbackImg.onerror = () => {
          console.error(`Both images failed for ${template.name}`);
          setImageLoading(prev => ({ ...prev, [template.id]: false }));
          setImageError(prev => ({ ...prev, [template.id]: true }));
        };
        fallbackImg.src = template.fallbackImage;
      };
      img.src = template.image;
    });
  }, []);

  const handleSelectTemplate = async () => {
    if (!selectedTemplate) {
      toast.error("Please select a template first");
      return;
    }

    // Check if it's a static template, AI generated template, or database template
    const staticTemplate = templates.find(t => t.id === selectedTemplate);
    const aiTemplate = aiGeneratedTemplates.find(t => t.id === selectedTemplate);
    const dbTemplate = databaseTemplates.find(t => t.id === selectedTemplate);
    
    if (!staticTemplate && !aiTemplate && !dbTemplate) {
      toast.error("Template not found");
      return;
    }

    try {
      setIsLoading(true);
      setTemplateApplying(true);

      if (dbTemplate) {
        // Handle database template
        console.log(`Applying database template: ${dbTemplate.name} (${dbTemplate.id})`);
        
        toast.success("Applying custom template...", {
          duration: 3000,
        });
        
        // Save the template-website relationship
        const linkResult = await saveTemplateWebsite(websiteId, dbTemplate.id);
        if (!linkResult.success) {
          console.error("Failed to link template to website:", linkResult.error);
          toast.error("Failed to apply template");
          setTemplateApplying(false);
          return;
        }
        
        // Apply the template using the database template ID
        const result = await updateWebsiteTemplate(websiteId, "custom", dbTemplate.id);
        
        if (!result.success) {
          console.error("Template application failed:", result.error);
          toast.error(result.error || "Failed to apply template");
          setTemplateApplying(false);
          return;
        }
      } else if (aiTemplate) {
        // Handle AI generated template (legacy - for templates not yet saved to DB)
        console.log(`Applying AI template: ${aiTemplate.name} (${aiTemplate.id})`);
        
        toast.success("Applying AI-generated template...", {
          duration: 3000,
        });
        
        const result = await updateWebsiteTemplate(websiteId, "business");
        
        if (!result.success) {
          console.error("Template application failed:", result.error);
          toast.error(result.error || "Failed to apply template");
          setTemplateApplying(false);
          return;
        }
      } else if (staticTemplate) {
        // Handle static template
        const hasAccess = await checkThemeAccess(staticTemplate.id);
        
        if (!hasAccess) {
          toast.error(`This template requires a ${staticTemplate.isPremium ? 'Premium' : 'higher'} plan`);
          setIsLoading(false);
          setTemplateApplying(false);
          return;
        }
        
        console.log(`Applying static template: ${staticTemplate.name} (${staticTemplate.id})`);
        
        toast.success("Applying template, please wait...", {
          duration: 3000,
        });
        
        const result = await updateWebsiteTemplate(websiteId, selectedTemplate);
        
        if (!result.success) {
          console.error("Template application failed:", result.error);
          toast.error(result.error || "Failed to apply template");
          setTemplateApplying(false);
          return;
        }
      }
      
      console.log("Template applied successfully");
      
      setTimeout(() => {
        toast.success("Template applied successfully");
        onComplete();
        setTemplateApplying(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error selecting template:", error);
      toast.error("An unexpected error occurred");
      setTemplateApplying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    console.log("User chose to start from scratch");
    toast.success("Starting from scratch!");
    onComplete();
  };

  const handleAITemplateGenerated = (template: any) => {
    // Add to both lists for backward compatibility
    setAiGeneratedTemplates(prev => [...prev, template]);
    
    // Also add to database templates since it's now saved there
    if (template.templateData) {
      const newDbTemplate: Template = {
        id: template.id,
        name: template.name,
        description: template.description,
        image_url: template.image,
        category: template.metadata?.industry || 'Business',
        is_premium: template.isPremium,
        is_ai_generated: template.isAIGenerated,
        is_active: true,
        metadata: template.metadata,
        template_data: template.templateData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setDatabaseTemplates(prev => [...prev, newDbTemplate]);
    }
    
    setSelectedTemplate(template.id);
    setShowAIGenerator(false);
    toast.success("AI template generated and ready to use!");
  };

  const getImageSrc = (template: typeof templates[0]) => {
    if (imageError[template.id]) {
      return "/placeholder.svg";
    }
    return template.image;
  };
  
  // Show loading state if template is being applied
  if (templateApplying) {
    return (
      <div className="py-8 px-4 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 border-4 border-t-indigo-600 border-r-indigo-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold mb-3">Applying Template</h2>
          <p className="text-gray-600">Please wait while we set up your store with the selected template...</p>
        </div>
      </div>
    );
  }

  // Show loading state while plan is loading
  if (planLoading) {
    return (
      <div className="py-8 px-4 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 border-4 border-t-indigo-600 border-r-indigo-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold mb-3">Loading Templates</h2>
          <p className="text-gray-600">Please wait while we load your available templates...</p>
        </div>
      </div>
    );
  }

  // Combine all templates for display
  const allTemplates = [
    ...templates.map(t => ({
      ...t,
      source: 'static' as const,
      image_url: t.image,
      is_premium: t.isPremium,
      is_ai_generated: false
    })),
    ...databaseTemplates.map(t => ({
      ...t,
      source: 'database' as const,
      image: t.image_url,
      isPremium: t.is_premium,
      isAIGenerated: t.is_ai_generated
    })),
    ...aiGeneratedTemplates.map(t => ({
      ...t,
      source: 'ai' as const,
      image_url: t.image,
      is_premium: t.isPremium,
      is_ai_generated: t.isAIGenerated
    }))
  ];

  return (
    <div className="py-8 px-4 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-3">Choose Your Store Template</h2>
      <p className="text-gray-600 text-center text-lg mb-8 max-w-3xl mx-auto">
        Select a template that matches your business needs. Each template is fully customizable after selection.
      </p>

      {/* AI Template Generator Button */}
      <div className="flex justify-center mb-8">
        <Dialog open={showAIGenerator} onOpenChange={setShowAIGenerator}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="lg"
              className="group border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300"
              onClick={() => {
                if (!checkUpgrade("AI Template Generator", true)) {
                  return;
                }
                setShowAIGenerator(true);
              }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg group-hover:scale-110 transition-transform">
                  <Wand2 className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">Generate Custom Template</span>
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">Let AI create a template tailored for your business</div>
                </div>
                <Sparkles className="h-5 w-5 text-purple-500 group-hover:rotate-12 transition-transform" />
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <AITemplateGenerator
              onTemplateGenerated={handleAITemplateGenerated}
              onClose={() => setShowAIGenerator(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {templatesLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <AspectRatio ratio={16/10}>
                <Skeleton className="w-full h-full" />
              </AspectRatio>
              <div className="p-5">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {!templatesLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {allTemplates.map((template) => (
            <div 
              key={template.id}
              className={`rounded-xl overflow-hidden cursor-pointer transition-all duration-300 bg-white
                ${selectedTemplate === template.id 
                  ? 'ring-4 ring-indigo-500 border-indigo-500 transform scale-[1.02] shadow-xl' 
                  : 'border border-gray-200 shadow-md hover:shadow-lg hover:transform hover:scale-[1.01]'
                }
                ${(template.is_premium || template.isPremium) && !isPremium ? 'opacity-85' : ''}
              `}
              onClick={() => !isLoading && setSelectedTemplate(template.id)}
            >
              <div className="relative">
                <AspectRatio ratio={16/10} className="bg-gray-100">
                  {imageLoading[template.id] && (
                    <Skeleton className="absolute inset-0 z-10" />
                  )}
                  {imageError[template.id] ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded"></div>
                        <p className="text-sm">Preview unavailable</p>
                      </div>
                    </div>
                  ) : (
                    <img 
                      src={template.image_url || template.image || "/placeholder.svg"}
                      alt={template.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        setImageError(prev => ({ ...prev, [template.id]: true }));
                      }}
                    />
                  )}
                </AspectRatio>
                {(template.is_premium || template.isPremium) && (
                  <div className="absolute top-0 right-0 m-3">
                    <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white shadow-sm px-3 py-1 font-medium text-xs">
                      Premium
                    </Badge>
                  </div>
                )}
                {(template.is_ai_generated || template.isAIGenerated) && (
                  <div className="absolute top-0 left-0 m-3">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm px-3 py-1 font-medium text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Generated
                    </Badge>
                  </div>
                )}
                {selectedTemplate === template.id && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-indigo-500 text-white shadow-sm px-3 py-1">
                      Selected
                    </Badge>
                  </div>
                )}
              </div>
              <div className="p-5 bg-white">
                <h3 className="font-semibold text-lg">{template.name}</h3>
                <p className="text-gray-600 mt-1">{template.description}</p>
                {(template.is_premium || template.isPremium) && !isPremium && (
                  <p className="text-xs text-amber-600 mt-2 font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Requires Premium Plan
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center space-x-4 pt-4">
        <Button 
          variant="outline" 
          onClick={handleSkip}
          disabled={isLoading}
          className="px-6 py-2"
        >
          Skip, Start from Scratch
        </Button>
        <Button 
          className={`bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-2 ${!selectedTemplate ? 'opacity-70' : ''}`}
          onClick={handleSelectTemplate}
          disabled={isLoading || !selectedTemplate}
        >
          {isLoading ? 
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Applying...
            </span> : 
            "Use This Template"
          }
        </Button>
      </div>
    </div>
  );
};

export default TemplateSelection;
