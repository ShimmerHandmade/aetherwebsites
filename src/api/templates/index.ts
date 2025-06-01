
import { supabase } from "@/integrations/supabase/client";
import { BuilderElement, PageSettings } from "@/contexts/builder/types";

export interface Template {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  category?: string;
  is_premium: boolean;
  is_ai_generated: boolean;
  is_active: boolean;
  metadata: any;
  template_data: {
    content: BuilderElement[];
    settings: PageSettings;
  };
  created_at: string;
  updated_at: string;
}

export const saveTemplate = async (template: Omit<Template, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('templates')
      .insert([template])
      .select()
      .single();

    if (error) {
      console.error('Error saving template:', error);
      throw new Error(`Failed to save template: ${error.message}`);
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Error in saveTemplate:', error);
    return { success: false, error: error.message };
  }
};

export const getTemplates = async (includeInactive = false) => {
  try {
    let query = supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching templates:', error);
      throw new Error(`Failed to fetch templates: ${error.message}`);
    }

    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error('Error in getTemplates:', error);
    return { success: false, error: error.message };
  }
};

export const saveTemplateWebsite = async (websiteId: string, templateId: string) => {
  try {
    const { data, error } = await supabase
      .from('template_websites')
      .insert([{
        website_id: websiteId,
        template_id: templateId
      }])
      .select()
      .single();

    if (error) {
      console.error('Error linking template to website:', error);
      throw new Error(`Failed to link template: ${error.message}`);
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Error in saveTemplateWebsite:', error);
    return { success: false, error: error.message };
  }
};

export const getTemplateById = async (templateId: string) => {
  try {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (error) {
      console.error('Error fetching template:', error);
      throw new Error(`Failed to fetch template: ${error.message}`);
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Error in getTemplateById:', error);
    return { success: false, error: error.message };
  }
};
