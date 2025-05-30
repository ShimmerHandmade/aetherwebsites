
import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface SaveManagerOptions {
  onSave?: () => Promise<boolean>;
  autoSaveInterval?: number;
  showSuccessToast?: boolean;
}

export function useSaveManager(options: SaveManagerOptions = {}) {
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<number | null>(null);

  const markAsUnsaved = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  const save = useCallback(async () => {
    if (isSaving || !options.onSave) return false;

    setIsSaving(true);
    try {
      const success = await options.onSave();
      if (success) {
        setHasUnsavedChanges(false);
        setLastSaved(new Date());
        if (options.showSuccessToast !== false) {
          toast.success('Changes saved successfully');
        }
      } else {
        toast.error('Failed to save changes');
      }
      return success;
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save changes');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, options]);

  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = window.setTimeout(() => {
      save();
    }, 1000);
  }, [save]);

  const getSaveStatus = useCallback(() => {
    if (isSaving) return 'Saving...';
    if (hasUnsavedChanges) return 'Unsaved changes';
    if (lastSaved) {
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);
      
      if (diffInSeconds < 60) {
        return `Saved ${diffInSeconds} seconds ago`;
      } else {
        return `Saved at ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
    }
    return '';
  }, [isSaving, hasUnsavedChanges, lastSaved]);

  return {
    isSaving,
    hasUnsavedChanges,
    lastSaved,
    save,
    debouncedSave,
    markAsUnsaved,
    getSaveStatus
  };
}
