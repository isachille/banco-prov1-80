
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Smartphone, CheckCircle, Copy, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const PixAdmin = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [pixData, setPixData] = useState({
    tipoChave: '',
    chave: '',
    valor: '',
    descricao: '',
    destinatario: ''
  });
  const [comprovante, setComprovante] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const tiposChave = [
    { value: 'cpf', label: 'CPF', placeholder: '000.000.000-00' },
    { value: 'email', label: 'E-mail', placeholder: 'email@exemplo.com' },
    { value: 'telefone', label: 'Telefone', placeholder: '(11) 99999-9999' },
    { value: 'aleatoria', label: 'Chave Aleatória', placeholder: 'chave-aleatória-uuid' }
  ];

  const handleNextStep = () => {
    if (step === 1 && (!pixData.tipoChave || !pixData.chave)) {
      toast.error('Selecione o tipo de chave e informe a chave PIX');
      return;
    }
    
    if (step === 2) {
      // Simulação de verificação de chave
      if (pixData.chave.endsWith('@test.com')) {
        setPixData(prev => ({ ...prev, destinatario: 'João Silva (Teste)' }));
        setStep(3);
      } else {
        toast.error('Chave PIX não encontrada');
        return;
      }
    }
    
    if (step === 3 && (!pixData.valor || parseFloat(pixData.valor) <= 0)) {
      toast.error('Informe um valor válido');
      return;
    }
    
    setStep(step + 1);
  };

  const handleEnviarPix = async () => {
    setLoading(true);
    
    try {
      // Simular envio do PIX
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Gerar comprovante simulado
      const comprovanteData = {
        destinatario: pixData.destinatario,
        chave: pixData.chave,
        valor: parseFloat(pixData.valor),
        descricao: pixData.descricao || 'Transferência PIX',
        data: new Date(),
        hash: `PIX${Date.now()}${Math.random().toString(36).substring(7).toUpperCase()}`,
        id: `TXN${Date.now()}`
      };
      
      setComprovante(comprovanteData);
      
      // Registrar transação no banco
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.rpc('registrar_transacao', {
          p_user: user.id,
          p_tipo: 'PIX',
          p_descricao: `PIX para ${pixData.chave}`,
          p_valor: -parseFloat(pixData.valor) // Valor negativo para débito
        });
      }
      
      toast.success('PIX enviado com sucesso!');
      setStep(5);
      
    } catch (error) {
      console.error('Erro ao enviar PIX:', error);
      toast.error('Erro ao enviar PIX');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência!');
  };

  const resetFlow = () => {
    setStep(1);
    setPixData({
      tipoChave: '',
      chave: '',
      valor: '',
      descricao: '',
      destinatario: ''
    });
    setComprovante(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin')}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">PIX</h1>
              <p className="text-purple-100">Transferência instantânea</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Smartphone className="w-8 h-8" />
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-md">
        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <React.Fragment key={i}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i <= step ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {i}
                </div>
                {i < 5 && <div className={`w-6 h-1 ${i < step ? 'bg-purple-600' : 'bg-gray-200'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {step === 1 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center">Selecione o tipo de chave PIX</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={pixData.tipoChave} onValueChange={(value) => setPixData(prev => ({ ...prev, tipoChave: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha o tipo de chave" />
                </SelectTrigger>
                <SelectContent>
                  {tiposChave.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {pixData.tipoChave && (
                <Input
                  placeholder={tiposChave.find(t => t.value === pixData.tipoChave)?.placeholder}
                  value={pixData.chave}
                  onChange={(e) => setPixData(prev => ({ ...prev, chave: e.target.value }))}
                />
              )}

              <Button onClick={handleNextStep} className="w-full bg-purple-600 hover:bg-purple-700">
                Continuar
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center">Verificando chave PIX</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-600">Validando chave: {pixData.chave}</p>
              <p className="text-xs text-gray-500">Para teste, use uma chave terminada em "@test.com"</p>
              <Button onClick={handleNextStep} className="w-full bg-purple-600 hover:bg-purple-700">
                Simular Verificação
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center">Chave encontrada!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="font-semibold text-green-800">{pixData.destinatario}</p>
                <p className="text-sm text-green-600">{pixData.chave}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Valor</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={pixData.valor}
                    onChange={(e) => setPixData(prev => ({ ...prev, valor: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descrição (opcional)</label>
                <Input
                  placeholder="Para que é essa transferência?"
                  value={pixData.descricao}
                  onChange={(e) => setPixData(prev => ({ ...prev, descricao: e.target.value }))}
                />
              </div>

              <Button onClick={handleNextStep} className="w-full bg-purple-600 hover:bg-purple-700">
                Continuar
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center">Confirmar transferência</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Para:</span>
                  <span className="font-semibold">{pixData.destinatario}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chave:</span>
                  <span className="text-sm">{pixData.chave}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor:</span>
                  <span className="font-bold text-lg text-purple-600">
                    R$ {parseFloat(pixData.valor || '0').toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                {pixData.descricao && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Descrição:</span>
                    <span>{pixData.descricao}</span>
                  </div>
                )}
              </div>

              <Button 
                onClick={handleEnviarPix} 
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Enviando PIX...</span>
                  </div>
                ) : (
                  'Enviar PIX'
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 5 && comprovante && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-green-600">PIX realizado com sucesso!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <p className="text-2xl font-bold text-green-600">
                  R$ {comprovante.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-gray-600">enviado para</p>
                <p className="font-semibold">{comprovante.destinatario}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Data:</span>
                  <span>{comprovante.data.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span>ID Transação:</span>
                  <div className="flex items-center space-x-1">
                    <span className="font-mono">{comprovante.id}</span>
                    <button onClick={() => copyToClipboard(comprovante.id)}>
                      <Copy className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Hash:</span>
                  <div className="flex items-center space-x-1">
                    <span className="font-mono text-xs">{comprovante.hash}</span>
                    <button onClick={() => copyToClipboard(comprovante.hash)}>
                      <Copy className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button onClick={() => navigate('/extrato')} className="w-full" variant="outline">
                  Ver no Extrato
                </Button>
                <Button onClick={resetFlow} className="w-full bg-purple-600 hover:bg-purple-700">
                  Fazer Novo PIX
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PixAdmin;
