
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Pagar = () => {
  const navigate = useNavigate();
  const [codigoBarras, setCodigoBarras] = useState('');

  const handlePayment = () => {
    if (!codigoBarras) {
      toast.error('Digite o código de barras do boleto');
      return;
    }
    toast.success('Pagamento processado com sucesso!');
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
              <h1 className="text-2xl font-bold">Pagar</h1>
              <p className="text-blue-100">Boletos e contas</p>
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
              <Zap className="mr-2 h-5 w-5" />
              Pagar Boleto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="codigo">Código de Barras</Label>
              <Input
                id="codigo"
                placeholder="Digite ou escaneie o código de barras"
                value={codigoBarras}
                onChange={(e) => setCodigoBarras(e.target.value)}
              />
            </div>
            
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => toast.info('Funcionalidade de câmera em desenvolvimento')}
            >
              <Camera className="mr-2 h-4 w-4" />
              Escanear Código de Barras
            </Button>
            
            <Button 
              onClick={handlePayment}
              className="w-full bg-gradient-to-r from-[#001B3A] to-[#003F5C] hover:from-[#002A4A] hover:to-[#004F6C]"
            >
              Pagar Boleto
            </Button>
          </CardContent>
        </Card>

        <div className="mt-6 space-y-3">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Conta de Luz</h3>
                  <p className="text-sm text-muted-foreground">Vencimento: 15/01/2024</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">R$ 89,50</p>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Vencido</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Internet</h3>
                  <p className="text-sm text-muted-foreground">Vencimento: 20/01/2024</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">R$ 129,90</p>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pendente</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Pagar;
