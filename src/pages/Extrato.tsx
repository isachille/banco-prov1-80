
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpRight, ArrowDownLeft, Smartphone, Building, FileText, DollarSign } from 'lucide-react';

interface Transaction {
  id: string;
  tipo: 'Pix' | 'TED' | 'P2P' | 'cobranca' | 'taxa';
  valor: number;
  data: string;
  status: 'Concluído' | 'Pendente' | 'Cancelado';
  entrada: boolean;
  descricao: string;
}

const Extrato = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    tipo: '',
    periodo: '30',
    dataInicio: '',
    dataFim: ''
  });

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
      // 
      // const response = await fetch(`https://seu-xano.com/api/transactions/user/${userId}?${params}`, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      // const data = await response.json();

      // Mock data
      setTimeout(() => {
        setTransactions([
          {
            id: '1',
            tipo: 'Pix',
            valor: 250.00,
            data: '2024-01-15T10:30:00',
            status: 'Concluído',
            entrada: false,
            descricao: 'Transferência para João Silva'
          },
          {
            id: '2',
            tipo: 'TED',
            valor: 1500.00,
            data: '2024-01-14T14:20:00',
            status: 'Concluído',
            entrada: true,
            descricao: 'Transferência recebida de Maria Santos'
          },
          {
            id: '3',
            tipo: 'P2P',
            valor: 75.50,
            data: '2024-01-13T09:15:00',
            status: 'Pendente',
            entrada: false,
            descricao: 'Pagamento para Pedro Lima'
          },
          {
            id: '4',
            tipo: 'cobranca',
            valor: 320.00,
            data: '2024-01-12T16:45:00',
            status: 'Concluído',
            entrada: true,
            descricao: 'Cobrança recebida'
          },
          {
            id: '5',
            tipo: 'taxa',
            valor: 12.50,
            data: '2024-01-11T11:00:00',
            status: 'Concluído',
            entrada: false,
            descricao: 'Taxa de manutenção'
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      setLoading(false);
    }
  };

  const getTransactionIcon = (tipo: string) => {
    switch (tipo) {
      case 'Pix': return Smartphone;
      case 'TED': return Building;
      case 'P2P': return ArrowUpRight;
      case 'cobranca': return FileText;
      case 'taxa': return DollarSign;
      default: return DollarSign;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluído': return 'text-green-600';
      case 'Pendente': return 'text-yellow-600';
      case 'Cancelado': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-[#1F1F1F] mb-6">Extrato</h1>
        
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
                <SelectItem value="Pix">Pix</SelectItem>
                <SelectItem value="TED">TED</SelectItem>
                <SelectItem value="P2P">P2P</SelectItem>
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
                <SelectItem value="90">Últimos 90 dias</SelectItem>
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

        {/* Lista de transações */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => {
              const Icon = getTransactionIcon(transaction.tipo);
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      transaction.entrada ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        transaction.entrada ? 'text-green-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-[#1F1F1F]">
                        {transaction.descricao}
                      </p>
                      <p className="text-sm text-gray-500">
                        {transaction.tipo} • {formatDate(transaction.data)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.entrada ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.entrada ? '+' : '-'} {formatCurrency(transaction.valor)}
                    </p>
                    <p className={`text-sm ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && transactions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhuma transação encontrada para os filtros selecionados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Extrato;
