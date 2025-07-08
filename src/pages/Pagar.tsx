
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Zap, Car, CreditCard, Send, Receipt, Calendar, Settings, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const Pagar = () => {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState('');

  const handleScanBarcode = () => {
    toast.info('Função de escaneamento em desenvolvimento');
  };

  const paymentOptions = [
    { 
      icon: Zap, 
      label: 'Buscador de boletos - DDA', 
      description: 'Encontre seus boletos automaticamente',
      route: '/boletos'
    }
  ];

  const quickPayments = [
    { icon: Car, label: 'Débitos de veículos', route: '/debitos-veiculos' },
    { icon: CreditCard, label: 'Pagar cartão', route: '/pagar-cartao' }
  ];

  const moreServices = [
    { icon: Send, label: 'Meus limites', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { icon: Receipt, label: 'Comprovantes', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { icon: Calendar, label: 'Agendamentos', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { icon: Settings, label: 'Débito automático', bg: 'bg-blue-50 dark:bg-blue-900/20' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
              <h1 className="text-2xl font-bold">Pagamentos</h1>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <HelpCircle className="w-5 h-5" />
          </Button>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Como você quer pagar?</h2>
        </div>
      </div>

      <div className="p-6 -mt-4 space-y-6">
        {/* Main Payment Card */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Digitar ou colar o código"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  className="text-lg"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Pode ser um código de barras ou Pix Copia e Cola
                </p>
              </div>

              <Button
                onClick={handleScanBarcode}
                variant="outline"
                className="w-full h-auto p-4 flex items-center justify-center space-x-2"
              >
                <Camera className="w-6 h-6 text-blue-600" />
                <span className="font-medium">Ler código de barras</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Options */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-foreground">Mais opções</h2>
          <div className="space-y-3">
            {paymentOptions.map((option, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <option.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{option.label}</h3>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Payments */}
        <div className="grid grid-cols-2 gap-4">
          {quickPayments.map((payment, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <payment.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-foreground">{payment.label}</span>
                </CardContent>
              </Card>
          ))}
        </div>

        {/* More Services */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-foreground">Mais serviços</h2>
          <div className="grid grid-cols-2 gap-4">
            {moreServices.map((service, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className={`w-12 h-12 ${service.bg} rounded-full flex items-center justify-center mb-3`}>
                    <service.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{service.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagar;
