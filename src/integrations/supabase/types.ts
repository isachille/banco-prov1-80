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
      arquivos: {
        Row: {
          criado_em: string | null
          id: string
          nome: string | null
          tipo: string | null
          url: string | null
          user_id: string | null
        }
        Insert: {
          criado_em?: string | null
          id?: string
          nome?: string | null
          tipo?: string | null
          url?: string | null
          user_id?: string | null
        }
        Update: {
          criado_em?: string | null
          id?: string
          nome?: string | null
          tipo?: string | null
          url?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arquivos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arquivos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arquivos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_pendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arquivos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_recusados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arquivos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "wallets_ativas"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "arquivos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "wallets_com_usuarios"
            referencedColumns: ["user_id"]
          },
        ]
      }
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
      binance_transactions: {
        Row: {
          chave_pix: string | null
          created_at: string | null
          destinatario: string | null
          id: string
          metadata: Json | null
          moeda: string | null
          status: string | null
          tipo: string
          user_id: string | null
          valor: number
        }
        Insert: {
          chave_pix?: string | null
          created_at?: string | null
          destinatario?: string | null
          id?: string
          metadata?: Json | null
          moeda?: string | null
          status?: string | null
          tipo: string
          user_id?: string | null
          valor: number
        }
        Update: {
          chave_pix?: string | null
          created_at?: string | null
          destinatario?: string | null
          id?: string
          metadata?: Json | null
          moeda?: string | null
          status?: string | null
          tipo?: string
          user_id?: string | null
          valor?: number
        }
        Relationships: []
      }
      binance_wallets: {
        Row: {
          balance: number | null
          created_at: string | null
          currency: string | null
          id: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
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
          {
            foreignKeyName: "cards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "wallets_ativas"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "cards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "wallets_com_usuarios"
            referencedColumns: ["user_id"]
          },
        ]
      }
      cedentes_pagadores: {
        Row: {
          cpf_cnpj: string | null
          criado_em: string | null
          email: string | null
          id: string
          nome: string | null
          telefone: string | null
          tipo: string | null
        }
        Insert: {
          cpf_cnpj?: string | null
          criado_em?: string | null
          email?: string | null
          id?: string
          nome?: string | null
          telefone?: string | null
          tipo?: string | null
        }
        Update: {
          cpf_cnpj?: string | null
          criado_em?: string | null
          email?: string | null
          id?: string
          nome?: string | null
          telefone?: string | null
          tipo?: string | null
        }
        Relationships: []
      }
      cobrancas: {
        Row: {
          cliente_id: string | null
          criado_em: string | null
          descricao: string | null
          id: string
          status: string | null
          valor: number | null
          vencimento: string | null
        }
        Insert: {
          cliente_id?: string | null
          criado_em?: string | null
          descricao?: string | null
          id?: string
          status?: string | null
          valor?: number | null
          vencimento?: string | null
        }
        Update: {
          cliente_id?: string | null
          criado_em?: string | null
          descricao?: string | null
          id?: string
          status?: string | null
          valor?: number | null
          vencimento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cobrancas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cobrancas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "usuarios_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cobrancas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "usuarios_pendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cobrancas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "usuarios_recusados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cobrancas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "wallets_ativas"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "cobrancas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "wallets_com_usuarios"
            referencedColumns: ["user_id"]
          },
        ]
      }
      compras: {
        Row: {
          data: string | null
          id: string
          servico: string | null
          user_id: string | null
          valor: number | null
        }
        Insert: {
          data?: string | null
          id?: string
          servico?: string | null
          user_id?: string | null
          valor?: number | null
        }
        Update: {
          data?: string | null
          id?: string
          servico?: string | null
          user_id?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "compras_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_pendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_recusados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "wallets_ativas"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "compras_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "wallets_com_usuarios"
            referencedColumns: ["user_id"]
          },
        ]
      }
      consultas_bureaux: {
        Row: {
          consultado_em: string | null
          cpf_consultado: string | null
          id: string
          resultado: string | null
          user_id: string | null
        }
        Insert: {
          consultado_em?: string | null
          cpf_consultado?: string | null
          id?: string
          resultado?: string | null
          user_id?: string | null
        }
        Update: {
          consultado_em?: string | null
          cpf_consultado?: string | null
          id?: string
          resultado?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultas_bureaux_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultas_bureaux_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultas_bureaux_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_pendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultas_bureaux_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_recusados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultas_bureaux_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "wallets_ativas"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "consultas_bureaux_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "wallets_com_usuarios"
            referencedColumns: ["user_id"]
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
          {
            foreignKeyName: "contratos_aceitos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "wallets_ativas"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "contratos_aceitos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "wallets_com_usuarios"
            referencedColumns: ["user_id"]
          },
        ]
      }
      faturamento_conta: {
        Row: {
          data_fim: string | null
          data_inicio: string | null
          id: string
          plano: string | null
          status: string | null
          user_id: string | null
          valor: number | null
        }
        Insert: {
          data_fim?: string | null
          data_inicio?: string | null
          id?: string
          plano?: string | null
          status?: string | null
          user_id?: string | null
          valor?: number | null
        }
        Update: {
          data_fim?: string | null
          data_inicio?: string | null
          id?: string
          plano?: string | null
          status?: string | null
          user_id?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "faturamento_conta_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faturamento_conta_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faturamento_conta_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_pendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faturamento_conta_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_recusados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faturamento_conta_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "wallets_ativas"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "faturamento_conta_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "wallets_com_usuarios"
            referencedColumns: ["user_id"]
          },
        ]
      }
      giftcards: {
        Row: {
          codigo: string | null
          created_at: string | null
          id: string
          nome: string
          status: string | null
          user_id: string | null
          valor: number
        }
        Insert: {
          codigo?: string | null
          created_at?: string | null
          id?: string
          nome: string
          status?: string | null
          user_id?: string | null
          valor: number
        }
        Update: {
          codigo?: string | null
          created_at?: string | null
          id?: string
          nome?: string
          status?: string | null
          user_id?: string | null
          valor?: number
        }
        Relationships: []
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
          {
            foreignKeyName: "notificacoes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "wallets_ativas"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notificacoes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "wallets_com_usuarios"
            referencedColumns: ["user_id"]
          },
        ]
      }
      pagamentos: {
        Row: {
          criado_em: string | null
          descricao: string | null
          id: string
          status: string | null
          tipo: string | null
          user_id: string | null
          valor: number | null
          vencimento: string | null
        }
        Insert: {
          criado_em?: string | null
          descricao?: string | null
          id?: string
          status?: string | null
          tipo?: string | null
          user_id?: string | null
          valor?: number | null
          vencimento?: string | null
        }
        Update: {
          criado_em?: string | null
          descricao?: string | null
          id?: string
          status?: string | null
          tipo?: string | null
          user_id?: string | null
          valor?: number | null
          vencimento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagamentos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagamentos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_pendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagamentos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_recusados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagamentos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "wallets_ativas"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "pagamentos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "wallets_com_usuarios"
            referencedColumns: ["user_id"]
          },
        ]
      }
      perfil_kyc: {
        Row: {
          cpf: string
          created_at: string | null
          data_nascimento: string
          id: string
          nome_completo: string
          nome_mae: string
          profissao: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cpf: string
          created_at?: string | null
          data_nascimento: string
          id?: string
          nome_completo: string
          nome_mae: string
          profissao: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cpf?: string
          created_at?: string | null
          data_nascimento?: string
          id?: string
          nome_completo?: string
          nome_mae?: string
          profissao?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      pix: {
        Row: {
          criado_em: string | null
          destino: string | null
          id: string
          origem: string | null
          status: string | null
          valor: number | null
        }
        Insert: {
          criado_em?: string | null
          destino?: string | null
          id?: string
          origem?: string | null
          status?: string | null
          valor?: number | null
        }
        Update: {
          criado_em?: string | null
          destino?: string | null
          id?: string
          origem?: string | null
          status?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pix_destino_fkey"
            columns: ["destino"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pix_destino_fkey"
            columns: ["destino"]
            isOneToOne: false
            referencedRelation: "usuarios_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pix_destino_fkey"
            columns: ["destino"]
            isOneToOne: false
            referencedRelation: "usuarios_pendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pix_destino_fkey"
            columns: ["destino"]
            isOneToOne: false
            referencedRelation: "usuarios_recusados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pix_destino_fkey"
            columns: ["destino"]
            isOneToOne: false
            referencedRelation: "wallets_ativas"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "pix_destino_fkey"
            columns: ["destino"]
            isOneToOne: false
            referencedRelation: "wallets_com_usuarios"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "pix_origem_fkey"
            columns: ["origem"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pix_origem_fkey"
            columns: ["origem"]
            isOneToOne: false
            referencedRelation: "usuarios_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pix_origem_fkey"
            columns: ["origem"]
            isOneToOne: false
            referencedRelation: "usuarios_pendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pix_origem_fkey"
            columns: ["origem"]
            isOneToOne: false
            referencedRelation: "usuarios_recusados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pix_origem_fkey"
            columns: ["origem"]
            isOneToOne: false
            referencedRelation: "wallets_ativas"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "pix_origem_fkey"
            columns: ["origem"]
            isOneToOne: false
            referencedRelation: "wallets_com_usuarios"
            referencedColumns: ["user_id"]
          },
        ]
      }
      preferencias_usuarios: {
        Row: {
          atualizado_em: string | null
          id: string
          notificacoes: boolean | null
          tema: string | null
          user_id: string | null
        }
        Insert: {
          atualizado_em?: string | null
          id?: string
          notificacoes?: boolean | null
          tema?: string | null
          user_id?: string | null
        }
        Update: {
          atualizado_em?: string | null
          id?: string
          notificacoes?: boolean | null
          tema?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "preferencias_usuarios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "preferencias_usuarios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "preferencias_usuarios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_pendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "preferencias_usuarios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_recusados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "preferencias_usuarios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "wallets_ativas"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "preferencias_usuarios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "wallets_com_usuarios"
            referencedColumns: ["user_id"]
          },
        ]
      }
      propostas_financiamento: {
        Row: {
          ano_veiculo: number
          codigo_proposta: string
          created_at: string | null
          id: string
          parcelas: number
          status: string | null
          user_id: string | null
          valor_entrada: number
          valor_parcela: number
          veiculo: string
        }
        Insert: {
          ano_veiculo: number
          codigo_proposta: string
          created_at?: string | null
          id?: string
          parcelas: number
          status?: string | null
          user_id?: string | null
          valor_entrada: number
          valor_parcela: number
          veiculo: string
        }
        Update: {
          ano_veiculo?: number
          codigo_proposta?: string
          created_at?: string | null
          id?: string
          parcelas?: number
          status?: string | null
          user_id?: string | null
          valor_entrada?: number
          valor_parcela?: number
          veiculo?: string
        }
        Relationships: []
      }
      relatorios_gerados: {
        Row: {
          gerado_em: string | null
          gerado_por: string | null
          id: string
          tipo: string | null
          url_pdf: string | null
        }
        Insert: {
          gerado_em?: string | null
          gerado_por?: string | null
          id?: string
          tipo?: string | null
          url_pdf?: string | null
        }
        Update: {
          gerado_em?: string | null
          gerado_por?: string | null
          id?: string
          tipo?: string | null
          url_pdf?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "relatorios_gerados_gerado_por_fkey"
            columns: ["gerado_por"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relatorios_gerados_gerado_por_fkey"
            columns: ["gerado_por"]
            isOneToOne: false
            referencedRelation: "usuarios_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relatorios_gerados_gerado_por_fkey"
            columns: ["gerado_por"]
            isOneToOne: false
            referencedRelation: "usuarios_pendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relatorios_gerados_gerado_por_fkey"
            columns: ["gerado_por"]
            isOneToOne: false
            referencedRelation: "usuarios_recusados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relatorios_gerados_gerado_por_fkey"
            columns: ["gerado_por"]
            isOneToOne: false
            referencedRelation: "wallets_ativas"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "relatorios_gerados_gerado_por_fkey"
            columns: ["gerado_por"]
            isOneToOne: false
            referencedRelation: "wallets_com_usuarios"
            referencedColumns: ["user_id"]
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
          {
            foreignKeyName: "suporte_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "wallets_ativas"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "suporte_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "wallets_com_usuarios"
            referencedColumns: ["user_id"]
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
            foreignKeyName: "transactions_from_user_fkey"
            columns: ["from_user"]
            isOneToOne: false
            referencedRelation: "wallets_ativas"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "transactions_from_user_fkey"
            columns: ["from_user"]
            isOneToOne: false
            referencedRelation: "wallets_com_usuarios"
            referencedColumns: ["user_id"]
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
            foreignKeyName: "transactions_to_user_fkey"
            columns: ["to_user"]
            isOneToOne: false
            referencedRelation: "wallets_ativas"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "transactions_to_user_fkey"
            columns: ["to_user"]
            isOneToOne: false
            referencedRelation: "wallets_com_usuarios"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets_ativas"
            referencedColumns: ["wallet_id"]
          },
          {
            foreignKeyName: "transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets_com_usuarios"
            referencedColumns: ["wallet_id"]
          },
        ]
      }
      transferencias: {
        Row: {
          criado_em: string | null
          de_user: string | null
          id: string
          para_user: string | null
          valor: number | null
        }
        Insert: {
          criado_em?: string | null
          de_user?: string | null
          id?: string
          para_user?: string | null
          valor?: number | null
        }
        Update: {
          criado_em?: string | null
          de_user?: string | null
          id?: string
          para_user?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transferencias_de_user_fkey"
            columns: ["de_user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transferencias_de_user_fkey"
            columns: ["de_user"]
            isOneToOne: false
            referencedRelation: "usuarios_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transferencias_de_user_fkey"
            columns: ["de_user"]
            isOneToOne: false
            referencedRelation: "usuarios_pendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transferencias_de_user_fkey"
            columns: ["de_user"]
            isOneToOne: false
            referencedRelation: "usuarios_recusados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transferencias_de_user_fkey"
            columns: ["de_user"]
            isOneToOne: false
            referencedRelation: "wallets_ativas"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "transferencias_de_user_fkey"
            columns: ["de_user"]
            isOneToOne: false
            referencedRelation: "wallets_com_usuarios"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "transferencias_para_user_fkey"
            columns: ["para_user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transferencias_para_user_fkey"
            columns: ["para_user"]
            isOneToOne: false
            referencedRelation: "usuarios_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transferencias_para_user_fkey"
            columns: ["para_user"]
            isOneToOne: false
            referencedRelation: "usuarios_pendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transferencias_para_user_fkey"
            columns: ["para_user"]
            isOneToOne: false
            referencedRelation: "usuarios_recusados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transferencias_para_user_fkey"
            columns: ["para_user"]
            isOneToOne: false
            referencedRelation: "wallets_ativas"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "transferencias_para_user_fkey"
            columns: ["para_user"]
            isOneToOne: false
            referencedRelation: "wallets_com_usuarios"
            referencedColumns: ["user_id"]
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
      veiculos_pro_motors: {
        Row: {
          ano: number
          ativo: boolean | null
          id: string
          marca: string
          modelo: string
          preco: number
        }
        Insert: {
          ano: number
          ativo?: boolean | null
          id?: string
          marca: string
          modelo: string
          preco: number
        }
        Update: {
          ano?: number
          ativo?: boolean | null
          id?: string
          marca?: string
          modelo?: string
          preco?: number
        }
        Relationships: []
      }
      wallets: {
        Row: {
          atualizado_em: string | null
          created_at: string | null
          id: string
          limite: number | null
          motivo_bloq: string | null
          rendimento_mes: number | null
          saldo: number | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          atualizado_em?: string | null
          created_at?: string | null
          id?: string
          limite?: number | null
          motivo_bloq?: string | null
          rendimento_mes?: number | null
          saldo?: number | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          atualizado_em?: string | null
          created_at?: string | null
          id?: string
          limite?: number | null
          motivo_bloq?: string | null
          rendimento_mes?: number | null
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
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "wallets_ativas"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "wallets_com_usuarios"
            referencedColumns: ["user_id"]
          },
        ]
      }
      wallets_cripto_binance: {
        Row: {
          atualizado_em: string | null
          cotacao: number | null
          id: string
          moeda: string | null
          saldo_crypto: number | null
          saldo_em_brl: number | null
          subaccount_email: string | null
          user_id: string | null
        }
        Insert: {
          atualizado_em?: string | null
          cotacao?: number | null
          id?: string
          moeda?: string | null
          saldo_crypto?: number | null
          saldo_em_brl?: number | null
          subaccount_email?: string | null
          user_id?: string | null
        }
        Update: {
          atualizado_em?: string | null
          cotacao?: number | null
          id?: string
          moeda?: string | null
          saldo_crypto?: number | null
          saldo_em_brl?: number | null
          subaccount_email?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallets_cripto_binance_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallets_cripto_binance_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallets_cripto_binance_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_pendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallets_cripto_binance_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_recusados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallets_cripto_binance_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "wallets_ativas"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "wallets_cripto_binance_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "wallets_com_usuarios"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      extrato_binance: {
        Row: {
          data: string | null
          id: string | null
          moeda: string | null
          status: string | null
          tipo: string | null
          user_id: string | null
          valor: number | null
        }
        Insert: {
          data?: string | null
          id?: string | null
          moeda?: string | null
          status?: string | null
          tipo?: string | null
          user_id?: string | null
          valor?: number | null
        }
        Update: {
          data?: string | null
          id?: string | null
          moeda?: string | null
          status?: string | null
          tipo?: string | null
          user_id?: string | null
          valor?: number | null
        }
        Relationships: []
      }
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
          cpf_cnpj: string | null
          created_at: string | null
          email: string | null
          id: string | null
          nome: string | null
          nome_completo: string | null
          role: string | null
          status: string | null
          telefone: string | null
          tipo: string | null
        }
        Insert: {
          cpf?: string | null
          cpf_cnpj?: string | null
          created_at?: string | null
          email?: string | null
          id?: string | null
          nome?: string | null
          nome_completo?: string | null
          role?: string | null
          status?: string | null
          telefone?: string | null
          tipo?: string | null
        }
        Update: {
          cpf?: string | null
          cpf_cnpj?: string | null
          created_at?: string | null
          email?: string | null
          id?: string | null
          nome?: string | null
          nome_completo?: string | null
          role?: string | null
          status?: string | null
          telefone?: string | null
          tipo?: string | null
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
        Relationships: []
      }
      wallets_com_usuarios: {
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
        Relationships: []
      }
    }
    Functions: {
      comprar_giftcard: {
        Args: { p_user: string; p_servico: string; p_valor: number }
        Returns: string
      }
      enviar_pix: {
        Args: { p_origem: string; p_destino: string; p_valor: number }
        Returns: string
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      registrar_pagamento: {
        Args: {
          p_user: string
          p_tipo: string
          p_descricao: string
          p_valor: number
          p_vencimento: string
        }
        Returns: string
      }
      registrar_transacao: {
        Args: {
          p_user: string
          p_tipo: string
          p_descricao: string
          p_valor: number
        }
        Returns: string
      }
      sync_all_users: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      transferir_saldo: {
        Args: { p_de: string; p_para: string; p_valor: number }
        Returns: string
      }
      upsert_usuario_admin: {
        Args: {
          p_email: string
          p_nome: string
          p_nome_completo: string
          p_cpf: string
          p_cpf_cnpj: string
          p_telefone: string
          p_status?: string
          p_role?: string
          p_tipo?: string
          p_senha?: string
        }
        Returns: undefined
      }
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
