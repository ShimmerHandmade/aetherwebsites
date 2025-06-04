
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sparkles, Wand2, Loader2, Crown, Palette, Layout, Zap } from "lucide-react";
import { toast } from "sonner";
import { usePlan } from "@/contexts/PlanContext";
import { saveTemplate } from "@/api/templates";
import { BuilderElement } from "@/contexts/builder/types";

interface AITemplateGeneratorProps {
  onTemplateGenerated: (template: any) => void;
  onClose: () => void;
}

const AITemplateGenerator = ({ onTemplateGenerated, onClose }: AITemplateGeneratorProps) => {
  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [designStyle, setDesignStyle] = useState("");
  const [colorScheme, setColorScheme] = useState("");
  const [features, setFeatures] = useState({
    ecommerce: false,
    blog: false,
    contact: false,
    gallery: false,
    testimonials: false,
    pricing: false,
    faq: false,
    newsletter: false
  });
  const [tone, setTone] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { isPremium, isEnterprise, checkUpgrade } = usePlan();

  const industries = [
    "Technology", "Healthcare", "Finance", "Education", "Retail", "Food & Restaurant",
    "Real Estate", "Fitness & Wellness", "Beauty & Fashion", "Legal Services",
    "Consulting", "Manufacturing", "Non-Profit", "Travel & Tourism", "Entertainment"
  ];

  const designStyles = [
    "Modern & Minimalist", "Bold & Creative", "Professional & Corporate", 
    "Playful & Fun", "Elegant & Luxury", "Tech-Forward", "Classic & Traditional",
    "Artistic & Creative", "Clean & Simple", "Dynamic & Energetic"
  ];

  const colorSchemes = [
    "Blue & White (Trust & Professional)", "Green & Earth Tones (Natural & Growth)",
    "Purple & Gold (Luxury & Premium)", "Orange & Red (Energy & Excitement)",
    "Black & Gold (Elegant & Sophisticated)", "Teal & Coral (Modern & Fresh)",
    "Navy & Silver (Corporate & Reliable)", "Pink & Gray (Creative & Soft)",
    "Custom Color Palette"
  ];

  const tones = [
    "Professional & Authoritative", "Friendly & Approachable", "Creative & Innovative",
    "Trustworthy & Reliable", "Energetic & Enthusiastic", "Calm & Peaceful",
    "Bold & Confident", "Warm & Personal"
  ];

  const generateAdvancedTemplate = (formData: any): BuilderElement[] => {
    const { businessName, businessDescription, industry, targetAudience, designStyle, features, tone } = formData;
    
    // Generate more sophisticated template structure
    const elements: BuilderElement[] = [];
    
    // Hero Section with dynamic content based on industry
    const heroContent = generateHeroContent(businessName, industry, tone);
    elements.push({
      id: 'hero-section',
      type: 'hero',
      content: heroContent,
      props: {
        styles: getIndustryStyles(industry, 'hero'),
        position: { x: 0, y: 0 },
        size: { width: 100, height: 80 }
      }
    });

    // About Section
    const aboutContent = generateAboutContent(businessName, businessDescription, targetAudience);
    elements.push({
      id: 'about-section',
      type: 'section',
      content: aboutContent,
      props: {
        styles: getIndustryStyles(industry, 'about'),
        position: { x: 0, y: 80 },
        size: { width: 100, height: 40 }
      }
    });

    // Features/Services Section
    if (features.ecommerce || features.gallery || features.pricing) {
      const servicesContent = generateServicesContent(industry, features);
      elements.push({
        id: 'services-section',
        type: 'section',
        content: servicesContent,
        props: {
          styles: getIndustryStyles(industry, 'services'),
          position: { x: 0, y: 120 },
          size: { width: 100, height: 50 }
        }
      });
    }

    // Testimonials Section
    if (features.testimonials) {
      elements.push({
        id: 'testimonials-section',
        type: 'testimonial',
        content: generateTestimonialsContent(industry),
        props: {
          styles: getIndustryStyles(industry, 'testimonials'),
          position: { x: 0, y: 170 },
          size: { width: 100, height: 40 }
        }
      });
    }

    // FAQ Section
    if (features.faq) {
      elements.push({
        id: 'faq-section',
        type: 'faq',
        content: generateFAQContent(industry),
        props: {
          styles: getIndustryStyles(industry, 'faq'),
          position: { x: 0, y: 210 },
          size: { width: 100, height: 35 }
        }
      });
    }

    // Contact Section
    if (features.contact) {
      elements.push({
        id: 'contact-section',
        type: 'contact',
        content: generateContactContent(businessName, industry),
        props: {
          styles: getIndustryStyles(industry, 'contact'),
          position: { x: 0, y: 245 },
          size: { width: 100, height: 30 }
        }
      });
    }

    return elements;
  };

  const generateHeroContent = (businessName: string, industry: string, tone: string) => {
    const industrySpecific = {
      "Technology": `Innovative ${businessName} - Transforming Ideas into Digital Solutions`,
      "Healthcare": `${businessName} - Compassionate Care, Advanced Treatment`,
      "Finance": `${businessName} - Your Trusted Financial Partner`,
      "Education": `${businessName} - Empowering Minds, Shaping Futures`,
      "Retail": `Discover Amazing Products at ${businessName}`,
      "Food & Restaurant": `${businessName} - Where Flavor Meets Excellence`,
      "Real Estate": `${businessName} - Your Gateway to Dream Properties`,
      "Fitness & Wellness": `${businessName} - Transform Your Life, One Step at a Time`,
      "Beauty & Fashion": `${businessName} - Redefine Your Style`,
      "Legal Services": `${businessName} - Expert Legal Solutions You Can Trust`
    };
    
    return industrySpecific[industry as keyof typeof industrySpecific] || `Welcome to ${businessName} - Excellence in Every Detail`;
  };

  const generateAboutContent = (businessName: string, description: string, audience: string) => {
    return `About ${businessName}. ${description} We specialize in serving ${audience || 'our valued customers'} with exceptional quality and dedication. Our commitment to excellence drives everything we do.`;
  };

  const generateServicesContent = (industry: string, features: any) => {
    const serviceTemplates = {
      "Technology": "Our Services: Custom Software Development, Cloud Solutions, AI Implementation, Digital Transformation",
      "Healthcare": "Our Services: Primary Care, Specialized Treatment, Preventive Medicine, Health Screenings",
      "Finance": "Our Services: Investment Planning, Insurance Solutions, Retirement Planning, Financial Consulting",
      "Education": "Our Programs: Academic Excellence, Skill Development, Career Guidance, Personal Growth",
      "Retail": "Shop Our Collections: Latest Trends, Quality Products, Exceptional Value, Customer Satisfaction"
    };
    
    return serviceTemplates[industry as keyof typeof serviceTemplates] || "Our Services: Quality Solutions Tailored to Your Needs";
  };

  const generateTestimonialsContent = (industry: string) => {
    return "What Our Customers Say: 'Outstanding service and exceptional results. Highly recommended!' - Sarah Johnson. 'Professional, reliable, and truly committed to excellence.' - Michael Chen";
  };

  const generateFAQContent = (industry: string) => {
    return "Frequently Asked Questions: Get answers to common questions about our services, pricing, and processes.";
  };

  const generateContactContent = (businessName: string, industry: string) => {
    return `Get in Touch with ${businessName}. Ready to get started? Contact our team today for a consultation. We're here to help you achieve your goals.`;
  };

  const getIndustryStyles = (industry: string, section: string) => {
    const styleMap = {
      "Technology": {
        hero: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '4rem 2rem' },
        about: { backgroundColor: '#f8fafc', padding: '3rem 2rem', textAlign: 'center' },
        services: { backgroundColor: '#ffffff', padding: '3rem 2rem' },
        testimonials: { backgroundColor: '#f1f5f9', padding: '3rem 2rem' },
        faq: { backgroundColor: '#ffffff', padding: '3rem 2rem' },
        contact: { backgroundColor: '#1e293b', color: 'white', padding: '3rem 2rem' }
      },
      "Healthcare": {
        hero: { background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', padding: '4rem 2rem' },
        about: { backgroundColor: '#f0f9ff', padding: '3rem 2rem', textAlign: 'center' },
        services: { backgroundColor: '#ffffff', padding: '3rem 2rem' },
        testimonials: { backgroundColor: '#ecfdf5', padding: '3rem 2rem' },
        faq: { backgroundColor: '#ffffff', padding: '3rem 2rem' },
        contact: { backgroundColor: '#0369a1', color: 'white', padding: '3rem 2rem' }
      }
    } as any;

    return styleMap[industry as keyof typeof styleMap]?.[section] || {
      backgroundColor: '#ffffff',
      padding: '3rem 2rem',
      textAlign: 'center'
    };
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setFeatures(prev => ({ ...prev, [feature]: checked }));
  };

  const handleGenerate = async () => {
    if (!checkUpgrade("AI Template Generator", true)) {
      return;
    }

    if (!businessName.trim() || !businessDescription.trim() || !industry) {
      toast.error("Please fill in the business name, description, and select an industry");
      return;
    }

    setIsGenerating(true);
    
    try {
      toast.success("Generating your advanced custom template...", {
        duration: 4000,
      });

      await new Promise(resolve => setTimeout(resolve, 3000));

      const formData = {
        businessName,
        businessDescription,
        industry,
        targetAudience,
        designStyle,
        colorScheme,
        features,
        tone
      };

      const templateContent = generateAdvancedTemplate(formData);
      
      const templateData = {
        name: `${businessName} Professional Template`,
        description: `Advanced AI-generated template for ${businessName} - ${industry} industry with ${designStyle.toLowerCase()} design`,
        image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1470&auto=format&fit=crop",
        category: industry,
        is_premium: true,
        is_ai_generated: true,
        is_active: true,
        metadata: {
          businessName,
          businessDescription,
          industry,
          targetAudience,
          designStyle,
          colorScheme,
          features,
          tone,
          generatedAt: new Date().toISOString(),
          version: "2.0"
        },
        template_data: {
          content: templateContent,
          settings: {
            title: businessName,
            description: businessDescription,
            favicon: '',
            customCSS: generateCustomCSS(designStyle, colorScheme)
          }
        }
      };

      const result = await saveTemplate(templateData);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      const generatedTemplate = {
        id: result.data.id,
        name: templateData.name,
        description: templateData.description,
        image: templateData.image_url,
        isPremium: true,
        isAIGenerated: true,
        metadata: templateData.metadata,
        templateData: templateData.template_data
      };

      onTemplateGenerated(generatedTemplate);
      toast.success("Advanced template generated and saved successfully!");
      
    } catch (error) {
      console.error("Error generating template:", error);
      toast.error("Failed to generate template. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCustomCSS = (designStyle: string, colorScheme: string) => {
    // Generate basic CSS based on style preferences
    return `
      :root {
        --primary-color: #3b82f6;
        --secondary-color: #8b5cf6;
        --accent-color: #06b6d4;
      }
      
      .hero-section {
        min-height: 70vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .section {
        padding: 3rem 1rem;
      }
    `;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Wand2 className="h-6 w-6 text-white" />
          </div>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Crown className="h-3 w-3 mr-1" />
            Advanced AI Generator
          </Badge>
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Advanced AI Template Generator
        </CardTitle>
        <p className="text-gray-600">
          Create sophisticated, industry-specific templates with advanced customization
        </p>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Business Name *
              </label>
              <Input
                placeholder="e.g., TechStart Solutions"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                disabled={isGenerating}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Industry *
              </label>
              <Select value={industry} onValueChange={setIndustry} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (
                    <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Business Description *
            </label>
            <Textarea
              placeholder="Describe your business, what you do, and what makes you unique..."
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              rows={3}
              disabled={isGenerating}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Target Audience
            </label>
            <Input
              placeholder="e.g., Small business owners, Tech professionals, Health-conscious individuals"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              disabled={isGenerating}
            />
          </div>
        </div>

        {/* Design Preferences */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Design Preferences
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Design Style
              </label>
              <Select value={designStyle} onValueChange={setDesignStyle} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose design style" />
                </SelectTrigger>
                <SelectContent>
                  {designStyles.map((style) => (
                    <SelectItem key={style} value={style}>{style}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Color Scheme
              </label>
              <Select value={colorScheme} onValueChange={setColorScheme} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue placeholder="Select color palette" />
                </SelectTrigger>
                <SelectContent>
                  {colorSchemes.map((scheme) => (
                    <SelectItem key={scheme} value={scheme}>{scheme}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Brand Tone
            </label>
            <Select value={tone} onValueChange={setTone} disabled={isGenerating}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your brand tone" />
              </SelectTrigger>
              <SelectContent>
                {tones.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Features Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Features & Sections
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(features).map(([feature, checked]) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={feature}
                  checked={checked}
                  onCheckedChange={(checked) => handleFeatureChange(feature, !!checked)}
                  disabled={isGenerating}
                />
                <Label htmlFor={feature} className="text-sm capitalize">
                  {feature.replace(/([A-Z])/g, ' $1').trim()}
                </Label>
              </div>
            ))}
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
            disabled={isGenerating || !businessName.trim() || !businessDescription.trim() || !industry}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Advanced Template...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Advanced Template
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
              Upgrade to Professional plan to unlock advanced AI-powered template generation with industry-specific customization.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AITemplateGenerator;
