
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Updates a website with the selected template
 */
export const updateWebsiteTemplate = async (
  websiteId: string, 
  template: string
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const { error } = await supabase
      .from("websites")
      .update({ template })
      .eq("id", websiteId);
    
    if (error) {
      console.error("Error updating website template:", error);
      return {
        success: false,
        error: "Failed to update website template"
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error in updateWebsiteTemplate:", error);
    return {
      success: false,
      error: "An unexpected error occurred"
    };
  }
};
