
# API do Aplicativo Financeiro

Esta é a documentação da API própria do aplicativo, que substitui a integração com a Efí Bank.

## Base URL
```
https://fjyeqltwvlhexgncudpz.supabase.co/functions/v1/
```

## Autenticação
Todas as requisições precisam incluir o header:
```
Authorization: Bearer <TOKEN_DO_USUARIO>
```

---

## 1. Cadastro de Conta

**Endpoint:** `POST /api-cadastro-conta`

**Descrição:** Cria uma nova subconta para o usuário

**Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "cpf": "12345678901",
  "telefone": "11999999999",
  "data_nascimento": "1990-01-01"
}
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Conta criada com sucesso!",
  "subconta_id": "uuid-da-subconta",
  "id_conta": "conta_1641234567890"
}
```

**Resposta de Erro:**
```json
{
  "success": false,
  "error": "Mensagem de erro"
}
```

---

## 2. Criar Transação

**Endpoint:** `POST /api-transacoes`

**Descrição:** Registra uma nova transação (PIX, Boleto ou TED)

**Body:**
```json
{
  "tipo": "pix", // "pix" | "boleto" | "ted"
  "valor": 100.00,
  "taxa_efi": 2.50,
  "taxa_sua": 1.00,
  "descricao": "Pagamento via PIX"
}
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Transação criada com sucesso!",
  "transacao": {
    "id": "uuid-da-transacao",
    "tipo": "pix",
    "valor": 100.00,
    "taxa_efi": 2.50,
    "taxa_sua": 1.00,
    "lucro": 96.50,
    "status": "concluida",
    "criada_em": "2025-01-07T20:00:00Z"
  }
}
```

---

## 3. Dashboard/Relatórios

**Endpoint:** `GET /api-dashboard`

**Descrição:** Retorna dados consolidados para o painel financeiro

**Resposta de Sucesso:**
```json
{
  "success": true,
  "data": {
    "totalTransacoes": 25,
    "valorTotal": 15750.00,
    "lucroTotal": 1890.50,
    "transacoesPorMes": [
      {
        "mes": "11/2024",
        "lucro": 650.25,
        "transacoes": 8
      },
      {
        "mes": "12/2024", 
        "lucro": 890.50,
        "transacoes": 12
      }
    ],
    "transacoesRecentes": [
      {
        "id": "uuid",
        "tipo": "pix",
        "valor": 100.00,
        "lucro": 96.50,
        "criada_em": "2025-01-07T20:00:00Z"
      }
    ]
  }
}
```

---

## Estrutura do Banco de Dados

### Tabela: subcontas
```sql
- id (UUID) - Primary Key
- nome (TEXT) - Nome completo
- email (TEXT) - Email único
- cpf (TEXT) - CPF único
- telefone (TEXT) - Telefone
- data_nascimento (DATE) - Data de nascimento
- id_efi (TEXT) - ID interno da conta
- user_id (UUID) - Referência ao usuário autenticado
- criada_em (TIMESTAMP) - Data de criação
- atualizada_em (TIMESTAMP) - Data de atualização
```

### Tabela: transacoes
```sql
- id (UUID) - Primary Key
- subconta_id (UUID) - Referência à subconta
- tipo (TEXT) - Tipo: 'pix', 'boleto', 'ted'
- valor (DECIMAL) - Valor da transação
- taxa_efi (DECIMAL) - Taxa cobrada
- taxa_sua (DECIMAL) - Taxa própria
- lucro (DECIMAL) - Calculado automaticamente (valor - taxa_efi - taxa_sua)
- descricao (TEXT) - Descrição opcional
- status (TEXT) - Status da transação
- criada_em (TIMESTAMP) - Data de criação
- data (DATE) - Data extraída automaticamente para agrupamentos
```

---

## Como Usar

1. **Autenticar o usuário** no app
2. **Cadastrar uma subconta** usando `/api-cadastro-conta`
3. **Criar transações** usando `/api-transacoes`
4. **Visualizar relatórios** usando `/api-dashboard`

## Códigos de Status HTTP

- `200` - Sucesso
- `400` - Erro na requisição (dados inválidos)
- `401` - Não autorizado (token inválido)
- `500` - Erro interno do servidor

## Notas Importantes

- Todos os valores monetários estão em formato decimal (ex: 100.00)
- Datas seguem o padrão ISO 8601
- O campo `lucro` é calculado automaticamente no banco de dados
- Todas as operações respeitam as políticas de segurança (RLS) do Supabase

---

Para mais informações ou dúvidas sobre a integração, entre em contato com a equipe de desenvolvimento.
