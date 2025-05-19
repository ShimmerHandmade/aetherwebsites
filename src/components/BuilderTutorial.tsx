
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// Tutorial steps
const tutorialSteps = [
  {
    title: "Welcome to the builder",
    description: "Let's walk through how to build your website step by step.",
    image: "/tutorial/welcome.png",
    fallbackImage: "/lovable-uploads/c2c54c16-7e32-4056-82d5-62bc1abfa1a0.png"
  },
  {
    title: "Add Elements",
    description: "Drag and drop elements from the left sidebar onto your page to build your layout.",
    image: "/tutorial/elements.png",
    fallbackImage: "/lovable-uploads/90c55252-fdd4-4bc8-af96-0bd1592aff3f.png"
  },
  {
    title: "Edit Properties",
    description: "Click on any element to edit its properties in the right sidebar.",
    image: "/tutorial/properties.png",
    fallbackImage: "/lovable-uploads/42b74c45-537a-4595-82fd-841da999757c.png"
  },
  {
    title: "Manage Pages",
    description: "Create and manage multiple pages for your website from the Pages tab.",
    image: "/tutorial/pages.png",
    fallbackImage: "/lovable-uploads/8651b24a-ac81-4797-b125-7a5f9976aaf2.png"
  },
  {
    title: "Add Products",
    description: "Add and manage your products from the Products tab in the builder.",
    image: "/tutorial/products.png",
    fallbackImage: "/lovable-uploads/9117d25c-a891-453e-9e57-2a7a2452fec2.png"
  },
  {
    title: "Save and Publish",
    description: "When you're ready, save your changes and publish your site to make it live.",
    image: "/tutorial/publish.png",
    fallbackImage: "/lovable-uploads/a71dcd29-4d11-4f44-b0c7-9b3cb7b4f21f.png"
  }
];

interface BuilderTutorialProps {
  websiteId: string;
  onComplete: () => void;
}

const BuilderTutorial = ({ websiteId, onComplete }: BuilderTutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const goToNextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete();
    // Redirect to the builder
    navigate(`/builder/${websiteId}`);
  };

  const currentTutorial = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
        <button 
          onClick={handleComplete} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close tutorial"
        >
          <X size={20} />
        </button>
        
        <div className="h-2 bg-gray-100">
          <div 
            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all"
            style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
          ></div>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">{currentTutorial.title}</h2>
          <p className="text-gray-600 mb-6">{currentTutorial.description}</p>
          
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-6">
            <img
              src={currentTutorial.fallbackImage} 
              alt={currentTutorial.title}
              className="w-full h-full object-contain border border-gray-200"
              onError={(e) => {
                // If even the fallback fails, use placeholder
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
          </div>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={goToPrevStep}
              disabled={currentStep === 0}
              className={currentStep === 0 ? 'invisible' : ''}
            >
              <ChevronLeft size={16} className="mr-1" /> Previous
            </Button>
            
            <Button 
              onClick={goToNextStep}
              className="bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              {isLastStep ? 'Get Started' : 'Next'} {!isLastStep && <ChevronRight size={16} className="ml-1" />}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-4">
        <button 
          onClick={handleComplete}
          className="text-gray-500 text-sm hover:text-indigo-600"
        >
          Skip tutorial
        </button>
      </div>
    </div>
  );
};

export default BuilderTutorial;
