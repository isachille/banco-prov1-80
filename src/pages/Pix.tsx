
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Pix = () => {
  const [formData, setFormData] = useState({
    chave_pix: '',
    valor: ''
  });
  const [loading, setLoading] = useState(false);

  // Mock user data
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
      // const response = await fetch('https://seu-xano.com/api/transactions', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     from_wallet_id: userWalletId,
      //     to_pix_key: formData.chave_pix,
      //     valor: parseFloat(formData.valor),
      //     tipo: "pix"
      //   })
      // });

      // Mock success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Pix enviado com sucesso!');
      setFormData({ chave_pix: '', valor: '' });
    } catch (error) {
      console.error('Erro ao enviar Pix:', error);
      toast.error('Erro ao enviar Pix. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-[#1F1F1F] mb-6">Enviar Pix</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="chave_pix" className="text-[#1F1F1F] font-medium">
              Chave Pix do destinatário
            </Label>
            <Input
              id="chave_pix"
              type="text"
              value={formData.chave_pix}
              onChange={(e) => handleInputChange('chave_pix', e.target.value)}
              placeholder="Ex: 11999999999 ou email@exemplo.com"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="valor" className="text-[#1F1F1F] font-medium">
              Valor a enviar
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
                placeholder="150.00"
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0057FF] hover:bg-[#0047CC] text-white font-medium py-3"
          >
            {loading ? 'Enviando...' : 'Enviar Pix'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Pix;
