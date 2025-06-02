
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

// Static templates with improved fallback handling
const staticTemplates = [
  {
    id: "fashion",
    name: "Fashion Store",
    description: "Stylish template for clothing and accessories",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1470&auto=format&fit=crop",
    isPremium: false,
    isStatic: true,
  },
  {
    id: "electronics",
    name: "Electronics Shop",
    description: "Modern template for tech and gadgets",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1470&auto=format&fit=crop", 
    isPremium: false,
    isStatic: true,
  },
  {
    id: "beauty",
    name: "Beauty & Cosmetics",
    description: "Elegant design for beauty products",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1480&auto=format&fit=crop",
    isPremium: true,
    isStatic: true,
  },
  {
    id: "furniture",
    name: "Home & Furniture",
    description: "Sophisticated template for home decor",
    image: "https://images.unsplash.com/photo-1634712282287-14ed57b9cc89?q=80&w=1406&auto=format&fit=crop",
    isPremium: true,
    isStatic: true,
  },
  {
    id: "food",
    name: "Gourmet Foods",
    description: "Appetizing template for food products",
    image: "https://images.unsplash.com/photo-1526470498-9ae73c665de8?q=80&w=1298&auto=format&fit=crop",
    isPremium: false,
    isStatic: true,
  },
  {
    id: "jewelry",
    name: "Luxury Jewelry",
    description: "Premium template for high-end jewelry",
    image: "https://images.unsplash.com/photo-1581252517866-6c03232384a4?q=80&w=1471&auto=format&fit=crop",
    isPremium: true,
    isStatic: true,
  }
];

interface TemplateSelectionProps {
  websiteId: string;
  onComplete: () => void;
}

const TemplateSelection = ({ websiteId, onComplete }: TemplateSelectionProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
        console.log("Loading templates from database...");
        const result = await getTemplates();
        
        if (result.success) {
          console.log("Templates loaded successfully:", result.data);
          setDatabaseTemplates(result.data);
        } else {
          console.error("Failed to load templates:", result.error);
          toast.error("Failed to load custom templates");
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

  const handleSelectTemplate = async () => {
    if (!selectedTemplate) {
      toast.error("Please select a template first");
      return;
    }

    try {
      setIsLoading(true);
      setTemplateApplying(true);

      // Find the selected template
      const staticTemplate = staticTemplates.find(t => t.id === selectedTemplate);
      const dbTemplate = databaseTemplates.find(t => t.id === selectedTemplate);
      const aiTemplate = aiGeneratedTemplates.find(t => t.id === selectedTemplate);
      
      if (!staticTemplate && !dbTemplate && !aiTemplate) {
        toast.error("Template not found");
        return;
      }

      console.log("Applying template:", selectedTemplate);

      if (dbTemplate) {
        console.log(`Applying database template: ${dbTemplate.name} (${dbTemplate.id})`);
        
        toast.success("Applying custom template...", { duration: 3000 });
        
        // Link template to website
        const linkResult = await saveTemplateWebsite(websiteId, dbTemplate.id);
        if (!linkResult.success) {
          console.error("Failed to link template to website:", linkResult.error);
          toast.error("Failed to apply template");
          return;
        }
        
        // Apply template
        const result = await updateWebsiteTemplate(websiteId, "custom", dbTemplate.id);
        
        if (!result.success) {
          console.error("Template application failed:", result.error);
          toast.error(result.error || "Failed to apply template");
          return;
        }
      } else if (staticTemplate) {
        // Check access for premium templates
        if (staticTemplate.isPremium && !isPremium) {
          if (checkUpgrade) {
            checkUpgrade(`${staticTemplate.name} template`);
          } else {
            toast.error("Premium plan required for this template");
          }
          return;
        }
        
        console.log(`Applying static template: ${staticTemplate.name} (${staticTemplate.id})`);
        
        toast.success("Applying template, please wait...", { duration: 3000 });
        
        const result = await updateWebsiteTemplate(websiteId, selectedTemplate);
        
        if (!result.success) {
          console.error("Template application failed:", result.error);
          toast.error(result.error || "Failed to apply template");
          return;
        }
      } else if (aiTemplate) {
        console.log(`Applying AI template: ${aiTemplate.name} (${aiTemplate.id})`);
        
        toast.success("Applying AI-generated template...", { duration: 3000 });
        
        // For AI templates, use a default template as base for now
        const result = await updateWebsiteTemplate(websiteId, "business");
        
        if (!result.success) {
          console.error("Template application failed:", result.error);
          toast.error(result.error || "Failed to apply template");
          return;
        }
      }
      
      console.log("Template applied successfully");
      
      setTimeout(() => {
        toast.success("Template applied successfully");
        onComplete();
      }, 1000);
      
    } catch (error) {
      console.error("Error selecting template:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
      setTemplateApplying(false);
    }
  };

  const handleSkip = () => {
    console.log("User chose to start from scratch");
    toast.success("Starting from scratch!");
    onComplete();
  };

  const handleAITemplateGenerated = (template: any) => {
    console.log("AI template generated:", template);
    setAiGeneratedTemplates(prev => [...prev, template]);
    
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

  // Combine all templates into a single array
  const allTemplates = [
    ...staticTemplates.map(t => ({
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

  const handleAIGeneratorClick = () => {
    if (checkUpgrade) {
      checkUpgrade("AI Template Generator");
    } else {
      setShowAIGenerator(true);
    }
  };

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
              onClick={handleAIGeneratorClick}
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

      {/* Templates Grid */}
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
              className={`rounded-xl overflow-hidden cursor-pointer transition-all duration-300 bg-white border shadow-md hover:shadow-lg hover:transform hover:scale-[1.01]
                ${selectedTemplate === template.id 
                  ? 'ring-4 ring-indigo-500 border-indigo-500 transform scale-[1.02] shadow-xl' 
                  : 'border-gray-200'
                }
                ${(template.is_premium || template.isPremium) && !isPremium ? 'opacity-85' : ''}
              `}
              onClick={() => !isLoading && setSelectedTemplate(template.id)}
            >
              <div className="relative">
                <AspectRatio ratio={16/10} className="bg-gray-100">
                  <img 
                    src={template.image_url || template.image || "/placeholder.svg"}
                    alt={template.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </AspectRatio>
                
                {/* Premium Badge */}
                {(template.is_premium || template.isPremium) && (
                  <div className="absolute top-0 right-0 m-3">
                    <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-sm px-3 py-1 font-medium text-xs">
                      Premium
                    </Badge>
                  </div>
                )}
                
                {/* AI Generated Badge */}
                {(template.is_ai_generated || template.isAIGenerated) && (
                  <div className="absolute top-0 left-0 m-3">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm px-3 py-1 font-medium text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Generated
                    </Badge>
                  </div>
                )}
                
                {/* Selected Badge */}
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
                    <Crown className="h-4 w-4 mr-1" />
                    Requires Premium Plan
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
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
              <div className="animate-spin -ml-1 mr-2 h-4 w-4 text-white border-2 border-t-transparent border-white rounded-full"></div>
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
