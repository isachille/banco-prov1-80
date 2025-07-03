
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Transferencias = () => {
  const navigate = useNavigate();
  const [contaDestino, setContaDestino] = useState('');
  const [valor, setValor] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    if (!contaDestino || !valor) {
      toast.error('Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Usuário não autenticado');
        return;
      }

      const valorNumerico = parseFloat(valor.replace(',', '.'));

      // Verificar saldo na tabela wallets
      const { data: walletData } = await supabase
        .from('wallets')
        .select('saldo')
        .eq('user_id', user.id)
        .single();

      if (!walletData || walletData.saldo < valorNumerico) {
        toast.error('Saldo insuficiente');
        return;
      }

      // Atualizar saldo na carteira
      const { error } = await supabase
        .from('wallets')
        .update({ saldo: walletData.saldo - valorNumerico })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Transferência realizada com sucesso!');
      setContaDestino('');
      setValor('');
    } catch (error) {
      console.error('Erro na transferência:', error);
      toast.error('Erro ao realizar transferência');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Transferências</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ArrowRight className="h-5 w-5" />
            <span>Nova Transferência</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="conta-destino">Conta de Destino</Label>
            <Input
              id="conta-destino"
              placeholder="Digite o número da conta ou CPF"
              value={contaDestino}
              onChange={(e) => setContaDestino(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="valor">Valor (R$)</Label>
            <Input
              id="valor"
              type="number"
              placeholder="0,00"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          <Button 
            className="w-full"
            onClick={handleTransfer}
            disabled={loading}
          >
            {loading ? 'Transferindo...' : 'Transferir'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transferencias;
