
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Search, Filter, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminExtrato = () => {
  const { toast } = useToast();
  const [filtros, setFiltros] = useState({
    periodo: '',
    tipo: '',
    busca: ''
  });

  const [novaTransacao, setNovaTransacao] = useState({
    tipo: '',
    descricao: '',
    valor: ''
  });

  const [loading, setLoading] = useState(false);

  const handleRegistrarTransacao = async () => {
    if (!novaTransacao.tipo || !novaTransacao.descricao || !novaTransacao.valor) {
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

      // Simular registro de transação diretamente na carteira
      const valorNumerico = parseFloat(novaTransacao.valor);
      
      // Buscar carteira atual
      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('saldo')
        .eq('user_id', authUser.user.id)
        .single();

      if (walletError) {
        throw walletError;
      }

      // Determinar se é débito ou crédito baseado no tipo
      const isDebit = ['saque', 'transferencia', 'pix', 'compra'].includes(novaTransacao.tipo);
      const novoSaldo = isDebit 
        ? walletData.saldo - valorNumerico 
        : walletData.saldo + valorNumerico;

      // Atualizar saldo
      const { error: updateError } = await supabase
        .from('wallets')
        .update({ saldo: novoSaldo })
        .eq('user_id', authUser.user.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Sucesso",
        description: "Transação registrada."
      });

      // Limpar formulário
      setNovaTransacao({
        tipo: '',
        descricao: '',
        valor: ''
      });
    } catch (error) {
      console.error('Erro ao registrar transação:', error);
      toast({
        title: "Erro",
        description: "Erro ao registrar transação.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const transacoes = [
    {
      id: '1',
      data: '2024-01-15 14:30',
      descricao: 'Transferência PIX',
      tipo: 'PIX',
      valor: -250.00,
      saldo: 1750.00
    },
    {
      id: '2',
      data: '2024-01-15 10:15',
      descricao: 'Depósito',
      tipo: 'Depósito',
      valor: 1000.00,
      saldo: 2000.00
    },
    {
      id: '3',
      data: '2024-01-14 16:45',
      descricao: 'Compra Gift Card Netflix',
      tipo: 'Compra',
      valor: -49.90,
      saldo: 1000.00
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Extrato Administrativo</h1>
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar PDF
        </Button>
      </div>

      {/* Nova Transação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Registrar Transação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tipo</label>
              <Select value={novaTransacao.tipo} onValueChange={(value) => setNovaTransacao({...novaTransacao, tipo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deposito">Depósito</SelectItem>
                  <SelectItem value="saque">Saque</SelectItem>
                  <SelectItem value="transferencia">Transferência</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="compra">Compra</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Descrição</label>
              <Input
                placeholder="Descrição da transação"
                value={novaTransacao.descricao}
                onChange={(e) => setNovaTransacao({...novaTransacao, descricao: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Valor (R$)</label>
              <Input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={novaTransacao.valor}
                onChange={(e) => setNovaTransacao({...novaTransacao, valor: e.target.value})}
              />
            </div>
          </div>
          
          <div className="mt-4">
            <Button 
              onClick={handleRegistrarTransacao}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {loading ? 'Registrando...' : 'Registrar Transação'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Saldo Atual</p>
                <p className="text-2xl font-bold">R$ 1.750,00</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Entradas do Mês</p>
                <p className="text-2xl font-bold text-green-600">R$ 1.000,00</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Saídas do Mês</p>
                <p className="text-2xl font-bold text-red-600">R$ 299,90</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
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
              <label className="block text-sm font-medium mb-2">Tipo</label>
              <Select value={filtros.tipo} onValueChange={(value) => setFiltros({...filtros, tipo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="deposito">Depósito</SelectItem>
                  <SelectItem value="compra">Compra</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Descrição ou valor..."
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

      {/* Lista de Transações */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Data</th>
                  <th className="text-left p-4 font-medium">Descrição</th>
                  <th className="text-left p-4 font-medium">Tipo</th>
                  <th className="text-left p-4 font-medium">Valor</th>
                  <th className="text-left p-4 font-medium">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {transacoes.map((transacao) => (
                  <tr key={transacao.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-4">{transacao.data}</td>
                    <td className="p-4">{transacao.descricao}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {transacao.tipo}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`font-semibold ${transacao.valor > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transacao.valor > 0 ? '+' : ''}R$ {Math.abs(transacao.valor).toFixed(2)}
                      </span>
                    </td>
                    <td className="p-4 font-semibold">R$ {transacao.saldo.toFixed(2)}</td>
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

export default AdminExtrato;
