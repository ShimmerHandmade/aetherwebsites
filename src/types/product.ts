
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  sku: string | null;
  stock: number | null;
  user_id?: string;
  website_id?: string;
  category?: string | null;
  is_featured?: boolean;
  is_sale?: boolean;
  is_new?: boolean;
  image_url?: string | null;
}

export interface UniqueCategory {
  name: string;
}
