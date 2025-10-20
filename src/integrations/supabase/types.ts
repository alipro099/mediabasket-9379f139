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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      chests: {
        Row: {
          id: string
          kind: Database["public"]["Enums"]["chest_kind"]
          payload: Json
        }
        Insert: {
          id?: string
          kind: Database["public"]["Enums"]["chest_kind"]
          payload: Json
        }
        Update: {
          id?: string
          kind?: Database["public"]["Enums"]["chest_kind"]
          payload?: Json
        }
        Relationships: []
      }
      dating_matches: {
        Row: {
          created_at: string
          id: string
          user_a: string
          user_b: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_a: string
          user_b: string
        }
        Update: {
          created_at?: string
          id?: string
          user_a?: string
          user_b?: string
        }
        Relationships: []
      }
      game_results: {
        Row: {
          created_at: string
          id: string
          reward_id: string | null
          score: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reward_id?: string | null
          score: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reward_id?: string | null
          score?: number
          user_id?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          away_team_id: string
          created_at: string
          home_team_id: string
          id: string
          media: Json | null
          score_away: number | null
          score_home: number | null
          starts_at: string
          venue: string | null
        }
        Insert: {
          away_team_id: string
          created_at?: string
          home_team_id: string
          id?: string
          media?: Json | null
          score_away?: number | null
          score_home?: number | null
          starts_at: string
          venue?: string | null
        }
        Update: {
          away_team_id?: string
          created_at?: string
          home_team_id?: string
          id?: string
          media?: Json | null
          score_away?: number | null
          score_home?: number | null
          starts_at?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["partner_kind"]
          logo_url: string | null
          meta: Json | null
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["partner_kind"]
          logo_url?: string | null
          meta?: Json | null
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["partner_kind"]
          logo_url?: string | null
          meta?: Json | null
          name?: string
        }
        Relationships: []
      }
      players: {
        Row: {
          created_at: string
          id: string
          name: string
          photo_url: string | null
          position: string | null
          stats: Json | null
          team_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          photo_url?: string | null
          position?: string | null
          stats?: Json | null
          team_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          photo_url?: string | null
          position?: string | null
          stats?: Json | null
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          meta: Json | null
          price_coins: number
          stock: number | null
          title: string
          type: Database["public"]["Enums"]["product_type"]
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          meta?: Json | null
          price_coins: number
          stock?: number | null
          title: string
          type: Database["public"]["Enums"]["product_type"]
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          meta?: Json | null
          price_coins?: number
          stock?: number | null
          title?: string
          type?: Database["public"]["Enums"]["product_type"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string
          dating_on: boolean | null
          fav_team: string | null
          id: string
          tg_id: string | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          dating_on?: boolean | null
          fav_team?: string | null
          id?: string
          tg_id?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          dating_on?: boolean | null
          fav_team?: string | null
          id?: string
          tg_id?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      redemptions: {
        Row: {
          code: string | null
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          code?: string | null
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "redemptions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["reward_kind"]
          payload: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["reward_kind"]
          payload: Json
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["reward_kind"]
          payload?: Json
          user_id?: string
        }
        Relationships: []
      }
      seasons: {
        Row: {
          ends_at: string
          id: string
          is_active: boolean | null
          name: string
          starts_at: string
        }
        Insert: {
          ends_at: string
          id?: string
          is_active?: boolean | null
          name: string
          starts_at: string
        }
        Update: {
          ends_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          starts_at?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          body: string
          created_at: string
          id: string
          status: Database["public"]["Enums"]["ticket_status"]
          subject: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["ticket_status"]
          subject: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["ticket_status"]
          subject?: string
          user_id?: string
        }
        Relationships: []
      }
      swipes: {
        Row: {
          created_at: string
          direction: Database["public"]["Enums"]["swipe_dir"]
          id: string
          target_user_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          direction: Database["public"]["Enums"]["swipe_dir"]
          id?: string
          target_user_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          direction?: Database["public"]["Enums"]["swipe_dir"]
          id?: string
          target_user_id?: string
          user_id?: string
        }
        Relationships: []
      }
      task_logs: {
        Row: {
          action_id: string | null
          created_at: string
          id: string
          proof: Json | null
          status: Database["public"]["Enums"]["task_status"]
          task_id: string
          user_id: string
        }
        Insert: {
          action_id?: string | null
          created_at?: string
          id?: string
          proof?: Json | null
          status?: Database["public"]["Enums"]["task_status"]
          task_id: string
          user_id: string
        }
        Update: {
          action_id?: string | null
          created_at?: string
          id?: string
          proof?: Json | null
          status?: Database["public"]["Enums"]["task_status"]
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_logs_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          id: string
          partner_id: string | null
          reward: Json
          title: string
          type: Database["public"]["Enums"]["task_type"]
          verify_mode: Database["public"]["Enums"]["verify_mode"]
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          partner_id?: string | null
          reward: Json
          title: string
          type: Database["public"]["Enums"]["task_type"]
          verify_mode?: Database["public"]["Enums"]["verify_mode"]
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          partner_id?: string | null
          reward?: Json
          title?: string
          type?: Database["public"]["Enums"]["task_type"]
          verify_mode?: Database["public"]["Enums"]["verify_mode"]
        }
        Relationships: [
          {
            foreignKeyName: "tasks_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          city: string | null
          created_at: string
          id: string
          logo_url: string | null
          name: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
        }
        Update: {
          city?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          action_id: string | null
          amount: number
          created_at: string
          id: string
          reason: string
          type: Database["public"]["Enums"]["tx_type"]
          user_id: string
        }
        Insert: {
          action_id?: string | null
          amount: number
          created_at?: string
          id?: string
          reason: string
          type: Database["public"]["Enums"]["tx_type"]
          user_id: string
        }
        Update: {
          action_id?: string | null
          amount?: number
          created_at?: string
          id?: string
          reason?: string
          type?: Database["public"]["Enums"]["tx_type"]
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance: number
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          id?: string
          updated_at?: string
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
    }
    Enums: {
      app_role: "user" | "admin" | "moderator"
      chest_kind: "small" | "medium" | "large"
      partner_kind: "bank" | "bookmaker" | "delivery" | "media"
      product_type: "ticket" | "promo" | "boost" | "dating_privilege"
      reward_kind: "coins" | "promo" | "boost" | "ticket"
      swipe_dir: "left" | "right"
      task_status: "pending" | "verified" | "rejected" | "paid"
      task_type:
        | "follow"
        | "register"
        | "bet"
        | "order"
        | "watch_video"
        | "watch_stream"
      ticket_status: "open" | "in_progress" | "resolved"
      tx_type: "earn" | "spend" | "adjust"
      verify_mode: "instant" | "webhook" | "manual"
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
      app_role: ["user", "admin", "moderator"],
      chest_kind: ["small", "medium", "large"],
      partner_kind: ["bank", "bookmaker", "delivery", "media"],
      product_type: ["ticket", "promo", "boost", "dating_privilege"],
      reward_kind: ["coins", "promo", "boost", "ticket"],
      swipe_dir: ["left", "right"],
      task_status: ["pending", "verified", "rejected", "paid"],
      task_type: [
        "follow",
        "register",
        "bet",
        "order",
        "watch_video",
        "watch_stream",
      ],
      ticket_status: ["open", "in_progress", "resolved"],
      tx_type: ["earn", "spend", "adjust"],
      verify_mode: ["instant", "webhook", "manual"],
    },
  },
} as const
