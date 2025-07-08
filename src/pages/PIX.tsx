import React, { useState } from 'react';
import { ArrowLeft, Send, Star, QrCode, Copy, Camera, Users, Clock, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const PIX = () => {
  const navigate = useNavigate();
  const [chavePix, setChavePix] = useState('');
  const [valor, setValor] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendPix = async () => {
    if (!chavePix || !valor) {
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

      // Verificar saldo na tabela wallets
      const { data: walletData } = await supabase
        .from('wallets')
        .select('saldo')
        .eq('user_id', user.id)
        .single();

      if (!walletData || walletData.saldo < valorNumerico) {
        toast.error('Saldo insuficiente');
        return;
      }

      // Atualizar saldo na carteira
      const { error } = await supabase
        .from('wallets')
        .update({ saldo: walletData.saldo - valorNumerico })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('PIX enviado com sucesso!');
      setChavePix('');
      setValor('');
    } catch (error) {
      console.error('Erro ao enviar PIX:', error);
      toast.error('Erro ao enviar PIX');
    } finally {
      setLoading(false);
    }
  };

  const pixOptions = [
    { 
      icon: Star, 
      label: 'Escolher um contato', 
      description: 'Favoritos e recentes',
      onClick: () => navigate('/pix-contatos')
    },
    { 
      icon: Camera, 
      label: 'Digitar agência e conta', 
      description: 'Transferir para conta',
      onClick: () => navigate('/ted')
    }
  ];

  const moreOptions = [
    { 
      icon: Copy, 
      label: 'Pix copia e cola', 
      description: 'Cole o código aqui',
      onClick: () => {
        const clipboardText = prompt('Cole o código PIX aqui:');
        if (clipboardText) {
          setChavePix(clipboardText);
          toast.success('Código PIX colado!');
        }
      }
    },
    { 
      icon: QrCode, 
      label: 'Ler um QR Code', 
      description: 'Escaneie para pagar',
      onClick: () => {
        toast.info('Abrindo câmera para escanear QR Code...');
        // Simula abertura da câmera
        setTimeout(() => {
          setChavePix('qr-code-example@test.com');
          toast.success('QR Code lido com sucesso!');
        }, 1000);
      }
    },
    { 
      icon: Send, 
      label: 'Trazer dinheiro', 
      description: 'Receber via PIX',
      onClick: () => navigate('/pix-receber')
    },
    { 
      icon: Send, 
      label: 'Receber por aproximação', 
      description: 'Via NFC',
      onClick: () => toast.info('Função NFC em desenvolvimento')
    }
  ];

  const otherServices = [
    { 
      icon: Send, 
      label: 'PIX Automático', 
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      onClick: () => toast.info('Função em desenvolvimento')
    },
    { 
      icon: Users, 
      label: 'Extrato PIX', 
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      onClick: () => navigate('/extrato-pix')
    },
    { 
      icon: Star, 
      label: 'Minhas chaves PIX', 
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      onClick: () => navigate('/minhas-chaves-pix')
    },
    { 
      icon: Users, 
      label: 'Gerenciar contatos', 
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      onClick: () => navigate('/gerenciar-contatos-pix')
    },
    { 
      icon: Send, 
      label: 'Limites PIX', 
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      onClick: () => navigate('/limites-pix')
    },
    { 
      icon: Calendar, 
      label: 'PIX agendados', 
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      onClick: () => toast.info('Função em desenvolvimento')
    },
    { 
      icon: Clock, 
      label: 'Notificações', 
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      onClick: () => toast.info('Função em desenvolvimento')
    },
    { 
      icon: Send, 
      label: 'Contestações', 
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      onClick: () => toast.info('Função em desenvolvimento')
    }
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
            <h1 className="text-2xl font-bold">Pix</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <span className="text-lg">?</span>
          </Button>
        </div>
      </div>

      <div className="p-6 -mt-4 space-y-6">
        {/* Main PIX Card */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Digitar ou colar nome/chave"
                  value={chavePix}
                  onChange={(e) => setChavePix(e.target.value)}
                  className="text-lg"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Pode ser o nome do contato ou uma chave Pix
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {pixOptions.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={option.onClick}
                    className="h-auto p-4 flex flex-col items-center space-y-2 text-center"
                  >
                    <option.icon className="w-6 h-6 text-blue-600" />
                    <span className="text-sm font-medium">{option.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* More Options */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-foreground">Mais opções</h2>
          <div className="grid grid-cols-2 gap-4">
            {moreOptions.map((option, index) => (
              <Card key={index} onClick={option.onClick} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <option.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-medium text-sm mb-1">{option.label}</h3>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Other Services */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-foreground">Outros serviços</h2>
          <div className="grid grid-cols-2 gap-4">
            {otherServices.map((service, index) => (
              <Card key={index} onClick={service.onClick} className="cursor-pointer hover:shadow-md transition-shadow">
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

        {/* Quick Send */}
        {chavePix && (
          <Card className="border-2 border-pink-200 dark:border-pink-800">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="valor">Valor (R$)</Label>
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

                <Button 
                  className="w-full bg-gradient-to-r from-[#001B3A] to-[#003F5C]"
                  onClick={handleSendPix}
                  disabled={loading}
                >
                  {loading ? 'Enviando...' : 'Enviar PIX'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PIX;
