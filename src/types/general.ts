
// Profile types
export interface Profile {
  id: string;
  full_name?: string;
  email: string;
  avatar_url?: string;
  stripe_customer_id?: string;
  subscription_status?: string;
  subscription_id?: string;
  subscription_type?: string;
  is_subscribed?: boolean;
  plan_id?: string;
  subscription_start?: string;
  subscription_end?: string;
  updated_at: string;
  created_at: string;
}

// Website types
export interface Website {
  id: string;
  name: string;
  owner_id: string;
  template?: string;
  published?: boolean;
  domain?: string;
  content: any;
  settings: any;
  created_at: string;
  updated_at: string;
}

// Shipping types
export interface WeightBasedRate {
  min: number;
  max: number;
  rate: number;
  min_weight?: number; // Added for backward compatibility
  max_weight?: number; // Added for backward compatibility
}

export interface ShippingSettings {
  id?: string;
  website_id?: string;
  flat_rate_enabled: boolean;
  flat_rate_amount: number;
  weight_based_enabled: boolean;
  weight_based_rates: WeightBasedRate[];
  free_shipping_enabled: boolean;
  free_shipping_minimum: number;
  created_at?: string;
  updated_at?: string;
}

// Auth component props
export interface AuthCardProps {
  children: React.ReactNode;
}

export interface LoginFormProps {
  onToggleMode: () => void;
}

export interface SignupFormProps {
  onToggleMode: () => void;
}

// Builder props
export interface BuilderProviderProps {
  children: React.ReactNode;
  websiteId: string;
}

export interface BuilderNavbarProps {
  websiteName?: string;
  setWebsiteName?: (name: string) => void;
  onSave?: () => void;
  onPublish?: () => void;
  isPreviewMode?: boolean;
  showElementPalette?: boolean;
  toggleElementPalette?: () => void;
}

// ProductForm props
export interface ProductFormProps {
  product: any;
  onChange: (product: any) => void;
  categories: any[];
  newCategory: string;
  onNewCategoryChange: (category: string) => void;
  onAddCategory: () => void;
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearImage: () => void;
  planInfo?: {
    maxProducts: number;
    currentCount: number;
  };
  isAddingNew?: boolean;
  isSaving?: boolean;
  onSave?: () => Promise<any> | void;
  onCancel?: () => void;
}

// Dashboard props
export interface DashboardNavbarProps {
  profile: Profile | null;
}

// WebsiteCard props
export interface WebsiteCardProps {
  website: Website;
  onWebsiteUpdate: () => void;
  onWebsiteDeleted: () => Promise<void> | void;
}

// Template selection props
export interface TemplateSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  setWebsites: React.Dispatch<React.SetStateAction<Website[]>>;
}
