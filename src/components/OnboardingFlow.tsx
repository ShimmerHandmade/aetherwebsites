
import { useState, useEffect } from "react";
import TemplateSelection from "./TemplateSelection";
import BuilderTutorial from "./BuilderTutorial";
import { toast } from "sonner";
import { useWebsite } from "@/hooks/useWebsite";
import { useNavigate } from "react-router-dom";

interface OnboardingFlowProps {
  websiteId: string;
  onComplete: (templateData?: any) => void;
}

enum OnboardingStep {
  TEMPLATES,
  TUTORIAL
}

const OnboardingFlow = ({ websiteId, onComplete }: OnboardingFlowProps) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.TEMPLATES);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading onboarding experience...");
  
  // Use the website hook to save template data
  const {
    updateElements,
    saveWebsite,
  } = useWebsite(websiteId, navigate, { autoSave: false });
  
  // Initialize loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingComplete(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle template selection - apply and save immediately
  const handleTemplateSelect = async (templateData: any) => {
    console.log("🎨 OnboardingFlow: Template selected, applying and saving:", templateData);
    
    setIsTransitioning(true);
    setLoadingMessage("Applying and saving template...");
    
    try {
      // Apply template to the website
      updateElements(templateData);
      
      // Save the template to the website
      const saveSuccess = await saveWebsite(templateData);
      
      if (saveSuccess) {
        console.log("✅ OnboardingFlow: Template saved successfully");
        toast.success("Template applied and saved!");
        
        // Complete onboarding and return to dashboard
        setTimeout(() => {
          onComplete();
        }, 1000);
      } else {
        throw new Error("Failed to save template");
      }
    } catch (error) {
      console.error("❌ OnboardingFlow: Error saving template:", error);
      toast.error("Failed to save template. Please try again.");
      setIsTransitioning(false);
    }
  };
  
  // Handle skip template - save empty state and complete
  const handleSkipTemplate = async () => {
    console.log("📝 OnboardingFlow: Skipping template, going to tutorial");
    setIsTransitioning(true);
    setLoadingMessage("Preparing tutorial...");
    
    try {
      // Save empty state
      const saveSuccess = await saveWebsite([]);
      
      if (saveSuccess) {
        setTimeout(() => {
          setCurrentStep(OnboardingStep.TUTORIAL);
          setTimeout(() => {
            setIsTransitioning(false);
          }, 500);
        }, 1000);
      } else {
        throw new Error("Failed to save empty state");
      }
    } catch (error) {
      console.error("❌ OnboardingFlow: Error saving empty state:", error);
      toast.error("Failed to initialize. Please try again.");
      setIsTransitioning(false);
    }
  };
  
  // Handle tutorial completion
  const handleTutorialComplete = async () => {
    console.log("🎓 OnboardingFlow: Tutorial complete, finishing onboarding");
    setIsTransitioning(true);
    setLoadingMessage("Completing setup...");
    
    try {
      // Ensure empty state is saved if no template was applied
      const saveSuccess = await saveWebsite([]);
      
      if (saveSuccess) {
        toast.success("Tutorial complete! Your website is ready!");
        
        setTimeout(() => {
          onComplete();
        }, 1000);
      } else {
        throw new Error("Failed to finalize setup");
      }
    } catch (error) {
      console.error("❌ OnboardingFlow: Error completing tutorial:", error);
      toast.error("Failed to complete setup. Please try again.");
      setIsTransitioning(false);
    }
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
            onComplete={() => {}} // Not used anymore
            onClose={handleSkipTemplate}
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
