
import { useState, useEffect } from "react";
import TemplateSelection from "./TemplateSelection";
import BuilderTutorial from "./BuilderTutorial";
import { toast } from "sonner";

interface OnboardingFlowProps {
  websiteId: string;
  onComplete: () => void;
}

enum OnboardingStep {
  TEMPLATES,
  TUTORIAL
}

const OnboardingFlow = ({ websiteId, onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.TEMPLATES);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  
  // Initialize loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingComplete(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle smooth transition between steps
  const handleTemplateComplete = () => {
    setIsTransitioning(true);
    
    // Add a longer delay to ensure smooth transition and proper loading
    toast.success("Template selected! Loading tutorial...");
    
    setTimeout(() => {
      setCurrentStep(OnboardingStep.TUTORIAL);
      // Add another short delay before removing the transition screen
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 800);
  };
  
  // Handle completion with smooth transition to builder
  const handleTutorialComplete = () => {
    setIsTransitioning(true);
    
    // Show toast for better UX
    toast.success("Onboarding complete! Loading builder...");
    
    // Add a longer delay before triggering onComplete
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  // Show initial loading indicator
  if (!isLoadingComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-indigo-600 border-r-indigo-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading onboarding experience...</p>
        </div>
      </div>
    );
  }

  // Show loading indicator during transitions
  if (isTransitioning) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-indigo-600 border-r-indigo-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading next step...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentStep === OnboardingStep.TEMPLATES && (
        <TemplateSelection 
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
  );
};

export default OnboardingFlow;
