
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Template {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  isPremium?: boolean;
}

interface TemplateSelectorProps {
  onSelectTemplate?: (templateId: string) => void;
  onClose?: () => void;
}

const templates: Template[] = [
  {
    id: 'electronics',
    name: 'Electronics Store',
    description: 'Modern e-commerce template for electronics and gadgets',
    image: '/templates/electronics.png',
    category: 'E-commerce'
  },
  {
    id: 'fashion',
    name: 'Fashion Boutique',
    description: 'Elegant template for fashion and clothing stores',
    image: '/templates/fashion.png',
    category: 'E-commerce'
  },
  {
    id: 'food',
    name: 'Restaurant & Food',
    description: 'Appetizing template for restaurants and food businesses',
    image: '/templates/food.png',
    category: 'Restaurant'
  },
  {
    id: 'beauty',
    name: 'Beauty & Wellness',
    description: 'Clean template for beauty salons and wellness centers',
    image: '/templates/beauty.png',
    category: 'Beauty',
    isPremium: true
  },
  {
    id: 'furniture',
    name: 'Furniture Store',
    description: 'Stylish template for furniture and home decor',
    image: '/templates/furniture.png',
    category: 'E-commerce',
    isPremium: true
  },
  {
    id: 'jewelry',
    name: 'Jewelry Collection',
    description: 'Luxurious template for jewelry and accessories',
    image: '/templates/jewelry.png',
    category: 'E-commerce',
    isPremium: true
  }
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  onSelectTemplate, 
  onClose 
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const handleSelectTemplate = async (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    
    if (template?.isPremium) {
      toast.error("This template requires a Premium plan");
      return;
    }
    
    setIsApplying(true);
    try {
      if (onSelectTemplate) {
        onSelectTemplate(templateId);
        toast.success(`Applied ${template?.name} template`);
      }
    } catch (error) {
      toast.error("Failed to apply template");
    } finally {
      setIsApplying(false);
    }
  };

  const handlePreview = (templateId: string) => {
    // Open template preview in new tab
    window.open(`/templates/${templateId}`, '_blank');
  };

  return (
    <div className="p-6 max-h-[80vh] overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Choose a Template</h2>
        <p className="text-gray-600">Start with a professionally designed template</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <CardContent className="p-0">
              <div className="relative">
                <img 
                  src={template.image} 
                  alt={template.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                  onError={(e) => {
                    // Fallback to a placeholder if image fails to load
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(template.name);
                  }}
                />
                {template.isPremium && (
                  <Badge className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{template.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {template.category}
                  </Badge>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">
                  {template.description}
                </p>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreview(template.id);
                    }}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTemplate(template.id);
                    }}
                    disabled={isApplying}
                    className="flex-1"
                  >
                    {isApplying ? 'Applying...' : 'Use Template'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {onClose && (
        <div className="flex justify-center mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
