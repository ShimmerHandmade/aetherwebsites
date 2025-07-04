import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Crown, Sparkles, Wand2, ArrowRight, Zap, FileText } from "lucide-react";
import { toast } from "sonner";
import { usePlan } from "@/contexts/PlanContext";
import { getTemplates, Template } from "@/api/templates";
import AITemplateGenerator from "./AITemplateGenerator";

interface TemplateSelectionProps {
  onSelectTemplate: (templateData: any) => void;
  onClose?: () => void;
  websiteId?: string;
  onComplete?: () => void;
}

const TemplateSelection: React.FC<TemplateSelectionProps> = ({ 
  onSelectTemplate, 
  onClose, 
  websiteId, 
  onComplete 
}) => {
  const { isPremium, isEnterprise, checkUpgrade } = usePlan();
  const [isApplying, setIsApplying] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  // Fetch templates from Supabase on component mount
  useEffect(() => {
    const fetchTemplatesData = async () => {
      try {
        console.log("🔄 Fetching templates from Supabase...");
        setIsLoadingTemplates(true);
        setError(null);
        
        const result = await getTemplates(false);
        
        if (result.success && result.data) {
          console.log("✅ Templates loaded successfully:", result.data.length);
          setTemplates(result.data);
        } else {
          console.error("❌ Failed to fetch templates:", result.error);
          setError(result.error || "Failed to fetch templates");
          setTemplates([]);
        }
      } catch (err) {
        console.error("❌ Error in fetchTemplatesData:", err);
        setError("An unexpected error occurred while loading templates");
        setTemplates([]);
      } finally {
        setIsLoadingTemplates(false);
      }
    };

    fetchTemplatesData();
  }, []);

  // Get unique categories from templates
  const categories = React.useMemo(() => {
    const uniqueCategories = new Set(templates.map(template => template.category).filter(Boolean));
    return ["all", ...Array.from(uniqueCategories)];
  }, [templates]);

  const filteredTemplates = React.useMemo(() => {
    return selectedCategory === "all" 
      ? templates 
      : templates.filter(template => template.category === selectedCategory);
  }, [templates, selectedCategory]);

  const handleApplyTemplate = async (template: Template) => {
    if (template.is_premium && !isPremium && !isEnterprise) {
      if (checkUpgrade) {
        checkUpgrade(`${template.name} Template`);
      }
      return;
    }

    setIsApplying(true);
    
    try {
      console.log("🎨 Applying template:", template.name);
      console.log("📊 Template data structure:", template.template_data);
      
      // Pass the entire template object to the handler
      // The useTemplateApplication hook will handle extracting the content
      onSelectTemplate(template);
      
      toast.success(`${template.name} template applied successfully!`);
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("❌ Error applying template:", error);
      toast.error("Failed to apply template. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  const handleAIGenerator = () => {
    if (!isPremium && !isEnterprise && checkUpgrade) {
      checkUpgrade("AI Template Generator");
      return;
    }
    setShowAIGenerator(true);
  };

  const handleAITemplateGenerated = (generatedTemplate: any) => {
    console.log("🤖 AI Template generated:", generatedTemplate);
    
    try {
      let templateElements = [];

      // Handle AI generated template structure
      if (Array.isArray(generatedTemplate)) {
        templateElements = generatedTemplate;
      } else if (generatedTemplate.elements && Array.isArray(generatedTemplate.elements)) {
        templateElements = generatedTemplate.elements;
      } else if (generatedTemplate.content && Array.isArray(generatedTemplate.content)) {
        templateElements = generatedTemplate.content;
      } else {
        throw new Error("Invalid AI template structure");
      }

      console.log("🎯 Processed AI template elements:", templateElements.length);

      if (!templateElements || templateElements.length === 0) {
        throw new Error("AI generator returned no valid elements");
      }

      onSelectTemplate(templateElements);
      setShowAIGenerator(false);
      
      toast.success("AI generated template applied successfully!");
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("❌ Error processing AI generated template:", error);
      toast.error("Failed to apply AI generated template. Please try again.");
    }
  };

  const handleStartBlank = () => {
    console.log("📄 Starting with blank canvas");
    onSelectTemplate([]);
    
    if (onComplete) {
      onComplete();
    }
    
    toast.success("Starting with blank canvas");
  };

  if (isLoadingTemplates) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading templates from database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Starting Point</h1>
          <p className="text-xl text-gray-600 mb-6">Select a professionally designed template, generate with AI, or start from scratch.</p>
          
          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Button 
              onClick={handleAIGenerator}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3"
              size="lg"
            >
              <Zap className="h-5 w-5" />
              Generate with AI
              <Badge className="bg-white/20 text-white text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                {!isPremium && !isEnterprise ? "Pro" : "New"}
              </Badge>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleStartBlank}
              className="flex items-center gap-2 px-6 py-3"
              size="lg"
            >
              <FileText className="h-5 w-5" />
              Start with Blank Site
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Category Filter - Only show if we have templates */}
        {templates.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        {/* Templates Grid */}
        {templates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No templates available yet.</p>
            <p className="text-sm text-gray-500">Start with a blank canvas or use our AI generator to create your website.</p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No templates found for the selected category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                {template.is_premium && (
                  <Badge className="absolute top-2 right-2 z-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
                
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  <img 
                    src={template.image_url || "/placeholder.svg"} 
                    alt={template.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-4">{template.description || "No description available"}</p>
                  
                  <Button 
                    onClick={() => handleApplyTemplate(template)}
                    disabled={isApplying}
                    className="w-full"
                    variant={template.is_premium && !isPremium && !isEnterprise ? "outline" : "default"}
                  >
                    {isApplying ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Applying...
                      </>
                    ) : template.is_premium && !isPremium && !isEnterprise ? (
                      <>
                        <Crown className="h-4 w-4 mr-2" />
                        Upgrade to Use
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Use This Template
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* AI Template Generator Dialog */}
      <Dialog open={showAIGenerator} onOpenChange={setShowAIGenerator}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              AI Template Generator
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            </DialogTitle>
          </DialogHeader>
          <AITemplateGenerator 
            onTemplateGenerated={handleAITemplateGenerated}
            onClose={() => setShowAIGenerator(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TemplateSelection;
