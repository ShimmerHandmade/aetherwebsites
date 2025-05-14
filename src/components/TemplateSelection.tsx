
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { updateWebsiteTemplate } from "@/api/websites";
import { Badge } from "@/components/ui/badge";
import { usePlan } from "@/contexts/PlanContext";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Template definitions with improved store types
const templates = [
  {
    id: "fashion",
    name: "Fashion Store",
    description: "Stylish template for clothing and accessories",
    image: "/templates/fashion-store.png",
    isPremium: false,
  },
  {
    id: "electronics",
    name: "Electronics Shop",
    description: "Modern template for tech and gadgets",
    image: "/templates/electronics-store.png", 
    isPremium: false,
  },
  {
    id: "beauty",
    name: "Beauty & Cosmetics",
    description: "Elegant design for beauty products",
    image: "/templates/beauty-store.png",
    isPremium: true,
  },
  {
    id: "furniture",
    name: "Home & Furniture",
    description: "Sophisticated template for home decor",
    image: "/templates/furniture-store.png",
    isPremium: true,
  },
  {
    id: "food",
    name: "Gourmet Foods",
    description: "Appetizing template for food products",
    image: "/templates/food-store.png",
    isPremium: false,
  },
  {
    id: "jewelry",
    name: "Luxury Jewelry",
    description: "Premium template for high-end products",
    image: "/templates/jewelry-store.png",
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
  const navigate = useNavigate();
  const { isPremium } = usePlan();

  const handleSelectTemplate = async () => {
    if (!selectedTemplate) {
      toast.error("Please select a template first");
      return;
    }

    // Check if selected template is premium but user doesn't have premium plan
    const template = templates.find(t => t.id === selectedTemplate);
    if (template?.isPremium && !isPremium) {
      toast.error("This template requires a premium plan", {
        description: "Please upgrade to access premium templates"
      });
      return;
    }

    try {
      setIsLoading(true);
      const result = await updateWebsiteTemplate(websiteId, selectedTemplate);
      
      if (!result.success) {
        toast.error(result.error || "Failed to update template");
        return;
      }
      
      toast.success("Template applied successfully");
      onComplete();
    } catch (error) {
      console.error("Error selecting template:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="py-8 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-2">Choose Your Store Template</h2>
      <p className="text-gray-600 text-center mb-8">
        Select a template that matches your store's style or skip to start from scratch.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {templates.map((template) => (
          <div 
            key={template.id}
            className={`border rounded-lg overflow-hidden cursor-pointer transition-all 
              ${selectedTemplate === template.id 
                ? 'ring-2 ring-indigo-500 border-indigo-500 transform scale-[1.02] shadow-lg' 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }
              ${template.isPremium && !isPremium ? 'opacity-80' : ''}
            `}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <div className="relative">
              <AspectRatio ratio={16/9} className="bg-gray-100">
                <img 
                  src={template.image} 
                  alt={template.name} 
                  className="w-full h-full object-cover rounded-t-lg"
                  onError={(e) => {
                    // Fallback if image doesn't load
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </AspectRatio>
              {template.isPremium && (
                <Badge className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800">
                  Premium
                </Badge>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg">{template.name}</h3>
              <p className="text-sm text-gray-600">{template.description}</p>
              {template.isPremium && !isPremium && (
                <p className="text-xs text-amber-600 mt-2 font-medium">
                  Requires Premium Plan
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center space-x-4">
        <Button 
          variant="outline" 
          onClick={handleSkip}
          disabled={isLoading}
        >
          Skip, Start from Scratch
        </Button>
        <Button 
          className="bg-gradient-to-r from-indigo-600 to-purple-600"
          onClick={handleSelectTemplate}
          disabled={isLoading || !selectedTemplate}
        >
          {isLoading ? "Applying..." : "Use This Template"}
        </Button>
      </div>
    </div>
  );
};

export default TemplateSelection;
