
import { useState, useEffect, useCallback } from "react";
import { BuilderElement, PageSettings } from "@/contexts/builder/types";

interface UseBuilderSaveProps {
  saveWebsite: (elements?: BuilderElement[], pageSettings?: PageSettings) => Promise<boolean>;
  lastSaved: Date | null;
  unsavedChanges: boolean;
}

export const useBuilderSave = ({
  saveWebsite,
  lastSaved,
  unsavedChanges
}: UseBuilderSaveProps) => {
  const [saveStatus, setSaveStatus] = useState<string>('');

  useEffect(() => {
    if (lastSaved) {
      setSaveStatus(`Last saved ${lastSaved.toLocaleTimeString()}`);
    } else {
      setSaveStatus('');
    }
  }, [lastSaved]);

  useEffect(() => {
    if (unsavedChanges) {
      setSaveStatus("Unsaved changes");
    }
  }, [unsavedChanges]);

  const handleSave = useCallback(async () => {
    const success = await saveWebsite();
    if (success) {
      setSaveStatus(`Last saved ${new Date().toLocaleTimeString()}`);
    }
    return success;
  }, [saveWebsite]);

  const handleBuilderSave = useCallback(async (elements: BuilderElement[], pageSettings: PageSettings) => {
    console.log("💾 Saving from builder with elements:", elements?.length || 0);
    const success = await saveWebsite(elements, pageSettings);
    return success;
  }, [saveWebsite]);

  return {
    saveStatus,
    handleSave,
    handleBuilderSave
  };
};
