
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Smartphone, Banknote, FileText, History } from 'lucide-react';

const Extrato = () => {
  const [filters, setFilters] = useState({
    tipo: '',
    periodo: '7',
    dataInicio: '',
    dataFim: ''
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock user data
  const userId = "123";
  const token = "mock-token";

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // Em produção seria:
      // const params = new URLSearchParams();
      // if (filters.tipo) params.append('filtro', filters.tipo);
      // if (filters.dataInicio) params.append('data_de', filters.dataInicio);
      // if (filters.dataFim) params.append('data_ate', filters.dataFim);
      
      // const response = await fetch(`https://seu-xano.com/api/transactions/user/${userId}?${params}`, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      // const data = await response.json();

      // Mock data por enquanto
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockTransactions = [
        {
          id: 1,
          tipo: 'pix',
          valor: -150.50,
          descricao: 'Transferência Pix',
          data: '2024-01-15T10:30:00',
          status: 'concluido'
        },
        {
          id: 2,
          tipo: 'ted',
          valor: -500.00,
          descricao: 'TED para conta corrente',
          data: '2024-01-14T14:20:00',
          status: 'concluido'
        },
        {
          id: 3,
          tipo: 'cobranca',
          valor: 300.00,
          descricao: 'Cobrança recebida',
          data: '2024-01-13T09:15:00',
          status: 'concluido'
        }
      ];
      
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'pix':
        return <Smartphone className="w-5 h-5" />;
      case 'ted':
        return <Banknote className="w-5 h-5" />;
      case 'cobranca':
        return <FileText className="w-5 h-5" />;
      default:
        return <History className="w-5 h-5" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(value));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-inter p-4">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
        <h1 className="text-xl font-bold text-[#1F1F1F] mb-6">Extrato</h1>
        
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <Label htmlFor="tipo" className="text-[#1F1F1F] font-medium">
              Tipo de transação
            </Label>
            <Select value={filters.tipo} onValueChange={(value) => setFilters(prev => ({ ...prev, tipo: value }))}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os tipos</SelectItem>
                <SelectItem value="pix">Pix</SelectItem>
                <SelectItem value="ted">TED</SelectItem>
                <SelectItem value="cobranca">Cobrança</SelectItem>
                <SelectItem value="taxa">Taxa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="periodo" className="text-[#1F1F1F] font-medium">
              Período
            </Label>
            <Select value={filters.periodo} onValueChange={(value) => setFilters(prev => ({ ...prev, periodo: value }))}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filters.periodo === 'custom' && (
            <>
              <div>
                <Label htmlFor="dataInicio" className="text-[#1F1F1F] font-medium">
                  Data início
                </Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={filters.dataInicio}
                  onChange={(e) => setFilters(prev => ({ ...prev, dataInicio: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dataFim" className="text-[#1F1F1F] font-medium">
                  Data fim
                </Label>
                <Input
                  id="dataFim"
                  type="date"
                  value={filters.dataFim}
                  onChange={(e) => setFilters(prev => ({ ...prev, dataFim: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Lista de transações */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-[#1F1F1F] mb-4">Transações</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-pulse text-[#1F1F1F]">Carregando transações...</div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-[#1F1F1F]/60">
            Nenhuma transação encontrada
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#D4E4FF] rounded-full text-[#0057FF]">
                    {getIcon(transaction.tipo)}
                  </div>
                  <div>
                    <div className="font-medium text-[#1F1F1F]">{transaction.descricao}</div>
                    <div className="text-sm text-[#1F1F1F]/60">
                      {formatDate(transaction.data)} • {transaction.status}
                    </div>
                  </div>
                </div>
                <div className={`font-semibold ${transaction.valor > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.valor > 0 ? '+' : '-'}{formatCurrency(transaction.valor)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Extrato;
