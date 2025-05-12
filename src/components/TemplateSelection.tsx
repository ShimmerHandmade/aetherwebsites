
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateWebsiteTemplate } from "@/api/websites";

// Template definitions
const templates = [
  {
    id: "ecommerce",
    name: "E-Commerce Store",
    description: "A complete online store template with product listings and cart",
    image: "/templates/ecommerce.png"
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Showcase your work with this elegant portfolio template",
    image: "/templates/portfolio.png"
  },
  {
    id: "blog",
    name: "Blog",
    description: "A clean and modern blog layout for your content",
    image: "/templates/blog.png"
  },
  {
    id: "business",
    name: "Business",
    description: "Professional website for businesses and services",
    image: "/templates/business.png"
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

  const handleSelectTemplate = async () => {
    if (!selectedTemplate) {
      toast.error("Please select a template first");
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
    <div className="py-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-2">Choose a Template</h2>
      <p className="text-gray-600 text-center mb-8">
        Select a template to get started quickly or skip to start from scratch.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {templates.map((template) => (
          <div 
            key={template.id}
            className={`border rounded-lg overflow-hidden cursor-pointer transition-all 
              ${selectedTemplate === template.id 
                ? 'ring-2 ring-indigo-500 border-indigo-500 transform scale-[1.02]' 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <div className="h-40 bg-gray-100 overflow-hidden">
              <img 
                src={template.image} 
                alt={template.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image doesn't load
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg">{template.name}</h3>
              <p className="text-sm text-gray-600">{template.description}</p>
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
