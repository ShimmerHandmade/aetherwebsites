
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Download } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  preview_image: string;
  elements: any[];
  settings: any;
}

interface TemplateDisplayProps {
  templates: Template[];
  onSelectTemplate?: (template: Template) => void;
  onPreviewTemplate?: (template: Template) => void;
  selectedTemplateId?: string;
}

const TemplateDisplay: React.FC<TemplateDisplayProps> = ({
  templates,
  onSelectTemplate,
  onPreviewTemplate,
  selectedTemplateId
}) => {
  if (!templates || templates.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No templates available</h3>
        <p className="text-gray-600">Templates will appear here when they are available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <Card 
          key={template.id} 
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedTemplateId === template.id ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => onSelectTemplate?.(template)}
        >
          <CardHeader className="p-0">
            <div className="relative">
              <img
                src={template.preview_image}
                alt={template.name}
                className="w-full h-48 object-cover rounded-t-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/api/placeholder/400/300';
                }}
              />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-white/90">
                  {template.category}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="text-lg mb-2">{template.name}</CardTitle>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {template.description}
            </p>
            
            <div className="flex gap-2">
              {onPreviewTemplate && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreviewTemplate(template);
                  }}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              )}
              
              {onSelectTemplate && (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTemplate(template);
                  }}
                  className="flex-1"
                  disabled={selectedTemplateId === template.id}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {selectedTemplateId === template.id ? 'Selected' : 'Use Template'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TemplateDisplay;
