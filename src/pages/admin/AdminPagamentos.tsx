
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Receipt, Search, Filter, CheckCircle, XCircle, Clock, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminPagamentos = () => {
  const { toast } = useToast();
  const [filtros, setFiltros] = useState({
    status: '',
    periodo: '',
    busca: ''
  });
  
  const [novoPagamento, setNovoPagamento] = useState({
    tipo: '',
    descricao: '',
    valor: '',
    vencimento: ''
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleRegistrarPagamento = async () => {
    if (!novoPagamento.tipo || !novoPagamento.descricao || !novoPagamento.valor || !novoPagamento.vencimento) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: authUser } = await supabase.auth.getUser();
      if (!authUser.user) {
        throw new Error('Usuário não autenticado');
      }

      // Simular registro de pagamento
      console.log('Registrando pagamento:', {
        user_id: authUser.user.id,
        tipo: novoPagamento.tipo,
        descricao: novoPagamento.descricao,
        valor: parseFloat(novoPagamento.valor),
        vencimento: novoPagamento.vencimento
      });

      toast({
        title: "Sucesso",
        description: "Pagamento registrado com sucesso!"
      });

      // Limpar formulário
      setNovoPagamento({
        tipo: '',
        descricao: '',
        valor: '',
        vencimento: ''
      });
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      toast({
        title: "Erro",
        description: "Erro ao registrar pagamento.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const pagamentos = [
    {
      id: '1',
      codigo: 'BOL001',
      beneficiario: 'João Silva',
      valor: 450.00,
      vencimento: '2024-01-20',
      status: 'Pendente',
      tipo: 'Boleto'
    },
    {
      id: '2',
      codigo: 'PIX002',
      beneficiario: 'Maria Santos',
      valor: 200.00,
      vencimento: '2024-01-18',
      status: 'Pago',
      tipo: 'PIX'
    },
    {
      id: '3',
      codigo: 'BOL003',
      beneficiario: 'Carlos Lima',
      valor: 680.00,
      vencimento: '2024-01-15',
      status: 'Vencido',
      tipo: 'Boleto'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pago': return 'bg-green-100 text-green-800';
      case 'Pendente': return 'bg-yellow-100 text-yellow-800';
      case 'Vencido': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pago': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Pendente': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'Vencido': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pagamentos</h1>
      </div>

      {/* Novo Pagamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Registrar Novo Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tipo</label>
              <Select value={novoPagamento.tipo} onValueChange={(value) => setNovoPagamento({...novoPagamento, tipo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boleto">Boleto</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="ted">TED</SelectItem>
                  <SelectItem value="cartao">Cartão</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Descrição</label>
              <Input
                placeholder="Descrição do pagamento"
                value={novoPagamento.descricao}
                onChange={(e) => setNovoPagamento({...novoPagamento, descricao: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Valor (R$)</label>
              <Input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={novoPagamento.valor}
                onChange={(e) => setNovoPagamento({...novoPagamento, valor: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Vencimento</label>
              <Input
                type="date"
                value={novoPagamento.vencimento}
                onChange={(e) => setNovoPagamento({...novoPagamento, vencimento: e.target.value})}
              />
            </div>
          </div>
          
          <div className="mt-4">
            <Button 
              onClick={handleRegistrarPagamento}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {loading ? 'Registrando...' : 'Registrar Pagamento'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pendente</p>
                <p className="text-2xl font-bold text-yellow-600">R$ 1.130,00</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pago</p>
                <p className="text-2xl font-bold text-green-600">R$ 200,00</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Vencido</p>
                <p className="text-2xl font-bold text-red-600">R$ 680,00</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Geral</p>
                <p className="text-2xl font-bold">R$ 2.010,00</p>
              </div>
              <Receipt className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select value={filtros.status} onValueChange={(value) => setFiltros({...filtros, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="vencido">Vencido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Período</label>
              <Select value={filtros.periodo} onValueChange={(value) => setFiltros({...filtros, periodo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hoje">Hoje</SelectItem>
                  <SelectItem value="semana">Esta semana</SelectItem>
                  <SelectItem value="mes">Este mês</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Código ou beneficiário..."
                  value={filtros.busca}
                  onChange={(e) => setFiltros({...filtros, busca: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-end">
              <Button className="w-full">Aplicar Filtros</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Pagamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Código</th>
                  <th className="text-left p-4 font-medium">Beneficiário</th>
                  <th className="text-left p-4 font-medium">Valor</th>
                  <th className="text-left p-4 font-medium">Vencimento</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Tipo</th>
                  <th className="text-left p-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {pagamentos.map((pagamento) => (
                  <tr key={pagamento.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-4 font-mono">{pagamento.codigo}</td>
                    <td className="p-4">{pagamento.beneficiario}</td>
                    <td className="p-4 font-semibold">R$ {pagamento.valor.toFixed(2)}</td>
                    <td className="p-4">{pagamento.vencimento}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(pagamento.status)}
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(pagamento.status)}`}>
                          {pagamento.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {pagamento.tipo}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Ver</Button>
                        {pagamento.status === 'Pendente' && (
                          <Button size="sm">Pagar</Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPagamentos;
