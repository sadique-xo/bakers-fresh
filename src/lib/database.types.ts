export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      cakes: {
        Row: {
          base_price_inr: number
          category_id: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          flavors: string[] | null
          gallery_urls: string[] | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_eggless: boolean | null
          is_featured: boolean | null
          name: string
          sizes_available: string[] | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          base_price_inr: number
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          flavors?: string[] | null
          gallery_urls?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_eggless?: boolean | null
          is_featured?: boolean | null
          name: string
          sizes_available?: string[] | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          base_price_inr?: number
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          flavors?: string[] | null
          gallery_urls?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_eggless?: boolean | null
          is_featured?: boolean | null
          name?: string
          sizes_available?: string[] | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cakes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      locations: {
        Row: {
          address: string
          created_at: string | null
          display_order: number | null
          google_maps_embed: string | null
          google_maps_url: string | null
          hours: Json | null
          id: string
          is_active: boolean | null
          is_main: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          phone: string
          slug: string
          whatsapp: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          display_order?: number | null
          google_maps_embed?: string | null
          google_maps_url?: string | null
          hours?: Json | null
          id?: string
          is_active?: boolean | null
          is_main?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          phone: string
          slug: string
          whatsapp?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          display_order?: number | null
          google_maps_embed?: string | null
          google_maps_url?: string | null
          hours?: Json | null
          id?: string
          is_active?: boolean | null
          is_main?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string
          slug?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          admin_notes: string | null
          cake_flavor: string | null
          cake_id: string | null
          cake_size: string | null
          cake_type: string | null
          completed_at: string | null
          confirmed_at: string | null
          created_at: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string
          delivery_address: string | null
          delivery_date: string
          delivery_method: Database["public"]["Enums"]["delivery_method"]
          delivery_time_slot: string | null
          estimated_price_inr: number | null
          final_price_inr: number | null
          id: string
          is_eggless: boolean | null
          message_on_cake: string | null
          order_number: string
          outlet: string | null
          reference_image_urls: string[] | null
          special_instructions: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          cake_flavor?: string | null
          cake_id?: string | null
          cake_size?: string | null
          cake_type?: string | null
          completed_at?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          delivery_address?: string | null
          delivery_date: string
          delivery_method: Database["public"]["Enums"]["delivery_method"]
          delivery_time_slot?: string | null
          estimated_price_inr?: number | null
          final_price_inr?: number | null
          id?: string
          is_eggless?: boolean | null
          message_on_cake?: string | null
          order_number?: string
          outlet?: string | null
          reference_image_urls?: string[] | null
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          cake_flavor?: string | null
          cake_id?: string | null
          cake_size?: string | null
          cake_type?: string | null
          completed_at?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          delivery_address?: string | null
          delivery_date?: string
          delivery_method?: Database["public"]["Enums"]["delivery_method"]
          delivery_time_slot?: string | null
          estimated_price_inr?: number | null
          final_price_inr?: number | null
          id?: string
          is_eggless?: boolean | null
          message_on_cake?: string | null
          order_number?: string
          outlet?: string | null
          reference_image_urls?: string[] | null
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_cake_id_fkey"
            columns: ["cake_id"]
            isOneToOne: false
            referencedRelation: "cakes"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          created_at: string | null
          customer_name: string
          display_order: number | null
          id: string
          is_featured: boolean | null
          rating: number | null
          review: string
          source: string | null
        }
        Insert: {
          created_at?: string | null
          customer_name: string
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          rating?: number | null
          review: string
          source?: string | null
        }
        Update: {
          created_at?: string | null
          customer_name?: string
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          rating?: number | null
          review?: string
          source?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      delivery_method: "pickup" | "delivery"
      order_status:
        | "pending"
        | "confirmed"
        | "preparing"
        | "ready"
        | "completed"
        | "cancelled"
        | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      delivery_method: ["pickup", "delivery"],
      order_status: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "completed",
        "cancelled",
        "rejected",
      ],
    },
  },
} as const
