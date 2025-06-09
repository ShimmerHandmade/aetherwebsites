
import { useState, useEffect } from "react";
import TemplateSelection from "./TemplateSelection";
import BuilderTutorial from "./BuilderTutorial";
import { toast } from "sonner";

interface OnboardingFlowProps {
  websiteId: string;
  onComplete: (templateData?: any) => void;
}

enum OnboardingStep {
  TEMPLATES,
  TUTORIAL
}

const OnboardingFlow = ({ websiteId, onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.TEMPLATES);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading onboarding experience...");
  const [selectedTemplateData, setSelectedTemplateData] = useState<any>(null);
  
  // Initialize loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingComplete(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle smooth transition between steps
  const handleTemplateComplete = () => {
    setIsTransitioning(true);
    setLoadingMessage("Preparing tutorial...");
    
    toast.success("Template selected! Loading tutorial...");
    
    setTimeout(() => {
      setCurrentStep(OnboardingStep.TUTORIAL);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    }, 1500);
  };
  
  // Handle completion - now passes the template data back
  const handleTutorialComplete = () => {
    setIsTransitioning(true);
    setLoadingMessage("Preparing your site builder...");
    
    toast.success("Onboarding complete! Loading builder...");
    
    setTimeout(() => {
      console.log("🎓 OnboardingFlow: Tutorial complete, applying template:", selectedTemplateData);
      onComplete(selectedTemplateData);
    }, 1500);
  };

  const handleTemplateSelect = (templateData: any) => {
    console.log("🎨 OnboardingFlow: Template selected, storing for after tutorial:", templateData);
    setSelectedTemplateData(templateData);
    handleTemplateComplete();
  };

  // Show loading indicator
  if (!isLoadingComplete || isTransitioning) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-indigo-600 border-r-indigo-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {currentStep === OnboardingStep.TEMPLATES && (
          <TemplateSelection 
            onSelectTemplate={handleTemplateSelect}
            websiteId={websiteId} 
            onComplete={handleTemplateComplete} 
          />
        )}
        
        {currentStep === OnboardingStep.TUTORIAL && (
          <BuilderTutorial 
            websiteId={websiteId} 
            onComplete={handleTutorialComplete} 
          />
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;
