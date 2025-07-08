
import React, { useState } from 'react';
import { Smartphone } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const operadoras = [
  { nome: 'Vivo', valores: [10, 15, 20, 25, 30, 50, 100] },
  { nome: 'Tim', valores: [10, 15, 20, 25, 30, 50, 100] },
  { nome: 'Claro', valores: [10, 15, 20, 25, 30, 50, 100] },
  { nome: 'Oi', valores: [10, 15, 20, 25, 30, 50, 100] },
];

export const RecargaCelularButton = () => {
  const [open, setOpen] = useState(false);
  const [telefone, setTelefone] = useState('');
  const [operadora, setOperadora] = useState('');
  const [valor, setValor] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const formatTelefone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTelefone(e.target.value);
    setTelefone(formatted);
  };

  const handleRecarga = async () => {
    if (!telefone || !operadora || !valor) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (telefone.replace(/\D/g, '').length < 10) {
      toast.error('Número de telefone inválido');
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Usuário não autenticado');
        return;
      }

      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('saldo')
        .eq('user_id', user.id)
        .single();

      if (walletError || !walletData) {
        toast.error('Erro ao verificar saldo');
        return;
      }

      if (walletData.saldo < valor) {
        toast.error('Saldo insuficiente');
        return;
      }

      const { error: updateError } = await supabase
        .from('wallets')
        .update({ saldo: walletData.saldo - valor })
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      toast.success(`Recarga de R$ ${valor.toFixed(2)} realizada com sucesso!`);
      
      setTelefone('');
      setOperadora('');
      setValor(null);
      setOpen(false);

    } catch (error) {
      console.error('Erro na recarga:', error);
      toast.error('Erro ao processar recarga');
    } finally {
      setLoading(false);
    }
  };

  const operadoraSelecionada = operadoras.find(op => op.nome === operadora);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:opacity-90 text-white rounded-xl transition-all duration-200 hover:scale-105">
          <Smartphone className="h-6 w-6" />
          <span className="text-sm font-medium">Recarga</span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Recarga de Celular</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Número do telefone</label>
            <Input
              placeholder="(11) 99999-9999"
              value={telefone}
              onChange={handleTelefoneChange}
              maxLength={15}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Operadora</label>
            <Select value={operadora} onValueChange={setOperadora}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a operadora" />
              </SelectTrigger>
              <SelectContent>
                {operadoras.map((op) => (
                  <SelectItem key={op.nome} value={op.nome}>
                    {op.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {operadoraSelecionada && (
            <div>
              <label className="text-sm font-medium">Valor da recarga</label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {operadoraSelecionada.valores.map((v) => (
                  <Button
                    key={v}
                    variant={valor === v ? "default" : "outline"}
                    onClick={() => setValor(v)}
                    className="h-12"
                  >
                    R$ {v}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={handleRecarga}
            disabled={!telefone || !operadora || !valor || loading}
            className="w-full"
          >
            {loading ? 'Processando...' : `Fazer Recarga - R$ ${valor?.toFixed(2) || '0,00'}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
