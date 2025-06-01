export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price_at_purchase: number
          product_id: string
          product_image_url: string | null
          product_name: string | null
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          price_at_purchase: number
          product_id: string
          product_image_url?: string | null
          product_name?: string | null
          quantity?: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price_at_purchase?: number
          product_id?: string
          product_image_url?: string | null
          product_name?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address: Json | null
          created_at: string
          id: string
          payment_info: Json | null
          shipping_address: Json | null
          shipping_cost: number | null
          shipping_method: string | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string | null
          website_id: string
        }
        Insert: {
          billing_address?: Json | null
          created_at?: string
          id?: string
          payment_info?: Json | null
          shipping_address?: Json | null
          shipping_cost?: number | null
          shipping_method?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string | null
          website_id: string
        }
        Update: {
          billing_address?: Json | null
          created_at?: string
          id?: string
          payment_info?: Json | null
          shipping_address?: Json | null
          shipping_cost?: number | null
          shipping_method?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string | null
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          annual_price: number
          description: string | null
          features: Json
          id: string
          monthly_price: number
          name: string
        }
        Insert: {
          annual_price: number
          description?: string | null
          features?: Json
          id?: string
          monthly_price: number
          name: string
        }
        Update: {
          annual_price?: number
          description?: string | null
          features?: Json
          id?: string
          monthly_price?: number
          name?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          is_new: boolean | null
          is_sale: boolean | null
          name: string
          price: number
          sku: string | null
          stock: number | null
          updated_at: string
          user_id: string
          website_id: string
          weight: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_new?: boolean | null
          is_sale?: boolean | null
          name: string
          price: number
          sku?: string | null
          stock?: number | null
          updated_at?: string
          user_id: string
          website_id: string
          weight?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_new?: boolean | null
          is_sale?: boolean | null
          name?: string
          price?: number
          sku?: string | null
          stock?: number | null
          updated_at?: string
          user_id?: string
          website_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_subscribed: boolean | null
          plan_id: string | null
          stripe_customer_id: string | null
          subscription_end: string | null
          subscription_id: string | null
          subscription_start: string | null
          subscription_status: string | null
          subscription_type: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_subscribed?: boolean | null
          plan_id?: string | null
          stripe_customer_id?: string | null
          subscription_end?: string | null
          subscription_id?: string | null
          subscription_start?: string | null
          subscription_status?: string | null
          subscription_type?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_subscribed?: boolean | null
          plan_id?: string | null
          stripe_customer_id?: string | null
          subscription_end?: string | null
          subscription_id?: string | null
          subscription_start?: string | null
          subscription_status?: string | null
          subscription_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_plan_id"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_settings: {
        Row: {
          created_at: string
          flat_rate_amount: number | null
          flat_rate_enabled: boolean
          free_shipping_enabled: boolean
          free_shipping_minimum: number | null
          id: string
          updated_at: string
          website_id: string
          weight_based_enabled: boolean
          weight_based_rates: Json | null
        }
        Insert: {
          created_at?: string
          flat_rate_amount?: number | null
          flat_rate_enabled?: boolean
          free_shipping_enabled?: boolean
          free_shipping_minimum?: number | null
          id?: string
          updated_at?: string
          website_id: string
          weight_based_enabled?: boolean
          weight_based_rates?: Json | null
        }
        Update: {
          created_at?: string
          flat_rate_amount?: number | null
          flat_rate_enabled?: boolean
          free_shipping_enabled?: boolean
          free_shipping_minimum?: number | null
          id?: string
          updated_at?: string
          website_id?: string
          weight_based_enabled?: boolean
          weight_based_rates?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "shipping_settings_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: true
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_connect_accounts: {
        Row: {
          account_details: Json | null
          account_type: string
          charges_enabled: boolean | null
          created_at: string
          details_submitted: boolean | null
          id: string
          onboarding_complete: boolean | null
          payouts_enabled: boolean | null
          stripe_account_id: string
          updated_at: string
          user_id: string
          website_id: string
        }
        Insert: {
          account_details?: Json | null
          account_type: string
          charges_enabled?: boolean | null
          created_at?: string
          details_submitted?: boolean | null
          id?: string
          onboarding_complete?: boolean | null
          payouts_enabled?: boolean | null
          stripe_account_id: string
          updated_at?: string
          user_id: string
          website_id: string
        }
        Update: {
          account_details?: Json | null
          account_type?: string
          charges_enabled?: boolean | null
          created_at?: string
          details_submitted?: boolean | null
          id?: string
          onboarding_complete?: boolean | null
          payouts_enabled?: boolean | null
          stripe_account_id?: string
          updated_at?: string
          user_id?: string
          website_id?: string
        }
        Relationships: []
      }
      subscription_history: {
        Row: {
          amount_paid: number
          created_at: string
          currency: string | null
          end_date: string | null
          id: string
          plan_id: string
          start_date: string
          status: string
          subscription_type: string
          user_id: string
        }
        Insert: {
          amount_paid: number
          created_at?: string
          currency?: string | null
          end_date?: string | null
          id?: string
          plan_id: string
          start_date?: string
          status: string
          subscription_type: string
          user_id: string
        }
        Update: {
          amount_paid?: number
          created_at?: string
          currency?: string | null
          end_date?: string | null
          id?: string
          plan_id?: string
          start_date?: string
          status?: string
          subscription_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_history_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      template_websites: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          template_id: string | null
          website_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          template_id?: string | null
          website_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          template_id?: string | null
          website_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "template_websites_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "template_websites_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_ai_generated: boolean | null
          is_premium: boolean | null
          metadata: Json | null
          name: string
          template_data: Json
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_ai_generated?: boolean | null
          is_premium?: boolean | null
          metadata?: Json | null
          name: string
          template_data: Json
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_ai_generated?: boolean | null
          is_premium?: boolean | null
          metadata?: Json | null
          name?: string
          template_data?: Json
          updated_at?: string
        }
        Relationships: []
      }
      websites: {
        Row: {
          content: Json
          created_at: string
          domain: string | null
          id: string
          name: string
          owner_id: string
          published: boolean | null
          settings: Json
          template: string | null
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          domain?: string | null
          id?: string
          name: string
          owner_id: string
          published?: boolean | null
          settings?: Json
          template?: string | null
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          domain?: string | null
          id?: string
          name?: string
          owner_id?: string
          published?: boolean | null
          settings?: Json
          template?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "websites_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
