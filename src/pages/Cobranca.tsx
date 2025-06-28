
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Cobranca = () => {
  const [formData, setFormData] = useState({
    target_document: '',
    valor: '',
    vencimento: ''
  });
  const [loading, setLoading] = useState(false);

  // Mock user data - em produção viria de contexto/auth
  const userWalletId = "user-wallet-123";
  const token = "mock-token";

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Em produção seria:
      // const response = await fetch('https://seu-xano.com/api/charges', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     origin_wallet_id: userWalletId,
      //     target_document: formData.target_document,
      //     valor: parseFloat(formData.valor),
      //     vencimento: formData.vencimento
      //   })
      // });

      // Mock success por enquanto
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Cobrança criada com sucesso!');
      setFormData({
        target_document: '',
        valor: '',
        vencimento: ''
      });
    } catch (error) {
      console.error('Erro ao criar cobrança:', error);
      toast.error('Erro ao criar cobrança. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-inter p-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-xl font-bold text-[#1F1F1F] mb-6">Cobrar outro usuário</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="target_document" className="text-[#1F1F1F] font-medium">
              CPF ou e-mail do destinatário
            </Label>
            <Input
              id="target_document"
              type="text"
              value={formData.target_document}
              onChange={(e) => handleInputChange('target_document', e.target.value)}
              placeholder="Ex: 123.456.789-00 ou email@exemplo.com"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="valor" className="text-[#1F1F1F] font-medium">
              Valor
            </Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1F1F1F]">
                R$
              </span>
              <Input
                id="valor"
                type="number"
                step="0.01"
                min="0"
                value={formData.valor}
                onChange={(e) => handleInputChange('valor', e.target.value)}
                placeholder="0,00"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="vencimento" className="text-[#1F1F1F] font-medium">
              Vencimento
            </Label>
            <Input
              id="vencimento"
              type="date"
              value={formData.vencimento}
              onChange={(e) => handleInputChange('vencimento', e.target.value)}
              className="mt-1"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0057FF] hover:bg-[#0047CC] text-white font-medium py-3 mt-6"
          >
            {loading ? 'Criando...' : 'Criar cobrança'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Cobranca;
