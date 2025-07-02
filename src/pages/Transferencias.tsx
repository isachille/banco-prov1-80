
import React, { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Transferencias = () => {
  const navigate = useNavigate();
  const [destinatario, setDestinatario] = useState('');
  const [valor, setValor] = useState('');
  const [moeda, setMoeda] = useState('BRL');
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    if (!destinatario || !valor) {
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

      // Verificar saldo
      const { data: walletData } = await supabase
        .from('binance_wallets')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      if (!walletData || walletData.balance < valorNumerico) {
        toast.error('Saldo insuficiente');
        return;
      }

      // Registrar transação
      const { error } = await supabase
        .from('binance_transactions')
        .insert({
          user_id: user.id,
          tipo: 'transferencia_out',
          valor: valorNumerico,
          moeda: moeda,
          destinatario: destinatario,
          status: 'concluido'
        });

      if (error) throw error;

      // Atualizar saldo
      await supabase
        .from('binance_wallets')
        .update({ balance: walletData.balance - valorNumerico })
        .eq('user_id', user.id);

      toast.success('Transferência realizada com sucesso!');
      setDestinatario('');
      setValor('');
    } catch (error) {
      console.error('Erro na transferência:', error);
      toast.error('Erro na transferência');
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
            <Send className="h-5 w-5" />
            <span>Nova Transferência</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="destinatario">Destinatário</Label>
            <Input
              id="destinatario"
              placeholder="ID ou email do destinatário"
              value={destinatario}
              onChange={(e) => setDestinatario(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="valor">Valor</Label>
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

          <div>
            <Label htmlFor="moeda">Moeda</Label>
            <Select value={moeda} onValueChange={setMoeda}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BRL">BRL - Real Brasileiro</SelectItem>
                <SelectItem value="USDT">USDT - Tether</SelectItem>
                <SelectItem value="BTC">BTC - Bitcoin</SelectItem>
              </SelectContent>
            </Select>
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
