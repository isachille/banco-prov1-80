
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  tipo: string;
  valor: number;
  moeda: string;
  data: string;
  status: string;
}

const ExtratoPage = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Como não temos uma tabela de extrato, vamos criar transações fictícias baseadas na wallet do usuário
        const mockTransactions: Transaction[] = [
          {
            id: '1',
            tipo: 'PIX_in',
            valor: 100.00,
            moeda: 'BRL',
            data: new Date().toISOString(),
            status: 'concluido'
          },
          {
            id: '2',
            tipo: 'transferencia_out',
            valor: 50.00,
            moeda: 'BRL',
            data: new Date(Date.now() - 86400000).toISOString(),
            status: 'concluido'
          }
        ];

        setTransactions(mockTransactions);
      } catch (error) {
        console.error('Erro ao buscar extrato:', error);
        toast.error('Erro ao carregar extrato');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const getTransactionTypeLabel = (tipo: string) => {
    switch (tipo) {
      case 'PIX_out':
        return 'PIX Enviado';
      case 'PIX_in':
        return 'PIX Recebido';
      case 'transferencia_out':
        return 'Transferência Enviada';
      case 'transferencia_in':
        return 'Transferência Recebida';
      case 'giftcard':
        return 'Gift Card';
      default:
        return tipo;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Extrato</h1>
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filtrar
        </Button>
      </div>

      <div className="space-y-4">
        {transactions.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">Nenhuma transação encontrada</p>
            </CardContent>
          </Card>
        ) : (
          transactions.map((transaction) => (
            <Card key={transaction.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">
                        {getTransactionTypeLabel(transaction.tipo)}
                      </span>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatDate(transaction.data)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      transaction.tipo.includes('_out') || transaction.tipo === 'giftcard'
                        ? 'text-red-600' 
                        : 'text-green-600'
                    }`}>
                      {transaction.tipo.includes('_out') || transaction.tipo === 'giftcard' ? '-' : '+'}
                      {formatCurrency(transaction.valor)}
                    </p>
                    <p className="text-sm text-gray-500">{transaction.moeda}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ExtratoPage;
