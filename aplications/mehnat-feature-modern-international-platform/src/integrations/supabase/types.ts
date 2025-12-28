export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      banner: {
        Row: {
          created_at: string | null
          description: string | null
          file_path: string | null
          id: number
          kategoriya: Database["public"]["Enums"]["kategoriya_enum"]
          title: string
          updated_at: string | null
          xavfsizlik_darajasi: Database["public"]["Enums"]["xavfsizlik_darajasi"]
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          file_path?: string | null
          id?: number
          kategoriya: Database["public"]["Enums"]["kategoriya_enum"]
          title: string
          updated_at?: string | null
          xavfsizlik_darajasi: Database["public"]["Enums"]["xavfsizlik_darajasi"]
        }
        Update: {
          created_at?: string | null
          description?: string | null
          file_path?: string | null
          id?: number
          kategoriya?: Database["public"]["Enums"]["kategoriya_enum"]
          title?: string
          updated_at?: string | null
          xavfsizlik_darajasi?: Database["public"]["Enums"]["xavfsizlik_darajasi"]
        }
        Relationships: []
      }
      kasb_yoriqnomalari: {
        Row: {
          content: string | null
          created_at: string | null
          file_path: string | null
          id: number
          kasb_nomi: string
          updated_at: string | null
          xavfsizlik_darajasi: Database["public"]["Enums"]["xavfsizlik_darajasi"]
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          file_path?: string | null
          id?: number
          kasb_nomi: string
          updated_at?: string | null
          xavfsizlik_darajasi: Database["public"]["Enums"]["xavfsizlik_darajasi"]
        }
        Update: {
          content?: string | null
          created_at?: string | null
          file_path?: string | null
          id?: number
          kasb_nomi?: string
          updated_at?: string | null
          xavfsizlik_darajasi?: Database["public"]["Enums"]["xavfsizlik_darajasi"]
        }
        Relationships: []
      }
      normativ_huquqiy_hujjatlar: {
        Row: {
          content: string | null
          created_at: string | null
          file_path: string | null
          id: number
          kategoriya: Database["public"]["Enums"]["kategoriya_enum"]
          title: string
          updated_at: string | null
          xavfsizlik_darajasi: Database["public"]["Enums"]["xavfsizlik_darajasi"]
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          file_path?: string | null
          id?: number
          kategoriya: Database["public"]["Enums"]["kategoriya_enum"]
          title: string
          updated_at?: string | null
          xavfsizlik_darajasi: Database["public"]["Enums"]["xavfsizlik_darajasi"]
        }
        Update: {
          content?: string | null
          created_at?: string | null
          file_path?: string | null
          id?: number
          kategoriya?: Database["public"]["Enums"]["kategoriya_enum"]
          title?: string
          updated_at?: string | null
          xavfsizlik_darajasi?: Database["public"]["Enums"]["xavfsizlik_darajasi"]
        }
        Relationships: []
      }
      qarorlar: {
        Row: {
          content: string | null
          created_at: string | null
          file_path: string | null
          id: number
          normativ_hujjat_id: number | null
          titleblob: string
          updated_at: string | null
          xavfsizlik_darajasi: Database["public"]["Enums"]["xavfsizlik_darajasi"]
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          file_path?: string | null
          id?: number
          normativ_hujjat_id?: number | null
          titleblob: string
          updated_at?: string | null
          xavfsizlik_darajasi: Database["public"]["Enums"]["xavfsizlik_darajasi"]
        }
        Update: {
          content?: string | null
          created_at?: string | null
          file_path?: string | null
          id?: number
          normativ_hujjat_id?: number | null
          titleblob?: string
          updated_at?: string | null
          xavfsizlik_darajasi?: Database["public"]["Enums"]["xavfsizlik_darajasi"]
        }
        Relationships: [
          {
            foreignKeyName: "qarorlar_normativ_hujjat_id_fkey"
            columns: ["normativ_hujjat_id"]
            isOneToOne: false
            referencedRelation: "normativ_huquqiy_hujjatlar"
            referencedColumns: ["id"]
          },
        ]
      }
      qoidalar: {
        Row: {
          content: string | null
          created_at: string | null
          file_path: string | null
          id: number
          normativ_hujjat_id: number | null
          titleblob: string
          updated_at: string | null
          xavfsizlik_darajasi: Database["public"]["Enums"]["xavfsizlik_darajasi"]
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          file_path?: string | null
          id?: number
          normativ_hujjat_id?: number | null
          titleblob: string
          updated_at?: string | null
          xavfsizlik_darajasi: Database["public"]["Enums"]["xavfsizlik_darajasi"]
        }
        Update: {
          content?: string | null
          created_at?: string | null
          file_path?: string | null
          id?: number
          normativ_hujjat_id?: number | null
          titleblob?: string
          updated_at?: string | null
          xavfsizlik_darajasi?: Database["public"]["Enums"]["xavfsizlik_darajasi"]
        }
        Relationships: [
          {
            foreignKeyName: "qoidalar_normativ_hujjat_id_fkey"
            columns: ["normativ_hujjat_id"]
            isOneToOne: false
            referencedRelation: "normativ_huquqiy_hujjatlar"
            referencedColumns: ["id"]
          },
        ]
      }
      qonunlar: {
        Row: {
          content: string | null
          created_at: string | null
          file_path: string | null
          id: number
          normativ_hujjat_id: number | null
          titleblob: string
          updated_at: string | null
          xavfsizlik_darajasi: Database["public"]["Enums"]["xavfsizlik_darajasi"]
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          file_path?: string | null
          id?: number
          normativ_hujjat_id?: number | null
          titleblob: string
          updated_at?: string | null
          xavfsizlik_darajasi: Database["public"]["Enums"]["xavfsizlik_darajasi"]
        }
        Update: {
          content?: string | null
          created_at?: string | null
          file_path?: string | null
          id?: number
          normativ_hujjat_id?: number | null
          titleblob?: string
          updated_at?: string | null
          xavfsizlik_darajasi?: Database["public"]["Enums"]["xavfsizlik_darajasi"]
        }
        Relationships: [
          {
            foreignKeyName: "qonunlar_normativ_hujjat_id_fkey"
            columns: ["normativ_hujjat_id"]
            isOneToOne: false
            referencedRelation: "normativ_huquqiy_hujjatlar"
            referencedColumns: ["id"]
          },
        ]
      }
      slaydlar: {
        Row: {
          created_at: string | null
          description: string | null
          file_path: string | null
          id: number
          marzu_turi: string | null
          title: string
          updated_at: string | null
          xavfsizlik_darajasi: Database["public"]["Enums"]["xavfsizlik_darajasi"]
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          file_path?: string | null
          id?: number
          marzu_turi?: string | null
          title: string
          updated_at?: string | null
          xavfsizlik_darajasi: Database["public"]["Enums"]["xavfsizlik_darajasi"]
        }
        Update: {
          created_at?: string | null
          description?: string | null
          file_path?: string | null
          id?: number
          marzu_turi?: string | null
          title?: string
          updated_at?: string | null
          xavfsizlik_darajasi?: Database["public"]["Enums"]["xavfsizlik_darajasi"]
        }
        Relationships: []
      }
      targbot_baza: {
        Row: {
          banner: string | null
          created_at: string | null
          id: number
          kasb_yoriqnoma: string | null
          slayl: string | null
          updated_at: string | null
          video_matealai: string | null
        }
        Insert: {
          banner?: string | null
          created_at?: string | null
          id?: number
          kasb_yoriqnoma?: string | null
          slayl?: string | null
          updated_at?: string | null
          video_matealai?: string | null
        }
        Update: {
          banner?: string | null
          created_at?: string | null
          id?: number
          kasb_yoriqnoma?: string | null
          slayl?: string | null
          updated_at?: string | null
          video_matealai?: string | null
        }
        Relationships: []
      }
      temir_yol_hujjatlari: {
        Row: {
          content: string | null
          created_at: string | null
          file_path: string | null
          id: number
          title: string
          updated_at: string | null
          xavfsizlik_darajasi: Database["public"]["Enums"]["xavfsizlik_darajasi"]
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          file_path?: string | null
          id?: number
          title: string
          updated_at?: string | null
          xavfsizlik_darajasi: Database["public"]["Enums"]["xavfsizlik_darajasi"]
        }
        Update: {
          content?: string | null
          created_at?: string | null
          file_path?: string | null
          id?: number
          title?: string
          updated_at?: string | null
          xavfsizlik_darajasi?: Database["public"]["Enums"]["xavfsizlik_darajasi"]
        }
        Relationships: []
      }
      video_materiallar: {
        Row: {
          created_at: string | null
          description: string | null
          file_path: string | null
          id: number
          title: string
          updated_at: string | null
          video_url: string | null
          xavfsizlik_darajasi: Database["public"]["Enums"]["xavfsizlik_darajasi"]
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          file_path?: string | null
          id?: number
          title: string
          updated_at?: string | null
          video_url?: string | null
          xavfsizlik_darajasi: Database["public"]["Enums"]["xavfsizlik_darajasi"]
        }
        Update: {
          created_at?: string | null
          description?: string | null
          file_path?: string | null
          id?: number
          title?: string
          updated_at?: string | null
          video_url?: string | null
          xavfsizlik_darajasi?: Database["public"]["Enums"]["xavfsizlik_darajasi"]
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
      kategoriya_enum:
        | "qonunlar"
        | "qarorlar"
        | "qoidalar"
        | "slaydlar"
        | "video_materiallar"
        | "temir_yol_hujjatlari"
        | "bannerlar"
        | "kasb_yoriqnomalari"
      xavfsizlik_darajasi:
        | "sanoat_xavfsizligi"
        | "mehnat_muhofazasi"
        | "sogliqni_saqlash"
        | "yol_harakati"
        | "yongin_xavfsizligi"
        | "elektr_xavfsizligi"
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
      kategoriya_enum: [
        "qonunlar",
        "qarorlar",
        "qoidalar",
        "slaydlar",
        "video_materiallar",
        "temir_yol_hujjatlari",
        "bannerlar",
        "kasb_yoriqnomalari",
      ],
      xavfsizlik_darajasi: [
        "sanoat_xavfsizligi",
        "mehnat_muhofazasi",
        "sogliqni_saqlash",
        "yol_harakati",
        "yongin_xavfsizligi",
        "elektr_xavfsizligi",
      ],
    },
  },
} as const
