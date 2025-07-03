
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, Send, QrCode, History, CreditCard, 
  Mail, Hash, Key, UserCheck, Eye, EyeOff,
  CheckCircle, XCircle, Clock, Copy
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

interface PixTransaction {
  id: string;
  origem_id: string;
  destino_id: string;
  valor: number;
  tipo_chave: string;
  chave_pix: string;
  descricao: string;
  status: string;
  created_at: string;
  origem_nome?: string;
  destino_nome?: string;
}

const AdminPix = () => {
  const [pixData, setPixData] = useState({
    remetente: '',
    tipo_chave: '',
    chave: '',
    valor: '',
    descricao: ''
  });
  const [loading, setLoading] = useState(false);
  const [showChaveValue, setShowChaveValue] = useState(false);

  // Fetch usuários ativos para seleção
  const { data: usuarios = [] } = useQuery({
    queryKey: ['usuarios_pix'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, nome_completo, email, cpf_cnpj')
        .eq('status', 'ativo')
        .order('nome_completo');

      if (error) throw error;
      return data;
    }
  });

  // Fetch histórico de transações PIX
  const { data: transacoesPix = [], refetch: refetchTransacoes } = useQuery({
    queryKey: ['transacoes_pix'],
    queryFn: async () => {
      // Simulação de dados - substitua pela query real quando implementar
      return [
        {
          id: '1',
          origem_id: 'user1',
          destino_id: 'user2',
          valor: 250.00,
          tipo_chave: 'email',
          chave_pix: 'joao@email.com',
          descricao: 'Pagamento serviços',
          status: 'concluido',
          created_at: new Date().toISOString(),
          origem_nome: 'João Silva',
          destino_nome: 'Maria Santos'
        },
        {
          id: '2',
          origem_id: 'user2',
          destino_id: 'user3',
          valor: 100.00,
          tipo_chave: 'telefone',
          chave_pix: '11999999999',
          descricao: 'Transferência',
          status: 'concluido',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          origem_nome: 'Maria Santos',
          destino_nome: 'Carlos Lima'
        }
      ] as PixTransaction[];
    }
  });

  const tiposChave = [
    { value: 'cpf', label: 'CPF', icon: UserCheck, placeholder: '000.000.000-00', mask: '###.###.###-##' },
    { value: 'cnpj', label: 'CNPJ', icon: UserCheck, placeholder: '00.000.000/0000-00', mask: '##.###.###/####-##' },
    { value: 'email', label: 'E-mail', icon: Mail, placeholder: 'exemplo@email.com', mask: null },
    { value: 'telefone', label: 'Telefone', icon: Smartphone, placeholder: '(11) 99999-9999', mask: '(##) #####-####' },
    { value: 'aleatoria', label: 'Chave Aleatória', icon: Key, placeholder: 'Chave de 32 caracteres', mask: null }
  ];

  const handleEnviarPix = async () => {
    if (!pixData.remetente || !pixData.tipo_chave || !pixData.chave || !pixData.valor) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (parseFloat(pixData.valor) <= 0) {
      toast.error('O valor deve ser maior que zero');
      return;
    }

    setLoading(true);
    try {
      // Simulação de envio - implementar com API real
      console.log('Enviando PIX:', pixData);
      
      // Aqui você implementaria a chamada real para a API
      // const { data, error } = await supabase.rpc('enviar_pix', { ... });
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simular delay
      
      toast.success('PIX enviado com sucesso!');
      
      // Limpar formulário
      setPixData({
        remetente: '',
        tipo_chave: '',
        chave: '',
        valor: '',
        descricao: ''
      });
      
      // Atualizar histórico
      refetchTransacoes();
      
    } catch (error) {
      console.error('Erro ao enviar PIX:', error);
      toast.error('Erro ao enviar PIX');
    } finally {
      setLoading(false);
    }
  };

  const formatarChave = (valor: string, tipoChave: string) => {
    const tipo = tiposChave.find(t => t.value === tipoChave);
    if (!tipo?.mask) return valor;
    
    // Implementar máscaras simples
    switch (tipoChave) {
      case 'cpf':
        return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      case 'cnpj':
        return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
      case 'telefone':
        return valor.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      default:
        return valor;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluido':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pendente':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'cancelado':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluido':
        return 'bg-green-100 text-green-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">PIX Administrativo</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie transações PIX do sistema</p>
        </div>
      </div>

      <Tabs defaultValue="enviar" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="enviar">Enviar PIX</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="enviar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulário de Envio */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Enviar PIX
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="remetente">Usuário Remetente *</Label>
                  <Select value={pixData.remetente} onValueChange={(value) => setPixData({...pixData, remetente: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar usuário" />
                    </SelectTrigger>
                    <SelectContent>
                      {usuarios.map((usuario) => (
                        <SelectItem key={usuario.id} value={usuario.id}>
                          {usuario.nome_completo} - {usuario.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tipo_chave">Tipo de Chave PIX *</Label>
                  <Select value={pixData.tipo_chave} onValueChange={(value) => setPixData({...pixData, tipo_chave: value, chave: ''})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar tipo de chave" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposChave.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          <div className="flex items-center gap-2">
                            <tipo.icon className="h-4 w-4" />
                            {tipo.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {pixData.tipo_chave && (
                  <div>
                    <Label htmlFor="chave">
                      Chave PIX ({tiposChave.find(t => t.value === pixData.tipo_chave)?.label}) *
                    </Label>
                    <div className="relative">
                      <Input
                        id="chave"
                        type={pixData.tipo_chave === 'aleatoria' && !showChaveValue ? 'password' : 'text'}
                        placeholder={tiposChave.find(t => t.value === pixData.tipo_chave)?.placeholder}
                        value={pixData.chave}
                        onChange={(e) => setPixData({...pixData, chave: e.target.value})}
                      />
                      {pixData.tipo_chave === 'aleatoria' && (
                        <button
                          type="button"
                          onClick={() => setShowChaveValue(!showChaveValue)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showChaveValue ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {pixData.tipo_chave === 'cpf' && 'Digite apenas números (11 dígitos)'}
                      {pixData.tipo_chave === 'cnpj' && 'Digite apenas números (14 dígitos)'}
                      {pixData.tipo_chave === 'telefone' && 'Digite com DDD (11 dígitos)'}
                      {pixData.tipo_chave === 'email' && 'Digite um e-mail válido'}
                      {pixData.tipo_chave === 'aleatoria' && 'Chave de 32 caracteres alfanuméricos'}
                    </p>
                  </div>
                )}

                <div>
                  <Label htmlFor="valor">Valor (R$) *</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0,00"
                    value={pixData.valor}
                    onChange={(e) => setPixData({...pixData, valor: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição (opcional)</Label>
                  <Input
                    id="descricao"
                    placeholder="Descrição da transferência"
                    value={pixData.descricao}
                    onChange={(e) => setPixData({...pixData, descricao: e.target.value})}
                  />
                </div>

                <Button 
                  className="w-full flex items-center gap-2" 
                  onClick={handleEnviarPix}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Smartphone className="h-4 w-4" />
                  )}
                  {loading ? 'Enviando...' : 'Enviar PIX'}
                </Button>
              </CardContent>
            </Card>

            {/* Preview da Transação */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Preview da Transação
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pixData.remetente && pixData.tipo_chave && pixData.chave && pixData.valor ? (
                  <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Remetente:</span>
                      <span className="font-medium">
                        {usuarios.find(u => u.id === pixData.remetente)?.nome_completo || 'Não selecionado'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tipo de Chave:</span>
                      <Badge variant="secondary">
                        {tiposChave.find(t => t.value === pixData.tipo_chave)?.label}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Chave PIX:</span>
                      <span className="font-mono text-sm">
                        {pixData.tipo_chave === 'aleatoria' && !showChaveValue 
                          ? '•'.repeat(Math.min(pixData.chave.length, 32))
                          : formatarChave(pixData.chave, pixData.tipo_chave)
                        }
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Valor:</span>
                      <span className="font-bold text-lg text-green-600">
                        R$ {parseFloat(pixData.valor || '0').toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    
                    {pixData.descricao && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Descrição:</span>
                        <span className="text-sm">{pixData.descricao}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <QrCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Preencha os dados para visualizar o preview</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="historico" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Histórico de Transações PIX
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transacoesPix.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma transação PIX encontrada</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transacoesPix.map((transacao) => (
                    <div key={transacao.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(transacao.status)}
                          <span className="font-medium">{transacao.origem_nome} → {transacao.destino_nome}</span>
                        </div>
                        <Badge className={getStatusColor(transacao.status)}>
                          {transacao.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Valor:</span>
                          <p className="font-semibold text-green-600">
                            R$ {transacao.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        
                        <div>
                          <span className="text-gray-600">Tipo de Chave:</span>
                          <p className="font-medium">
                            {tiposChave.find(t => t.value === transacao.tipo_chave)?.label}
                          </p>
                        </div>
                        
                        <div>
                          <span className="text-gray-600">Chave PIX:</span>
                          <div className="flex items-center gap-1">
                            <p className="font-mono text-xs truncate max-w-24">
                              {formatarChave(transacao.chave_pix, transacao.tipo_chave)}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(transacao.chave_pix)}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-gray-600">Data/Hora:</span>
                          <p className="text-xs">
                            {new Date(transacao.created_at).toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      
                      {transacao.descricao && (
                        <div className="mt-2 pt-2 border-t">
                          <span className="text-gray-600 text-sm">Descrição:</span>
                          <p className="text-sm">{transacao.descricao}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuracoes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  Configurações PIX
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                  <QrCode className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">QR Code PIX Dinâmico</p>
                  <p className="text-xs text-gray-500 mb-4">Gere QR Codes para recebimentos</p>
                  <Button variant="outline">
                    Gerar QR Code
                  </Button>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Limites de Transação</h4>
                  <div className="space-y-2">
                    <div>
                      <Label>Limite Diário (R$)</Label>
                      <Input placeholder="5.000,00" />
                    </div>
                    <div>
                      <Label>Limite por Transação (R$)</Label>
                      <Input placeholder="1.000,00" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Chaves PIX Cadastradas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">admin@bancoPro.com</p>
                        <p className="text-xs text-gray-500">E-mail</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">+55 11 99999-9999</p>
                        <p className="text-xs text-gray-500">Telefone</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium">***.***.***-**</p>
                        <p className="text-xs text-gray-500">CPF</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  <Key className="h-4 w-4 mr-2" />
                  Cadastrar Nova Chave
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPix;
