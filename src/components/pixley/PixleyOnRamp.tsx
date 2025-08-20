import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, QrCode } from 'lucide-react';

interface OnRampData {
  id: string;
  status: string;
  qr_code: string;
  source_amount: number;
  target_amount: number;
  wallet_address: string;
  network: string;
}

export const PixleyOnRamp = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    source_currency: 'BRL',
    source_amount: '',
    target_currency: 'USDT',
    wallet_address: '',
    network: 'Polygon'
  });
  const [result, setResult] = useState<OnRampData | null>(null);

  const handleSubmit = async (e: React.FormEvent, simulation = false) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('pixley-on-ramp', {
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
          title: simulation ? 'Simulação concluída' : 'On-Ramp criado com sucesso',
          description: simulation 
            ? 'Valores calculados com sucesso'
            : 'Use o QR Code para fazer o pagamento PIX',
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error('Erro no on-ramp:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao processar on-ramp',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setFormData({
      source_currency: 'BRL',
      source_amount: '',
      target_currency: 'USDT',
      wallet_address: '',
      network: 'Polygon'
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Comprar Cripto com PIX</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!result ? (
          <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="source_amount">Valor em BRL</Label>
                <Input
                  id="source_amount"
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="100.00"
                  value={formData.source_amount}
                  onChange={(e) => setFormData({ ...formData, source_amount: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="target_currency">Criptomoeda</Label>
                <Select 
                  value={formData.target_currency} 
                  onValueChange={(value) => setFormData({ ...formData, target_currency: value })}
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
            </div>

            <div>
              <Label htmlFor="wallet_address">Endereço da Carteira</Label>
              <Input
                id="wallet_address"
                placeholder="0x1234567890abcdef..."
                value={formData.wallet_address}
                onChange={(e) => setFormData({ ...formData, wallet_address: e.target.value })}
                required
              />
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

            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={(e) => handleSubmit(e, true)}
                disabled={loading || !formData.source_amount || !formData.wallet_address}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simular'}
              </Button>
              <Button 
                type="submit" 
                disabled={loading || !formData.source_amount || !formData.wallet_address}
                className="flex-1"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar On-Ramp'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                On-Ramp Criado com Sucesso!
              </h3>
              <p className="text-muted-foreground">
                Use o QR Code abaixo para fazer o pagamento PIX
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Valor PIX:</span>
                <span className="font-medium">R$ {result.source_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Você receberá:</span>
                <span className="font-medium">{result.target_amount} {formData.target_currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <span className="font-medium capitalize">{result.status}</span>
              </div>
            </div>

            {result.qr_code && (
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg inline-block">
                  <img 
                    src={result.qr_code} 
                    alt="QR Code PIX" 
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Escaneie o QR Code com seu app bancário
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={resetForm} className="flex-1">
                Nova Transação
              </Button>
              <Button variant="outline" size="sm">
                <QrCode className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};