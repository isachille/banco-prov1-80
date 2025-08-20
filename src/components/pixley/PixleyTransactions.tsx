import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RefreshCw, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PixleyTransaction {
  id: string;
  transaction_id: string;
  type: string;
  source_currency: string;
  source_amount: number;
  target_currency: string;
  target_amount: number;
  status: string;
  qr_code: string;
  tx_hash: string;
  explorer_url: string;
  created_at: string;
  updated_at: string;
}

export const PixleyTransactions = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<PixleyTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState<string | null>(null);

  const loadTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('pixley_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar transações:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar transações',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshStatus = async (transactionId: string) => {
    setRefreshing(transactionId);
    try {
      const { data, error } = await supabase.functions.invoke(`pixley-transaction-status/${transactionId}`, {
        method: 'GET'
      });

      if (error) throw error;

      if (data.status === 'success') {
        await loadTransactions();
        toast({
          title: 'Status atualizado',
          description: 'Status da transação foi atualizado',
        });
      }
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar status da transação',
        variant: 'destructive',
      });
    } finally {
      setRefreshing(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'bg-green-500';
      case 'pending':
      case 'processing':
        return 'bg-yellow-500';
      case 'failed':
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'Concluído';
      case 'success':
        return 'Sucesso';
      case 'pending':
        return 'Pendente';
      case 'processing':
        return 'Processando';
      case 'failed':
        return 'Falhou';
      case 'error':
        return 'Erro';
      default:
        return status;
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Histórico de Transações Pixley</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhuma transação encontrada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={transaction.type === 'on-ramp' ? 'default' : 'secondary'}>
                        {transaction.type === 'on-ramp' ? 'Compra' : 'Venda'}
                      </Badge>
                      <Badge className={getStatusColor(transaction.status)}>
                        {getStatusText(transaction.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono">
                      ID: {transaction.transaction_id}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refreshStatus(transaction.transaction_id)}
                      disabled={refreshing === transaction.transaction_id}
                    >
                      {refreshing === transaction.transaction_id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                    </Button>
                    {transaction.explorer_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(transaction.explorer_url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">De</p>
                    <p className="font-medium">
                      {transaction.source_amount} {transaction.source_currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Para</p>
                    <p className="font-medium">
                      {transaction.target_amount} {transaction.target_currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Criado em</p>
                    <p className="font-medium">
                      {format(new Date(transaction.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Atualizado em</p>
                    <p className="font-medium">
                      {format(new Date(transaction.updated_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </p>
                  </div>
                </div>

                {transaction.tx_hash && (
                  <div className="mt-3 p-2 bg-muted/50 rounded text-sm">
                    <p className="text-muted-foreground">Hash da Transação:</p>
                    <p className="font-mono break-all">{transaction.tx_hash}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};