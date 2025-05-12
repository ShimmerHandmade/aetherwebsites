
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// Tutorial steps
const tutorialSteps = [
  {
    title: "Welcome to the builder",
    description: "Let's walk through how to build your website step by step.",
    image: "/tutorial/welcome.png"
  },
  {
    title: "Add Elements",
    description: "Drag and drop elements from the left sidebar onto your page to build your layout.",
    image: "/tutorial/elements.png"
  },
  {
    title: "Edit Properties",
    description: "Click on any element to edit its properties in the right sidebar.",
    image: "/tutorial/properties.png"
  },
  {
    title: "Manage Pages",
    description: "Create and manage multiple pages for your website from the Pages tab.",
    image: "/tutorial/pages.png"
  },
  {
    title: "Add Products",
    description: "Add and manage your products from the Products tab in the builder.",
    image: "/tutorial/products.png"
  },
  {
    title: "Publish Your Site",
    description: "When you're ready, publish your site to make it live and accessible to everyone.",
    image: "/tutorial/publish.png"
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
              src={currentTutorial.image}
              alt={currentTutorial.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if image doesn't load
                e.currentTarget.src = "/placeholder.svg";
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
