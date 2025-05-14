
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { updateWebsiteTemplate } from "@/api/websites";
import { Badge } from "@/components/ui/badge";
import { usePlan } from "@/contexts/PlanContext";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

// Template definitions with improved store types
const templates = [
  {
    id: "fashion",
    name: "Fashion Store",
    description: "Stylish template for clothing and accessories",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1470&auto=format&fit=crop",
    isPremium: false,
  },
  {
    id: "electronics",
    name: "Electronics Shop",
    description: "Modern template for tech and gadgets",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1470&auto=format&fit=crop", 
    isPremium: false,
  },
  {
    id: "beauty",
    name: "Beauty & Cosmetics",
    description: "Elegant design for beauty products",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1480&auto=format&fit=crop",
    isPremium: true,
  },
  {
    id: "furniture",
    name: "Home & Furniture",
    description: "Sophisticated template for home decor",
    image: "https://images.unsplash.com/photo-1634712282287-14ed57b9cc89?q=80&w=1406&auto=format&fit=crop",
    isPremium: true,
  },
  {
    id: "food",
    name: "Gourmet Foods",
    description: "Appetizing template for food products",
    image: "https://images.unsplash.com/photo-1526470498-9ae73c665de8?q=80&w=1298&auto=format&fit=crop",
    isPremium: false,
  },
  {
    id: "jewelry",
    name: "Luxury Jewelry",
    description: "Premium template for high-end products",
    image: "https://images.unsplash.com/photo-1581252517866-6c03232384a4?q=80&w=1471&auto=format&fit=crop",
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

  const handleImageLoad = (templateId: string) => {
    setImageLoading(prev => ({
      ...prev,
      [templateId]: false
    }));
  };

  const handleImageError = (templateId: string) => {
    setImageLoading(prev => ({
      ...prev,
      [templateId]: false
    }));
  };

  return (
    <div className="py-8 px-4 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-3">Choose Your Store Template</h2>
      <p className="text-gray-600 text-center text-lg mb-10 max-w-3xl mx-auto">
        Select a template that matches your business needs. Each template is fully customizable after selection.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {templates.map((template) => (
          <div 
            key={template.id}
            className={`rounded-xl overflow-hidden cursor-pointer transition-all duration-300
              ${selectedTemplate === template.id 
                ? 'ring-4 ring-indigo-500 border-indigo-500 transform scale-[1.02] shadow-xl' 
                : 'border border-gray-200 shadow-md hover:shadow-lg hover:transform hover:scale-[1.01]'
              }
              ${template.isPremium && !isPremium ? 'opacity-85' : ''}
            `}
            onClick={() => !isLoading && setSelectedTemplate(template.id)}
          >
            <div className="relative">
              <AspectRatio ratio={16/10} className="bg-gray-100">
                {(imageLoading[template.id] !== false) && (
                  <Skeleton className="absolute inset-0 z-10" />
                )}
                <img 
                  src={template.image} 
                  alt={template.name} 
                  className="w-full h-full object-cover"
                  onLoad={() => handleImageLoad(template.id)}
                  onError={() => handleImageError(template.id)}
                />
              </AspectRatio>
              {template.isPremium && (
                <div className="absolute top-0 right-0 m-3">
                  <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white shadow-sm px-3 py-1 font-medium text-xs">
                    Premium
                  </Badge>
                </div>
              )}
              {selectedTemplate === template.id && (
                <div className="absolute top-3 left-3">
                  <Badge className="bg-indigo-500 text-white shadow-sm px-3 py-1">
                    Selected
                  </Badge>
                </div>
              )}
            </div>
            <div className="p-5 bg-white">
              <h3 className="font-semibold text-lg">{template.name}</h3>
              <p className="text-gray-600 mt-1">{template.description}</p>
              {template.isPremium && !isPremium && (
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
