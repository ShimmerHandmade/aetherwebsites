
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

// Type for saving to database (matches Supabase schema)
interface TemplateInsert {
  name: string;
  description?: string;
  image_url?: string;
  category?: string;
  is_premium: boolean;
  is_ai_generated: boolean;
  is_active: boolean;
  metadata?: any;
  template_data: any; // Json type for database
}

export const saveTemplate = async (template: Omit<Template, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    // Convert template to database format
    const templateInsert: TemplateInsert = {
      name: template.name,
      description: template.description,
      image_url: template.image_url,
      category: template.category,
      is_premium: template.is_premium,
      is_ai_generated: template.is_ai_generated,
      is_active: template.is_active,
      metadata: template.metadata,
      template_data: template.template_data as any, // Cast to Json for database
    };

    const { data, error } = await supabase
      .from('templates')
      .insert([templateInsert])
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

    // Cast database response to Template type
    const templates = (data || []).map(item => ({
      ...item,
      template_data: item.template_data as Template['template_data']
    })) as Template[];

    return { success: true, data: templates };
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

    // Cast database response to Template type
    const template = {
      ...data,
      template_data: data.template_data as Template['template_data']
    } as Template;

    return { success: true, data: template };
  } catch (error: any) {
    console.error('Error in getTemplateById:', error);
    return { success: false, error: error.message };
  }
};
