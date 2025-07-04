
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Transferir = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    banco: '',
    agencia: '',
    conta: '',
    cpf: '',
    nome: '',
    valor: ''
  });

  const handleTransfer = () => {
    if (!formData.valor || !formData.conta || !formData.cpf) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    toast.success('Transferência realizada com sucesso!');
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#001B3A] to-[#003F5C] text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/home')}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Transferir</h1>
              <p className="text-blue-100">Envie dinheiro para outras contas</p>
            </div>
          </div>
          <img 
            src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png" 
            alt="Banco Pro" 
            className="h-12 w-auto"
          />
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Send className="mr-2 h-5 w-5" />
              Nova Transferência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="banco">Banco</Label>
              <Input
                id="banco"
                placeholder="Código do banco"
                value={formData.banco}
                onChange={(e) => setFormData({...formData, banco: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="agencia">Agência</Label>
              <Input
                id="agencia"
                placeholder="Número da agência"
                value={formData.agencia}
                onChange={(e) => setFormData({...formData, agencia: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="conta">Conta *</Label>
              <Input
                id="conta"
                placeholder="Número da conta"
                value={formData.conta}
                onChange={(e) => setFormData({...formData, conta: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={(e) => setFormData({...formData, cpf: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="nome">Nome do Beneficiário</Label>
              <Input
                id="nome"
                placeholder="Nome completo"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="valor">Valor *</Label>
              <Input
                id="valor"
                type="number"
                placeholder="0,00"
                value={formData.valor}
                onChange={(e) => setFormData({...formData, valor: e.target.value})}
              />
            </div>
            
            <Button 
              onClick={handleTransfer}
              className="w-full bg-gradient-to-r from-[#001B3A] to-[#003F5C] hover:from-[#002A4A] hover:to-[#004F6C]"
            >
              Transferir
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Transferir;
