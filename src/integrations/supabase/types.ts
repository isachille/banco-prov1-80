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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      binance_transactions: {
        Row: {
          chave_pix: string | null
          created_at: string
          id: string
          metadata: Json | null
          moeda: string
          status: string
          tipo: string
          user_id: string
          valor: number
        }
        Insert: {
          chave_pix?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          moeda?: string
          status?: string
          tipo: string
          user_id: string
          valor: number
        }
        Update: {
          chave_pix?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          moeda?: string
          status?: string
          tipo?: string
          user_id?: string
          valor?: number
        }
        Relationships: []
      }
      binance_wallets: {
        Row: {
          balance: number
          created_at: string
          crypto_balance: Json | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          crypto_balance?: Json | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          crypto_balance?: Json | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      contratos_financiamento: {
        Row: {
          assinado_em: string | null
          assinatura_cliente: string | null
          banco_promotor: string | null
          cliente_cpf: string
          cliente_data_nascimento: string | null
          cliente_nome: string
          cliente_nome_mae: string | null
          codigo_contrato: string
          created_at: string
          email_enviado: boolean | null
          id: string
          link_assinatura: string | null
          proposta_id: string
          status_contrato: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assinado_em?: string | null
          assinatura_cliente?: string | null
          banco_promotor?: string | null
          cliente_cpf: string
          cliente_data_nascimento?: string | null
          cliente_nome: string
          cliente_nome_mae?: string | null
          codigo_contrato: string
          created_at?: string
          email_enviado?: boolean | null
          id?: string
          link_assinatura?: string | null
          proposta_id: string
          status_contrato?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assinado_em?: string | null
          assinatura_cliente?: string | null
          banco_promotor?: string | null
          cliente_cpf?: string
          cliente_data_nascimento?: string | null
          cliente_nome?: string
          cliente_nome_mae?: string | null
          codigo_contrato?: string
          created_at?: string
          email_enviado?: boolean | null
          id?: string
          link_assinatura?: string | null
          proposta_id?: string
          status_contrato?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contratos_financiamento_proposta_id_fkey"
            columns: ["proposta_id"]
            isOneToOne: false
            referencedRelation: "propostas_financiamento"
            referencedColumns: ["id"]
          },
        ]
      }
      giftcards: {
        Row: {
          codigo: string
          created_at: string
          giftcard_name: string
          id: string
          status: string
          used_at: string | null
          user_id: string
          valor: number
        }
        Insert: {
          codigo: string
          created_at?: string
          giftcard_name: string
          id?: string
          status?: string
          used_at?: string | null
          user_id: string
          valor: number
        }
        Update: {
          codigo?: string
          created_at?: string
          giftcard_name?: string
          id?: string
          status?: string
          used_at?: string | null
          user_id?: string
          valor?: number
        }
        Relationships: []
      }
      operadores: {
        Row: {
          ativo: boolean | null
          created_at: string
          email: string | null
          id: string
          nome: string
          telefone: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string
          email?: string | null
          id?: string
          nome: string
          telefone?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string
          email?: string | null
          id?: string
          nome?: string
          telefone?: string | null
        }
        Relationships: []
      }
      pixley_transactions: {
        Row: {
          created_at: string
          explorer_url: string | null
          external_id: string | null
          fees: Json | null
          id: string
          metadata: Json | null
          network: string | null
          pix_key: string | null
          pix_key_type: string | null
          qr_code: string | null
          recipient_document: string | null
          recipient_name: string | null
          source_amount: number
          source_currency: string
          status: string
          target_amount: number | null
          target_currency: string
          transaction_id: string | null
          tx_hash: string | null
          type: string
          updated_at: string
          user_id: string
          wallet_address: string | null
        }
        Insert: {
          created_at?: string
          explorer_url?: string | null
          external_id?: string | null
          fees?: Json | null
          id?: string
          metadata?: Json | null
          network?: string | null
          pix_key?: string | null
          pix_key_type?: string | null
          qr_code?: string | null
          recipient_document?: string | null
          recipient_name?: string | null
          source_amount: number
          source_currency: string
          status?: string
          target_amount?: number | null
          target_currency: string
          transaction_id?: string | null
          tx_hash?: string | null
          type: string
          updated_at?: string
          user_id: string
          wallet_address?: string | null
        }
        Update: {
          created_at?: string
          explorer_url?: string | null
          external_id?: string | null
          fees?: Json | null
          id?: string
          metadata?: Json | null
          network?: string | null
          pix_key?: string | null
          pix_key_type?: string | null
          qr_code?: string | null
          recipient_document?: string | null
          recipient_name?: string | null
          source_amount?: number
          source_currency?: string
          status?: string
          target_amount?: number | null
          target_currency?: string
          transaction_id?: string | null
          tx_hash?: string | null
          type?: string
          updated_at?: string
          user_id?: string
          wallet_address?: string | null
        }
        Relationships: []
      }
      propostas_financiamento: {
        Row: {
          admin_id: string | null
          ano: number
          codigo: string
          created_at: string
          id: string
          marca: string
          modelo: string
          operador_id: string | null
          parcelas: number
          status: string
          taxa_juros: number
          updated_at: string
          user_id: string
          valorentrada: number
          valorparcela: number
          valorveiculo: number
        }
        Insert: {
          admin_id?: string | null
          ano: number
          codigo: string
          created_at?: string
          id?: string
          marca: string
          modelo: string
          operador_id?: string | null
          parcelas: number
          status?: string
          taxa_juros?: number
          updated_at?: string
          user_id: string
          valorentrada: number
          valorparcela: number
          valorveiculo: number
        }
        Update: {
          admin_id?: string | null
          ano?: number
          codigo?: string
          created_at?: string
          id?: string
          marca?: string
          modelo?: string
          operador_id?: string | null
          parcelas?: number
          status?: string
          taxa_juros?: number
          updated_at?: string
          user_id?: string
          valorentrada?: number
          valorparcela?: number
          valorveiculo?: number
        }
        Relationships: []
      }
      subcontas: {
        Row: {
          agencia: string | null
          banco: string | null
          conta: string | null
          created_at: string
          id: string
          nome: string
          updated_at: string
          user_id: string
        }
        Insert: {
          agencia?: string | null
          banco?: string | null
          conta?: string | null
          created_at?: string
          id?: string
          nome: string
          updated_at?: string
          user_id: string
        }
        Update: {
          agencia?: string | null
          banco?: string | null
          conta?: string | null
          created_at?: string
          id?: string
          nome?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sumup_checkouts: {
        Row: {
          amount: number
          checkout_reference: string | null
          created_at: string
          currency: string
          description: string | null
          id: string
          raw: Json | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          checkout_reference?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id: string
          raw?: Json | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          checkout_reference?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          raw?: Json | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sumup_customers: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          raw: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          raw?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          raw?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sumup_refunds: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          raw: Json | null
          status: string | null
          transaction_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id: string
          raw?: Json | null
          status?: string | null
          transaction_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          raw?: Json | null
          status?: string | null
          transaction_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transacoes: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          status: string
          subconta_id: string | null
          taxa_efi: number | null
          taxa_sua: number | null
          tipo: string
          user_id: string
          valor: number
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          status?: string
          subconta_id?: string | null
          taxa_efi?: number | null
          taxa_sua?: number | null
          tipo: string
          user_id: string
          valor: number
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          status?: string
          subconta_id?: string | null
          taxa_efi?: number | null
          taxa_sua?: number | null
          tipo?: string
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "transacoes_subconta_id_fkey"
            columns: ["subconta_id"]
            isOneToOne: false
            referencedRelation: "subcontas"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          granted_at: string | null
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          cep: string | null
          cidade: string | null
          cpf: string | null
          cpf_cnpj: string | null
          created_at: string | null
          criado_em: string | null
          email: string
          endereco: string | null
          estado: string | null
          id: string
          is_admin: boolean | null
          mae: string | null
          nascimento: string | null
          nome: string | null
          nome_completo: string | null
          profissao: string | null
          role: string | null
          status: string | null
          telefone: string | null
          tipo: string | null
          updated_at: string | null
        }
        Insert: {
          cep?: string | null
          cidade?: string | null
          cpf?: string | null
          cpf_cnpj?: string | null
          created_at?: string | null
          criado_em?: string | null
          email: string
          endereco?: string | null
          estado?: string | null
          id: string
          is_admin?: boolean | null
          mae?: string | null
          nascimento?: string | null
          nome?: string | null
          nome_completo?: string | null
          profissao?: string | null
          role?: string | null
          status?: string | null
          telefone?: string | null
          tipo?: string | null
          updated_at?: string | null
        }
        Update: {
          cep?: string | null
          cidade?: string | null
          cpf?: string | null
          cpf_cnpj?: string | null
          created_at?: string | null
          criado_em?: string | null
          email?: string
          endereco?: string | null
          estado?: string | null
          id?: string
          is_admin?: boolean | null
          mae?: string | null
          nascimento?: string | null
          nome?: string | null
          nome_completo?: string | null
          profissao?: string | null
          role?: string | null
          status?: string | null
          telefone?: string | null
          tipo?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      wallets: {
        Row: {
          created_at: string | null
          id: string
          limite: number | null
          rendimento_mes: number | null
          saldo: number | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          limite?: number | null
          rendimento_mes?: number | null
          saldo?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          limite?: number | null
          rendimento_mes?: number | null
          saldo?: number | null
          status?: string | null
          updated_at?: string | null
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
        ]
      }
    }
    Views: {
      wallets_ativas: {
        Row: {
          cpf: string | null
          email: string | null
          limite: number | null
          nome_completo: string | null
          rendimento_mes: number | null
          role: string | null
          saldo: number | null
          status: string | null
          telefone: string | null
          tipo: string | null
          user_id: string | null
          wallet_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_user: {
        Args: { user_id: string }
        Returns: boolean
      }
      process_proposal_decision: {
        Args: { admin_user_id: string; decision: string; proposal_id: string }
        Returns: Json
      }
      transferir_saldo: {
        Args: { p_de: string; p_para: string; p_valor: number }
        Returns: Json
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "dono"
        | "gerente"
        | "analista"
        | "operador"
        | "usuario"
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
      app_role: ["admin", "dono", "gerente", "analista", "operador", "usuario"],
    },
  },
} as const
