
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Wand2, Loader2, Crown } from "lucide-react";
import { toast } from "sonner";
import { usePlan } from "@/contexts/PlanContext";

interface AITemplateGeneratorProps {
  onTemplateGenerated: (template: any) => void;
  onClose: () => void;
}

const AITemplateGenerator = ({ onTemplateGenerated, onClose }: AITemplateGeneratorProps) => {
  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [style, setStyle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { isPremium, isEnterprise, checkUpgrade } = usePlan();

  const handleGenerate = async () => {
    // Check if user has premium access
    if (!checkUpgrade("AI Template Generator", true)) {
      return;
    }

    if (!businessName.trim() || !businessDescription.trim()) {
      toast.error("Please fill in at least the business name and description");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI generation for now - this would be replaced with actual AI API call
      toast.success("Generating your custom template...", {
        duration: 3000,
      });

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Generate a mock template based on user input
      const generatedTemplate = {
        id: `ai-generated-${Date.now()}`,
        name: `${businessName} Template`,
        description: `Custom AI-generated template for ${businessName}`,
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1470&auto=format&fit=crop",
        isPremium: true,
        isAIGenerated: true,
        metadata: {
          businessName,
          businessDescription,
          industry,
          style,
          generatedAt: new Date().toISOString()
        }
      };

      onTemplateGenerated(generatedTemplate);
      toast.success("Template generated successfully!");
      
    } catch (error) {
      console.error("Error generating template:", error);
      toast.error("Failed to generate template. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Wand2 className="h-6 w-6 text-white" />
          </div>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Crown className="h-3 w-3 mr-1" />
            Premium Feature
          </Badge>
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          AI Template Generator
        </CardTitle>
        <p className="text-gray-600">
          Let our AI create a custom template tailored specifically for your business
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Business Name *
            </label>
            <Input
              placeholder="e.g., Sunset Cafe, TechStart Solutions"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              disabled={isGenerating}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Business Description *
            </label>
            <Textarea
              placeholder="Describe what your business does, your target audience, and key services..."
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              rows={3}
              disabled={isGenerating}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Industry
              </label>
              <Input
                placeholder="e.g., Restaurant, Technology, Fashion"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                disabled={isGenerating}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Style Preference
              </label>
              <Input
                placeholder="e.g., Modern, Minimalist, Bold"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                disabled={isGenerating}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isGenerating}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !businessName.trim() || !businessDescription.trim()}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Template
              </>
            )}
          </Button>
        </div>

        {!isPremium && !isEnterprise && (
          <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2 text-purple-700 mb-2">
              <Crown className="h-4 w-4" />
              <span className="font-medium">Premium Feature</span>
            </div>
            <p className="text-sm text-purple-600">
              Upgrade to Professional plan to unlock AI-powered template generation and create unlimited custom templates.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AITemplateGenerator;
