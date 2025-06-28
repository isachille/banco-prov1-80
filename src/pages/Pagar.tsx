
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Pagar = () => {
  const [formData, setFormData] = useState({
    banco: '',
    agencia: '',
    conta: '',
    documento: '',
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
      // const response = await fetch('https://seu-xano.com/api/ted', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     from_wallet_id: userWalletId,
      //     banco: formData.banco,
      //     agencia: formData.agencia,
      //     conta: formData.conta,
      //     documento: formData.documento,
      //     valor: parseFloat(formData.valor)
      //   })
      // });

      // Mock success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Pagamento via TED enviado com sucesso!');
      setFormData({
        banco: '',
        agencia: '',
        conta: '',
        documento: '',
        valor: ''
      });
    } catch (error) {
      console.error('Erro ao fazer pagamento:', error);
      toast.error('Erro ao realizar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-[#1F1F1F] mb-6">Pagamento via TED</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="banco" className="text-[#1F1F1F] font-medium">
              Banco
            </Label>
            <Input
              id="banco"
              type="text"
              value={formData.banco}
              onChange={(e) => handleInputChange('banco', e.target.value)}
              placeholder="Ex: Banco do Brasil"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="agencia" className="text-[#1F1F1F] font-medium">
              Agência
            </Label>
            <Input
              id="agencia"
              type="text"
              value={formData.agencia}
              onChange={(e) => handleInputChange('agencia', e.target.value)}
              placeholder="Ex: 1234-5"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="conta" className="text-[#1F1F1F] font-medium">
              Conta
            </Label>
            <Input
              id="conta"
              type="text"
              value={formData.conta}
              onChange={(e) => handleInputChange('conta', e.target.value)}
              placeholder="Ex: 12345-6"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="documento" className="text-[#1F1F1F] font-medium">
              CPF/CNPJ
            </Label>
            <Input
              id="documento"
              type="text"
              value={formData.documento}
              onChange={(e) => handleInputChange('documento', e.target.value)}
              placeholder="Ex: 123.456.789-00"
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

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0057FF] hover:bg-[#0047CC] text-white font-medium py-3 mt-6"
          >
            {loading ? 'Enviando...' : 'Enviar TED'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Pagar;
