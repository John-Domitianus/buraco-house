export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      auction_items: {
        Row: {
          auction_id: string
          created_at: string
          display_order: number
          id: string
          image_url: string | null
          info: string | null
          name: string
          rarity: string
          starting_price: number | null
        }
        Insert: {
          auction_id: string
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          info?: string | null
          name: string
          rarity?: string
          starting_price?: number | null
        }
        Update: {
          auction_id?: string
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          info?: string | null
          name?: string
          rarity?: string
          starting_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "auction_items_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
        ]
      }
      auctions: {
        Row: {
          created_at: string
          description: string | null
          discord_url: string | null
          extra_info: string | null
          id: string
          image_url: string | null
          location: string | null
          name: string
          responsible: string | null
          starts_at: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          discord_url?: string | null
          extra_info?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          name: string
          responsible?: string | null
          starts_at: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          discord_url?: string | null
          extra_info?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          name?: string
          responsible?: string | null
          starts_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      collaborators: {
        Row: {
          active: boolean
          avatar_url: string | null
          created_at: string
          description: string | null
          discord_url: string | null
          display_order: number
          id: string
          name: string | null
          nickname: string
          role: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          avatar_url?: string | null
          created_at?: string
          description?: string | null
          discord_url?: string | null
          display_order?: number
          id?: string
          name?: string | null
          nickname: string
          role: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          avatar_url?: string | null
          created_at?: string
          description?: string | null
          discord_url?: string | null
          display_order?: number
          id?: string
          name?: string | null
          nickname?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          image_url: string | null
          published: boolean
          published_at: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          published?: boolean
          published_at?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          published?: boolean
          published_at?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          credits: number
          id: string
          nickname: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          credits?: number
          id: string
          nickname: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          credits?: number
          id?: string
          nickname?: string
        }
        Relationships: []
      }
      rankings: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          is_demo: boolean
          nickname: string
          period: string
          purchases: number
          total_spent: number
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          is_demo?: boolean
          nickname: string
          period?: string
          purchases?: number
          total_spent?: number
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          is_demo?: boolean
          nickname?: string
          period?: string
          purchases?: number
          total_spent?: number
          updated_at?: string
        }
        Relationships: []
      }
      roulette_prizes: {
        Row: {
          active: boolean
          color: string
          created_at: string
          display_order: number
          id: string
          image_url: string | null
          name: string
          probability: number
          rarity: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          color?: string
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          name: string
          probability?: number
          rarity?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          color?: string
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          name?: string
          probability?: number
          rarity?: string
          updated_at?: string
        }
        Relationships: []
      }
      roulette_results: {
        Row: {
          created_at: string
          id: string
          nickname: string
          prize_id: string | null
          prize_name: string
          rarity: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          nickname: string
          prize_id?: string | null
          prize_name: string
          rarity?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          nickname?: string
          prize_id?: string | null
          prize_name?: string
          rarity?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roulette_results_prize_id_fkey"
            columns: ["prize_id"]
            isOneToOne: false
            referencedRelation: "roulette_prizes"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          discord_server_url: string
          footer_tagline: string
          hero_description: string
          hero_title: string
          how_it_works: Json
          id: number
          spin_cost: number
          store_name: string
          updated_at: string
        }
        Insert: {
          discord_server_url?: string
          footer_tagline?: string
          hero_description?: string
          hero_title?: string
          how_it_works?: Json
          id?: number
          spin_cost?: number
          store_name?: string
          updated_at?: string
        }
        Update: {
          discord_server_url?: string
          footer_tagline?: string
          hero_description?: string
          hero_title?: string
          how_it_works?: Json
          id?: number
          spin_cost?: number
          store_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      spin_roulette: { Args: never; Returns: Json }
    }
    Enums: {
      app_role: "admin" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "user"],
    },
  },
} as const
