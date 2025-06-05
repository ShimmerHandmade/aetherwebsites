
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Crown, Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { usePlan } from "@/contexts/PlanContext";
import { businessTemplate } from "@/templates/business";
import { ecommerceTemplate } from "@/templates/ecommerce";
import { portfolioTemplate } from "@/templates/portfolio";
import { blogTemplate } from "@/templates/blog";
import { fashionTemplate } from "@/templates/fashion";
import { electronicsTemplate } from "@/templates/electronics";
import { foodTemplate } from "@/templates/food";
import { beautyTemplate } from "@/templates/beauty";
import { jewelryTemplate } from "@/templates/jewelry";
import { furnitureTemplate } from "@/templates/furniture";

interface Template {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  isPremium?: boolean;
  elements: any[];
}

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

  // Convert template modules to template objects
  const availableTemplates: Template[] = [
    {
      id: "business",
      name: "Business",
      description: "Professional business website with hero, services, and contact sections",
      image: "/templates/business.png",
      category: "business",
      isPremium: false,
      elements: businessTemplate.elements
    },
    {
      id: "ecommerce",
      name: "E-commerce",
      description: "Online store with product showcase and shopping features",
      image: "/templates/ecommerce.png",
      category: "ecommerce",
      isPremium: true,
      elements: ecommerceTemplate.elements
    },
    {
      id: "portfolio",
      name: "Portfolio",
      description: "Creative portfolio showcasing your work and skills",
      image: "/templates/portfolio.png",
      category: "portfolio",
      isPremium: false,
      elements: portfolioTemplate.elements
    },
    {
      id: "blog",
      name: "Blog",
      description: "Content-focused blog with article layouts",
      image: "/templates/blog.png",
      category: "blog",
      isPremium: false,
      elements: blogTemplate.elements
    },
    {
      id: "fashion",
      name: "Fashion",
      description: "Stylish fashion store template",
      image: "/templates/fashion.png",
      category: "fashion",
      isPremium: true,
      elements: fashionTemplate.elements
    },
    {
      id: "electronics",
      name: "Electronics",
      description: "Tech and electronics store",
      image: "/templates/electronics.png",
      category: "electronics",
      isPremium: true,
      elements: electronicsTemplate.elements
    },
    {
      id: "food",
      name: "Food & Restaurant",
      description: "Restaurant and food business template",
      image: "/templates/food.png",
      category: "food",
      isPremium: true,
      elements: foodTemplate.elements
    },
    {
      id: "beauty",
      name: "Beauty & Cosmetics",
      description: "Beauty and cosmetics store",
      image: "/templates/beauty.png",
      category: "beauty",
      isPremium: true,
      elements: beautyTemplate.elements
    },
    {
      id: "jewelry",
      name: "Jewelry",
      description: "Elegant jewelry store template",
      image: "/templates/jewelry.png",
      category: "jewelry",
      isPremium: true,
      elements: jewelryTemplate.elements
    },
    {
      id: "furniture",
      name: "Furniture",
      description: "Modern furniture store template",
      image: "/templates/furniture.png",
      category: "furniture",
      isPremium: true,
      elements: furnitureTemplate.elements
    }
  ];

  const categories = ["all", "business", "ecommerce", "portfolio", "blog", "fashion", "electronics", "food", "beauty", "jewelry", "furniture"];

  const filteredTemplates = selectedCategory === "all" 
    ? availableTemplates 
    : availableTemplates.filter(template => template.category === selectedCategory);

  const handleApplyTemplate = async (template: Template) => {
    // Check if template is premium and user doesn't have access
    if (template.isPremium && !isPremium && !isEnterprise) {
      if (checkUpgrade) {
        checkUpgrade(`${template.name} Template`);
      }
      return;
    }

    setIsApplying(true);
    
    try {
      console.log("Applying template:", template.name, template.elements);
      
      // Apply the template elements
      onSelectTemplate({
        elements: template.elements,
        templateId: template.id,
        templateName: template.name
      });
      
      toast.success(`${template.name} template applied successfully!`);
      
      if (onClose) {
        onClose();
      }

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Choose a Template</h2>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
            {template.isPremium && (
              <Badge className="absolute top-2 right-2 z-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
            
            <div className="aspect-video bg-gray-100 overflow-hidden">
              <img 
                src={template.image} 
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
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              
              <Button 
                onClick={() => handleApplyTemplate(template)}
                disabled={isApplying}
                className="w-full"
                variant={template.isPremium && !isPremium && !isEnterprise ? "outline" : "default"}
              >
                {isApplying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Applying...
                  </>
                ) : template.isPremium && !isPremium && !isEnterprise ? (
                  <>
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Use
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Apply Template
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelection;
