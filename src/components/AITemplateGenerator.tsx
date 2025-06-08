
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wand2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "@/lib/uuid";

interface AITemplateGeneratorProps {
  onTemplateGenerated: (template: any) => void;
  onClose?: () => void;
}

const AITemplateGenerator: React.FC<AITemplateGeneratorProps> = ({ 
  onTemplateGenerated, 
  onClose 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [keyServices, setKeyServices] = useState("");
  const [brandPersonality, setBrandPersonality] = useState("");
  const [preferredColors, setPreferredColors] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  const businessTypes = [
    "Restaurant / Food Service",
    "Retail Store",
    "Professional Services",
    "Healthcare / Medical",
    "Technology / Software",
    "Real Estate",
    "Education / Training",
    "Fitness / Wellness",
    "Beauty / Salon",
    "Consulting",
    "E-commerce",
    "Manufacturing",
    "Non-profit",
    "Other"
  ];

  const generateBusinessContent = () => {
    // Create highly tailored content based on business type and details
    const contentMap: Record<string, any> = {
      "Restaurant / Food Service": {
        heroTitle: `Welcome to ${businessName}`,
        heroSubtitle: `Experience exceptional ${businessDescription || 'dining'} in the heart of the city`,
        services: [
          { title: "Fresh Ingredients", description: "Locally sourced, seasonal ingredients prepared daily" },
          { title: "Expert Chefs", description: "Award-winning culinary team with years of experience" },
          { title: "Atmosphere", description: "Perfect ambiance for any occasion" }
        ],
        ctaText: "Reserve Your Table",
        aboutText: `${businessName} has been serving ${targetAudience || 'our community'} with exceptional ${businessDescription || 'cuisine'} since our founding. Our passionate team is dedicated to creating memorable dining experiences.`,
        testimonials: [
          { text: "The food at ${businessName} is absolutely incredible. Every dish is a masterpiece!", author: "Sarah M." },
          { text: "Best dining experience in town. The service is impeccable and the atmosphere is perfect.", author: "David L." }
        ]
      },
      "Professional Services": {
        heroTitle: `${businessName} - ${businessDescription || 'Professional Excellence'}`,
        heroSubtitle: `Trusted ${keyServices || 'professional services'} for ${targetAudience || 'businesses and individuals'}`,
        services: keyServices.split(',').map(service => ({
          title: service.trim(),
          description: `Expert ${service.trim().toLowerCase()} tailored to your specific needs`
        })),
        ctaText: "Schedule Consultation",
        aboutText: `${businessName} provides comprehensive ${businessDescription || 'professional services'} to ${targetAudience || 'our clients'}. With years of experience and a commitment to excellence, we deliver results that exceed expectations.`,
        testimonials: [
          { text: `${businessName} exceeded our expectations. Their expertise made all the difference.`, author: "Jennifer R." },
          { text: "Professional, reliable, and results-driven. Highly recommended!", author: "Michael K." }
        ]
      },
      "E-commerce": {
        heroTitle: `Shop Premium Products at ${businessName}`,
        heroSubtitle: `Discover our curated collection of ${businessDescription || 'quality products'} for ${targetAudience || 'every lifestyle'}`,
        services: [
          { title: "Quality Products", description: "Carefully selected items that meet our high standards" },
          { title: "Fast Shipping", description: "Quick and reliable delivery to your doorstep" },
          { title: "Customer Support", description: "Dedicated team ready to help with any questions" }
        ],
        ctaText: "Shop Now",
        aboutText: `${businessName} is your destination for ${businessDescription || 'premium products'}. We specialize in serving ${targetAudience || 'customers'} with carefully curated selections and exceptional service.`,
        testimonials: [
          { text: "Love shopping at ${businessName}! The quality is outstanding and shipping is super fast.", author: "Emily T." },
          { text: "Great products and even better customer service. Will definitely order again!", author: "James H." }
        ]
      }
    };

    const defaultContent = {
      heroTitle: `Welcome to ${businessName}`,
      heroSubtitle: businessDescription || `Your trusted partner for ${keyServices || 'quality services'}`,
      services: keyServices ? keyServices.split(',').map(service => ({
        title: service.trim(),
        description: `Professional ${service.trim().toLowerCase()} delivered with excellence`
      })) : [
        { title: "Quality Service", description: "Exceptional service tailored to your needs" },
        { title: "Expert Team", description: "Experienced professionals dedicated to your success" },
        { title: "Customer Focus", description: "Your satisfaction is our top priority" }
      ],
      ctaText: "Get Started",
      aboutText: `${businessName} is dedicated to providing exceptional ${businessDescription || 'services'} to ${targetAudience || 'our clients'}. Our team combines expertise with personalized attention to deliver outstanding results.`,
      testimonials: [
        { text: `Working with ${businessName} was a game-changer for our business. Highly professional!`, author: "Alex P." },
        { text: "Exceptional service and attention to detail. Would definitely recommend!", author: "Maria S." }
      ]
    };

    return contentMap[businessType] || defaultContent;
  };

  const handleGenerate = async () => {
    if (!businessName.trim()) {
      toast.error("Please enter your business name");
      return;
    }

    if (!businessType) {
      toast.error("Please select your business type");
      return;
    }

    setIsGenerating(true);

    try {
      // Generate tailored content based on inputs
      const content = generateBusinessContent();
      
      // Create elements with actual business-specific content
      const elements = [
        {
          id: uuidv4(),
          type: "navbar",
          props: {
            siteName: businessName,
            links: [
              { text: "Home", url: "#" },
              { text: "About", url: "#about" },
              { text: "Services", url: "#services" },
              { text: "Contact", url: "#contact" }
            ],
            variant: "default",
            showCartButton: businessType.includes("E-commerce") || businessType.includes("Retail")
          }
        },
        {
          id: uuidv4(),
          type: "hero",
          props: {
            title: content.heroTitle,
            subtitle: content.heroSubtitle,
            ctaText: content.ctaText,
            ctaUrl: "#contact",
            backgroundImage: "",
            variant: "gradient",
            alignment: "center"
          }
        },
        {
          id: uuidv4(),
          type: "section",
          props: {
            title: "About Us",
            id: "about",
            padding: "large",
            backgroundColor: "white"
          },
          children: [
            {
              id: uuidv4(),
              type: "text",
              content: content.aboutText
            }
          ]
        },
        {
          id: uuidv4(),
          type: "section",
          props: {
            title: keyServices ? "Our Services" : "Why Choose Us",
            id: "services",
            padding: "large",
            backgroundColor: "gray-50"
          },
          children: content.services.map((service: any) => ({
            id: uuidv4(),
            type: "feature",
            props: {
              title: service.title,
              description: service.description,
              icon: "star"
            }
          }))
        },
        {
          id: uuidv4(),
          type: "section",
          props: {
            title: "What Our Clients Say",
            padding: "large",
            backgroundColor: "white"
          },
          children: content.testimonials.map((testimonial: any) => ({
            id: uuidv4(),
            type: "testimonial",
            props: {
              text: testimonial.text.replace('${businessName}', businessName),
              author: testimonial.author,
              rating: 5
            }
          }))
        },
        {
          id: uuidv4(),
          type: "section",
          props: {
            title: "Get In Touch",
            id: "contact",
            padding: "large",
            backgroundColor: "gray-50"
          },
          children: [
            {
              id: uuidv4(),
              type: "text",
              content: contactInfo || `Ready to get started with ${businessName}? Contact us today to learn more about how we can help you achieve your goals.`
            },
            {
              id: uuidv4(),
              type: "button",
              props: {
                text: "Contact Us",
                variant: "primary",
                size: "large"
              }
            }
          ]
        },
        {
          id: uuidv4(),
          type: "footer",
          props: {
            companyName: businessName,
            description: businessDescription || `Your trusted partner for quality services`,
            links: [
              { text: "Privacy Policy", url: "#" },
              { text: "Terms of Service", url: "#" },
              { text: "Contact", url: "#contact" }
            ],
            socialLinks: [
              { platform: "facebook", url: "#" },
              { platform: "twitter", url: "#" },
              { platform: "linkedin", url: "#" }
            ]
          }
        }
      ];

      const generatedTemplate = {
        name: `${businessName} Website`,
        elements: elements,
        templateData: {
          content: elements
        }
      };

      console.log("Generated tailored template:", generatedTemplate);
      
      onTemplateGenerated(generatedTemplate);
      toast.success(`Custom website generated for ${businessName}!`);
      
    } catch (error) {
      console.error("Error generating template:", error);
      toast.error("Failed to generate template. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-3">AI Website Generator</h2>
        <p className="text-gray-600 text-lg">Tell us about your business and we'll create a tailored website for you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g., Sunrise Cafe"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="businessType">Business Type *</Label>
              <select
                id="businessType"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select your business type</option>
                {businessTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="businessDescription">Business Description</Label>
              <Textarea
                id="businessDescription"
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                placeholder="Describe what your business does..."
                className="mt-2"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input
                id="targetAudience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g., families, professionals, students"
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="keyServices">Key Services/Products</Label>
              <Input
                id="keyServices"
                value={keyServices}
                onChange={(e) => setKeyServices(e.target.value)}
                placeholder="e.g., Web Design, SEO, Consulting"
                className="mt-2"
              />
              <p className="text-sm text-gray-500 mt-1">Separate multiple items with commas</p>
            </div>

            <div>
              <Label htmlFor="brandPersonality">Brand Personality</Label>
              <Input
                id="brandPersonality"
                value={brandPersonality}
                onChange={(e) => setBrandPersonality(e.target.value)}
                placeholder="e.g., friendly, professional, innovative"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="preferredColors">Preferred Colors</Label>
              <Input
                id="preferredColors"
                value={preferredColors}
                onChange={(e) => setPreferredColors(e.target.value)}
                placeholder="e.g., blue, green, modern"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="contactInfo">Contact Information</Label>
              <Textarea
                id="contactInfo"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="Include phone, email, address, or any special contact details..."
                className="mt-2"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center gap-4 pt-6 border-t">
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating || !businessName.trim() || !businessType}
          className="px-8"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Your Website...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4 mr-2" />
              Generate Tailored Website
            </>
          )}
        </Button>
      </div>

      {isGenerating && (
        <div className="text-center text-gray-600">
          <p>Creating a custom website based on your business details...</p>
          <p className="text-sm mt-2">This will include tailored content, appropriate sections, and business-specific features.</p>
        </div>
      )}
    </div>
  );
};

export default AITemplateGenerator;
