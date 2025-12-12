export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  nflweeklypicks: {
    Tables: {
      league_users: {
        Row: {
          id: number
          league_id: number
          user_id: string
        }
        Insert: {
          id?: number
          league_id: number
          user_id: string
        }
        Update: {
          id?: number
          league_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "league_users_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
        ]
      }
      leagues: {
        Row: {
          created_at: string
          created_by: string | null
          id: number
          is_system_default: boolean
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: number
          is_system_default?: boolean
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: number
          is_system_default?: boolean
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      picks: {
        Row: {
          created_at: string
          id: number
          league_id: number
          season: string
          team_id: number
          tie_breaker_score: number | null
          updated_at: string | null
          user_id: string
          week: string
        }
        Insert: {
          created_at?: string
          id?: number
          league_id: number
          season: string
          team_id: number
          tie_breaker_score?: number | null
          updated_at?: string | null
          user_id: string
          week: string
        }
        Update: {
          created_at?: string
          id?: number
          league_id?: number
          season?: string
          team_id?: number
          tie_breaker_score?: number | null
          updated_at?: string | null
          user_id?: string
          week?: string
        }
        Relationships: [
          {
            foreignKeyName: "picks_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "picks_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["external_id"]
          },
        ]
      }
      seasons: {
        Row: {
          created_at: string
          end_date: string
          id: number
          start_date: string
          type: string
          updated_at: string | null
          year: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: number
          start_date: string
          type: string
          updated_at?: string | null
          year: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: number
          start_date?: string
          type?: string
          updated_at?: string | null
          year?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          abbreviation: string
          alternate_color: string | null
          color: string
          created_at: string
          external_id: number
          id: number
          logos: Json | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          abbreviation: string
          alternate_color?: string | null
          color: string
          created_at?: string
          external_id: number
          id?: number
          logos?: Json | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          abbreviation?: string
          alternate_color?: string | null
          color?: string
          created_at?: string
          external_id?: number
          id?: number
          logos?: Json | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_weekly_results: {
        Row: {
          correct_picks_count: number
          created_at: string
          id: number
          incorrect_picks_count: number
          total_picks_count: number
          updated_at: string | null
          user_id: string
          weekly_results_id: number
        }
        Insert: {
          correct_picks_count?: number
          created_at?: string
          id?: number
          incorrect_picks_count?: number
          total_picks_count?: number
          updated_at?: string | null
          user_id: string
          weekly_results_id: number
        }
        Update: {
          correct_picks_count?: number
          created_at?: string
          id?: number
          incorrect_picks_count?: number
          total_picks_count?: number
          updated_at?: string | null
          user_id?: string
          weekly_results_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_weekly_results_weekly_results_id_fkey"
            columns: ["weekly_results_id"]
            isOneToOne: false
            referencedRelation: "weekly_results"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_matchup_metadatas: {
        Row: {
          away_team_external_id: string
          away_team_record: string
          away_team_score: number
          created_at: string
          event_status: string
          external_event_id: string
          home_team_external_id: string
          home_team_record: string
          home_team_score: number
          id: number
          season: string
          updated_at: string | null
          week: string
          winning_team_id: number | null
        }
        Insert: {
          away_team_external_id: string
          away_team_record: string
          away_team_score?: number
          created_at?: string
          event_status: string
          external_event_id: string
          home_team_external_id: string
          home_team_record: string
          home_team_score?: number
          id?: number
          season: string
          updated_at?: string | null
          week: string
          winning_team_id?: number | null
        }
        Update: {
          away_team_external_id?: string
          away_team_record?: string
          away_team_score?: number
          created_at?: string
          event_status?: string
          external_event_id?: string
          home_team_external_id?: string
          home_team_record?: string
          home_team_score?: number
          id?: number
          season?: string
          updated_at?: string | null
          week?: string
          winning_team_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "weekly_matchup_metadatas_winning_team_id_fkey"
            columns: ["winning_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["external_id"]
          },
        ]
      }
      weekly_matchups: {
        Row: {
          away_team_id: number | null
          created_at: string
          external_id: string
          home_team_id: number
          id: number
          name: string
          season: string
          short_name: string
          start_date: string
          updated_at: string | null
          week: string
        }
        Insert: {
          away_team_id?: number | null
          created_at?: string
          external_id: string
          home_team_id: number
          id?: number
          name: string
          season: string
          short_name: string
          start_date: string
          updated_at?: string | null
          week: string
        }
        Update: {
          away_team_id?: number | null
          created_at?: string
          external_id?: string
          home_team_id?: number
          id?: number
          name?: string
          season?: string
          short_name?: string
          start_date?: string
          updated_at?: string | null
          week?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_matchups_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["external_id"]
          },
          {
            foreignKeyName: "weekly_matchups_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["external_id"]
          },
        ]
      }
      weekly_results: {
        Row: {
          created_at: string
          id: number
          league_id: number
          season: string
          updated_at: string | null
          week: string
          winning_user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          league_id: number
          season: string
          updated_at?: string | null
          week: string
          winning_user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          league_id?: number
          season?: string
          updated_at?: string | null
          week?: string
          winning_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_results_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_schedules: {
        Row: {
          created_at: string
          end_date: string
          id: number
          start_date: string
          updated_at: string | null
          value: string
          year: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: number
          start_date: string
          updated_at?: string | null
          value: string
          year: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: number
          start_date?: string
          updated_at?: string | null
          value?: string
          year?: string
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
      [_ in never]: never
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
  nflweeklypicks: {
    Enums: {},
  },
} as const

