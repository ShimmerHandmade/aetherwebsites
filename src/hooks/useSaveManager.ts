
import { useState, useCallback } from "react";
import { toast } from "sonner";

export interface SaveManagerOptions {
  onSave?: () => Promise<boolean>;
  autoSave?: boolean;
  autoSaveInterval?: number;
}

export const useSaveManager = (options: SaveManagerOptions = {}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const markAsChanged = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  const save = useCallback(async () => {
    if (!options.onSave) {
      console.warn("No save function provided to useSaveManager");
      return false;
    }

    try {
      setIsSaving(true);
      const success = await options.onSave();
      
      if (success) {
        setHasUnsavedChanges(false);
        setLastSaved(new Date());
        toast.success("Changes saved successfully");
      } else {
        toast.error("Failed to save changes");
      }
      
      return success;
    } catch (error) {
      console.error("Save error:", error);
      toast.error("An error occurred while saving");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [options.onSave]);

  const getSaveStatus = useCallback(() => {
    if (isSaving) return "Saving...";
    if (hasUnsavedChanges) return "Unsaved changes";
    if (lastSaved) {
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);
      
      if (diffInSeconds < 60) {
        return `Saved ${diffInSeconds} seconds ago`;
      } else {
        return `Saved at ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
    }
    return "";
  }, [isSaving, hasUnsavedChanges, lastSaved]);

  return {
    isSaving,
    hasUnsavedChanges,
    lastSaved,
    markAsChanged,
    save,
    getSaveStatus
  };
};
