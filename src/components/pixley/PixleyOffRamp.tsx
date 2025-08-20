import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface OffRampData {
  withdrawal_id: string;
  status: string;
  estimated_amount_received: number;
  estimated_completion: string;
  message: string;
}

export const PixleyOffRamp = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    source_currency: 'USDT',
    source_amount: '',
    pix_key: '',
    pix_key_type: 'email',
    recipient_name: '',
    recipient_document: '',
    network: 'Polygon'
  });
  const [result, setResult] = useState<OffRampData | null>(null);

  const handleSubmit = async (e: React.FormEvent, simulation = false) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('pixley-off-ramp', {
        body: {
          ...formData,
          source_amount: parseFloat(formData.source_amount),
          simulation
        }
      });

      if (error) throw error;

      if (data.status === 'success') {
        setResult(data.data);
        toast({
          title: simulation ? 'Simulação concluída' : 'Off-Ramp criado com sucesso',
          description: simulation 
            ? 'Valores calculados com sucesso'
            : 'Sua solicitação de saque foi enviada',
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error('Erro no off-ramp:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao processar off-ramp',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setFormData({
      source_currency: 'USDT',
      source_amount: '',
      pix_key: '',
      pix_key_type: 'email',
      recipient_name: '',
      recipient_document: '',
      network: 'Polygon'
    });
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Vender Cripto por PIX</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!result ? (
          <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="source_currency">Criptomoeda</Label>
                <Select 
                  value={formData.source_currency} 
                  onValueChange={(value) => setFormData({ ...formData, source_currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USDT">USDT</SelectItem>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="source_amount">Quantidade</Label>
                <Input
                  id="source_amount"
                  type="number"
                  step="0.000001"
                  min="0.000001"
                  placeholder="100.00"
                  value={formData.source_amount}
                  onChange={(e) => setFormData({ ...formData, source_amount: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="network">Rede</Label>
              <Select 
                value={formData.network} 
                onValueChange={(value) => setFormData({ ...formData, network: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Polygon">Polygon</SelectItem>
                  <SelectItem value="Ethereum">Ethereum</SelectItem>
                  <SelectItem value="BSC">Binance Smart Chain</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pix_key_type">Tipo de Chave PIX</Label>
                <Select 
                  value={formData.pix_key_type} 
                  onValueChange={(value) => setFormData({ ...formData, pix_key_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="cpf">CPF</SelectItem>
                    <SelectItem value="phone">Telefone</SelectItem>
                    <SelectItem value="aleatoria">Chave Aleatória</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="pix_key">Chave PIX</Label>
                <Input
                  id="pix_key"
                  placeholder={
                    formData.pix_key_type === 'email' ? 'exemplo@email.com' :
                    formData.pix_key_type === 'cpf' ? '000.000.000-00' :
                    formData.pix_key_type === 'phone' ? '(11) 99999-9999' :
                    'chave-aleatoria-uuid'
                  }
                  value={formData.pix_key}
                  onChange={(e) => setFormData({ ...formData, pix_key: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="recipient_name">Nome do Destinatário</Label>
                <Input
                  id="recipient_name"
                  placeholder="Nome completo"
                  value={formData.recipient_name}
                  onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="recipient_document">CPF/CNPJ</Label>
                <Input
                  id="recipient_document"
                  placeholder="000.000.000-00"
                  value={formData.recipient_document}
                  onChange={(e) => {
                    const formatted = formatCPF(e.target.value);
                    setFormData({ ...formData, recipient_document: formatted });
                  }}
                  required
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={(e) => handleSubmit(e, true)}
                disabled={loading || !formData.source_amount || !formData.pix_key}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simular'}
              </Button>
              <Button 
                type="submit" 
                disabled={loading || !formData.source_amount || !formData.pix_key}
                className="flex-1"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar Off-Ramp'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                Off-Ramp Criado com Sucesso!
              </h3>
              <p className="text-muted-foreground">
                {result.message}
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">ID da Retirada:</span>
                <span className="font-medium font-mono text-xs">{result.withdrawal_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Valor Estimado:</span>
                <span className="font-medium">R$ {result.estimated_amount_received?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <span className="font-medium capitalize">{result.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Previsão:</span>
                <span className="font-medium">{result.estimated_completion}</span>
              </div>
            </div>

            <Button onClick={resetForm} className="w-full">
              Nova Transação
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};