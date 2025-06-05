
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
  const [loadingMessage, setLoadingMessage] = useState("Loading onboarding experience...");
  
  // Initialize loading state with a guaranteed minimum time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingComplete(true);
    }, 600); // Slightly longer initial load for smoother experience
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle smooth transition between steps with visual feedback
  const handleTemplateComplete = () => {
    setIsTransitioning(true);
    setLoadingMessage("Preparing tutorial...");
    
    // Add a longer delay to ensure smooth transition and proper loading
    toast.success("Template selected! Loading tutorial...");
    
    // Use a series of timed transitions
    setTimeout(() => {
      setLoadingMessage("Loading tutorial content...");
      
      // Add another delay before showing the next step
      setTimeout(() => {
        setCurrentStep(OnboardingStep.TUTORIAL);
        // Add another short delay before removing the transition screen
        setTimeout(() => {
          setIsTransitioning(false);
        }, 500);
      }, 800);
    }, 1000);
  };
  
  // Handle completion with smooth transition to builder
  const handleTutorialComplete = () => {
    setIsTransitioning(true);
    setLoadingMessage("Preparing your site builder...");
    
    // Show toast for better UX
    toast.success("Onboarding complete! Loading builder...");
    
    // Use a series of timed transitions
    setTimeout(() => {
      setLoadingMessage("Setting up your workspace...");
      
      // Add a longer delay before triggering onComplete
      setTimeout(() => {
        setLoadingMessage("Almost ready...");
        
        // Final delay before transition
        setTimeout(() => {
          onComplete();
        }, 800);
      }, 1000);
    }, 800);
  };

  const handleTemplateSelect = (templateData: any) => {
    console.log("Template selected in onboarding:", templateData);
    // Handle template selection logic here if needed
    // For now, just proceed to next step
    handleTemplateComplete();
  };

  // Show initial loading indicator with animated appearance
  if (!isLoadingComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center animate-in fade-in duration-500">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-indigo-600 border-r-indigo-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  // Show loading indicator during transitions with animated messaging
  if (isTransitioning) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center animate-in fade-in duration-300">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-indigo-600 border-r-indigo-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">{loadingMessage}</p>
          <p className="text-gray-400 text-sm mt-2">This will just take a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-in fade-in duration-300">
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
  );
};

export default OnboardingFlow;
