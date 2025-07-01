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
      bandeiras_cartao: {
        Row: {
          id: number
          nome: string | null
        }
        Insert: {
          id?: number
          nome?: string | null
        }
        Update: {
          id?: number
          nome?: string | null
        }
        Relationships: []
      }
      cards: {
        Row: {
          bandeira: string | null
          id: string
          limite: number | null
          numero_final: string | null
          status: string | null
          tipo: string | null
          user_id: string | null
        }
        Insert: {
          bandeira?: string | null
          id?: string
          limite?: number | null
          numero_final?: string | null
          status?: string | null
          tipo?: string | null
          user_id?: string | null
        }
        Update: {
          bandeira?: string | null
          id?: string
          limite?: number | null
          numero_final?: string | null
          status?: string | null
          tipo?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_pendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_recusados"
            referencedColumns: ["id"]
          },
        ]
      }
      contratos_aceitos: {
        Row: {
          aceito_em: string | null
          id: string
          tipo: string | null
          user_id: string | null
          versao: string | null
        }
        Insert: {
          aceito_em?: string | null
          id?: string
          tipo?: string | null
          user_id?: string | null
          versao?: string | null
        }
        Update: {
          aceito_em?: string | null
          id?: string
          tipo?: string | null
          user_id?: string | null
          versao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contratos_aceitos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_aceitos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_aceitos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_pendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_aceitos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_recusados"
            referencedColumns: ["id"]
          },
        ]
      }
      notificacoes: {
        Row: {
          corpo: string | null
          criado_em: string | null
          id: string
          lida: boolean | null
          titulo: string | null
          user_id: string | null
        }
        Insert: {
          corpo?: string | null
          criado_em?: string | null
          id?: string
          lida?: boolean | null
          titulo?: string | null
          user_id?: string | null
        }
        Update: {
          corpo?: string | null
          criado_em?: string | null
          id?: string
          lida?: boolean | null
          titulo?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notificacoes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notificacoes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notificacoes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_pendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notificacoes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_recusados"
            referencedColumns: ["id"]
          },
        ]
      }
      suporte: {
        Row: {
          criado_em: string | null
          id: string
          mensagem: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          criado_em?: string | null
          id?: string
          mensagem?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          criado_em?: string | null
          id?: string
          mensagem?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suporte_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suporte_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suporte_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_pendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suporte_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_recusados"
            referencedColumns: ["id"]
          },
        ]
      }
      taxas: {
        Row: {
          descricao: string | null
          id: number
          percentual: number | null
          tipo: string | null
          valor_fixo: number | null
        }
        Insert: {
          descricao?: string | null
          id?: number
          percentual?: number | null
          tipo?: string | null
          valor_fixo?: number | null
        }
        Update: {
          descricao?: string | null
          id?: number
          percentual?: number | null
          tipo?: string | null
          valor_fixo?: number | null
        }
        Relationships: []
      }
      tipos_transacao: {
        Row: {
          id: number
          nome: string | null
        }
        Insert: {
          id?: number
          nome?: string | null
        }
        Update: {
          id?: number
          nome?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          criado_em: string | null
          descricao: string | null
          from_user: string | null
          id: string
          tipo: string
          to_user: string | null
          valor: number
          wallet_id: string | null
        }
        Insert: {
          criado_em?: string | null
          descricao?: string | null
          from_user?: string | null
          id?: string
          tipo: string
          to_user?: string | null
          valor: number
          wallet_id?: string | null
        }
        Update: {
          criado_em?: string | null
          descricao?: string | null
          from_user?: string | null
          id?: string
          tipo?: string
          to_user?: string | null
          valor?: number
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_from_user_fkey"
            columns: ["from_user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_from_user_fkey"
            columns: ["from_user"]
            isOneToOne: false
            referencedRelation: "usuarios_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_from_user_fkey"
            columns: ["from_user"]
            isOneToOne: false
            referencedRelation: "usuarios_pendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_from_user_fkey"
            columns: ["from_user"]
            isOneToOne: false
            referencedRelation: "usuarios_recusados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_to_user_fkey"
            columns: ["to_user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_to_user_fkey"
            columns: ["to_user"]
            isOneToOne: false
            referencedRelation: "usuarios_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_to_user_fkey"
            columns: ["to_user"]
            isOneToOne: false
            referencedRelation: "usuarios_pendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_to_user_fkey"
            columns: ["to_user"]
            isOneToOne: false
            referencedRelation: "usuarios_recusados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          cpf: string | null
          cpf_cnpj: string
          created_at: string | null
          criado_em: string | null
          email: string
          id: string
          is_admin: boolean | null
          mae: string | null
          nascimento: string | null
          nome: string | null
          nome_completo: string
          profissao: string | null
          role: string | null
          senha: string | null
          status: string | null
          telefone: string | null
          tipo: string
        }
        Insert: {
          cpf?: string | null
          cpf_cnpj: string
          created_at?: string | null
          criado_em?: string | null
          email: string
          id?: string
          is_admin?: boolean | null
          mae?: string | null
          nascimento?: string | null
          nome?: string | null
          nome_completo: string
          profissao?: string | null
          role?: string | null
          senha?: string | null
          status?: string | null
          telefone?: string | null
          tipo: string
        }
        Update: {
          cpf?: string | null
          cpf_cnpj?: string
          created_at?: string | null
          criado_em?: string | null
          email?: string
          id?: string
          is_admin?: boolean | null
          mae?: string | null
          nascimento?: string | null
          nome?: string | null
          nome_completo?: string
          profissao?: string | null
          role?: string | null
          senha?: string | null
          status?: string | null
          telefone?: string | null
          tipo?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          atualizado_em: string | null
          id: string
          motivo_bloq: string | null
          saldo: number | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          atualizado_em?: string | null
          id?: string
          motivo_bloq?: string | null
          saldo?: number | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          atualizado_em?: string | null
          id?: string
          motivo_bloq?: string | null
          saldo?: number | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_pendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_recusados"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      usuarios_ativos: {
        Row: {
          cpf: string | null
          created_at: string | null
          email: string | null
          id: string | null
          nome: string | null
          telefone: string | null
        }
        Insert: {
          cpf?: string | null
          created_at?: string | null
          email?: string | null
          id?: string | null
          nome?: string | null
          telefone?: string | null
        }
        Update: {
          cpf?: string | null
          created_at?: string | null
          email?: string | null
          id?: string | null
          nome?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      usuarios_pendentes: {
        Row: {
          cpf: string | null
          created_at: string | null
          email: string | null
          id: string | null
          nome: string | null
          telefone: string | null
        }
        Insert: {
          cpf?: string | null
          created_at?: string | null
          email?: string | null
          id?: string | null
          nome?: string | null
          telefone?: string | null
        }
        Update: {
          cpf?: string | null
          created_at?: string | null
          email?: string | null
          id?: string | null
          nome?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      usuarios_recusados: {
        Row: {
          cpf: string | null
          created_at: string | null
          email: string | null
          id: string | null
          nome: string | null
          telefone: string | null
        }
        Insert: {
          cpf?: string | null
          created_at?: string | null
          email?: string | null
          id?: string | null
          nome?: string | null
          telefone?: string | null
        }
        Update: {
          cpf?: string | null
          created_at?: string | null
          email?: string | null
          id?: string | null
          nome?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
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
