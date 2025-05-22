
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Website } from '@/types/general';
import { cn } from '@/lib/utils';

interface TemplateSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  setWebsites: React.Dispatch<React.SetStateAction<Website[]>>;
}

const TemplateSelection = ({ isOpen, onClose, setWebsites }: TemplateSelectionProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('blank');
  const [websiteName, setWebsiteName] = useState<string>('My New Website');
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const templates = [
    { id: 'blank', name: 'Blank Site', description: 'Start from scratch' },
    { id: 'business', name: 'Business', description: 'Professional business template' },
    { id: 'portfolio', name: 'Portfolio', description: 'Showcase your work' },
    { id: 'ecommerce', name: 'E-commerce', description: 'Online store template' },
    // Add more templates as needed
  ];

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleCreateWebsite = async () => {
    if (!websiteName.trim()) {
      toast.error('Please enter a website name');
      return;
    }

    setIsCreating(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to create a website');
        return;
      }

      // Create a new website
      const { data, error } = await supabase
        .from('websites')
        .insert([
          {
            name: websiteName,
            user_id: user.id,
            template: selectedTemplate !== 'blank' ? selectedTemplate : null,
            content: {},
            settings: {}
          }
        ])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        toast.success('Website created successfully');
        setWebsites(prev => [data[0], ...prev]);
        onClose();
      }
    } catch (error) {
      console.error('Error creating website:', error);
      toast.error('Failed to create website');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className={cn(
                  "border rounded-lg p-4 cursor-pointer transition-all",
                  selectedTemplate === template.id
                    ? "border-primary bg-primary/5"
                    : "hover:border-gray-400"
                )}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <div className="h-24 bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                  {template.id !== 'blank' ? (
                    <img
                      src={`/templates/${template.id}.png`}
                      alt={template.name}
                      className="h-full w-full object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">Blank Template</span>
                  )}
                </div>
                <h3 className="font-medium">{template.name}</h3>
                <p className="text-sm text-gray-500">{template.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <label htmlFor="website-name" className="block text-sm font-medium text-gray-700 mb-1">
              Website Name
            </label>
            <input
              id="website-name"
              type="text"
              className="w-full p-2 border rounded-md"
              value={websiteName}
              onChange={(e) => setWebsiteName(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose} disabled={isCreating}>
              Cancel
            </Button>
            <Button onClick={handleCreateWebsite} disabled={isCreating}>
              {isCreating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Website"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSelection;
