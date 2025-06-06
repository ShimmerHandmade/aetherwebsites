
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Crown, Sparkles, Wand2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { usePlan } from "@/contexts/PlanContext";
import { getTemplates, Template } from "@/api/templates";

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

  // Fetch templates from Supabase on component mount
  useEffect(() => {
    const fetchTemplatesData = async () => {
      try {
        setIsLoadingTemplates(true);
        setError(null);
        
        const result = await getTemplates(false);
        
        if (result.success && result.data) {
          setTemplates(result.data);
          console.log("Fetched templates from Supabase:", result.data);
        } else {
          setError(result.error || "Failed to fetch templates");
          console.error("Error fetching templates:", result.error);
        }
      } catch (err) {
        console.error("Error in fetchTemplatesData:", err);
        setError("An unexpected error occurred while loading templates");
      } finally {
        setIsLoadingTemplates(false);
      }
    };

    fetchTemplatesData();
  }, []);

  const categories = ["all", ...new Set(templates.map(template => template.category).filter(Boolean))];

  const filteredTemplates = selectedCategory === "all" 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  const handleApplyTemplate = async (template: Template) => {
    if (template.is_premium && !isPremium && !isEnterprise) {
      if (checkUpgrade) {
        checkUpgrade(`${template.name} Template`);
      }
      return;
    }

    setIsApplying(true);
    
    try {
      console.log("Applying template:", template.name, template.template_data);
      
      const templateElements = template.template_data?.content || [];
      
      onSelectTemplate({
        elements: templateElements,
        templateId: template.id,
        templateName: template.name
      });
      
      toast.success(`${template.name} template applied successfully!`);
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error applying template:", error);
      toast.error("Failed to apply template. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoadingTemplates) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading templates...</p>
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
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Starting Template</h1>
        <p className="text-xl text-gray-600 mb-6">Select a professionally designed template to get started quickly, or start from scratch.</p>
        
        <div className="flex justify-center gap-4">
          {onClose && (
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex items-center gap-2"
            >
              Skip Templates & Start Fresh
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Category Filter */}
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

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
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
  );
};

export default TemplateSelection;
