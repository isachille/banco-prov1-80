import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { FileSignature, Calendar, User } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';

interface Contrato {
  id: string;
  codigo_contrato: string;
  cliente_nome: string;
  cliente_cpf: string;
  cliente_data_nascimento?: string;
  cliente_nome_mae?: string;
  banco_promotor: string;
  status_contrato: string;
  proposta: {
    codigo: string;
    marca: string;
    modelo: string;
    ano: number;
    valorVeiculo: number;
    valorEntrada: number;
    parcelas: number;
    valorParcela: number;
  };
}

export const AssinarContrato: React.FC = () => {
  const { codigoContrato } = useParams<{ codigoContrato: string }>();
  const navigate = useNavigate();
  const [contrato, setContrato] = useState<Contrato | null>(null);
  const [loading, setLoading] = useState(true);
  const [assinando, setAssinando] = useState(false);
  
  // Dados para assinatura
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [nomeMae, setNomeMae] = useState('');
  const [assinatura, setAssinatura] = useState('');
  
  let sigCanvas: SignatureCanvas | null = null;

  useEffect(() => {
    if (codigoContrato) {
      fetchContrato();
    }
  }, [codigoContrato]);

  const fetchContrato = async () => {
    try {
      const { data, error } = await supabase
        .from('contratos_financiamento')
        .select(`
          *,
          proposta:propostas_financiamento!contratos_financiamento_proposta_id_fkey(
            codigo,
            marca,
            modelo,
            ano,
            valorVeiculo,
            valorEntrada,
            parcelas,
            valorParcela
          )
        `)
        .eq('codigo_contrato', codigoContrato)
        .single();

      if (error) throw error;
      
      if (data && data.proposta && !Array.isArray(data.proposta)) {
        setContrato(data as any);
        setNomeCompleto(data.cliente_nome);
        setDataNascimento(data.cliente_data_nascimento || '');
        setNomeMae(data.cliente_nome_mae || '');
      }
    } catch (error) {
      console.error('Erro ao buscar contrato:', error);
      toast({
        title: "Erro",
        description: "Contrato não encontrado",
        variant: "destructive"
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const salvarAssinatura = () => {
    if (sigCanvas) {
      const assinaturaDataURL = sigCanvas.toDataURL();
      setAssinatura(assinaturaDataURL);
    }
  };

  const limparAssinatura = () => {
    if (sigCanvas) {
      sigCanvas.clear();
      setAssinatura('');
    }
  };

  const confirmarAssinatura = async () => {
    if (!nomeCompleto || !dataNascimento || !nomeMae || !assinatura) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos e faça a assinatura",
        variant: "destructive"
      });
      return;
    }

    setAssinando(true);
    try {
      const { error } = await supabase
        .from('contratos_financiamento')
        .update({
          cliente_nome: nomeCompleto,
          cliente_data_nascimento: dataNascimento,
          cliente_nome_mae: nomeMae,
          assinatura_cliente: assinatura,
          status_contrato: 'assinado',
          assinado_em: new Date().toISOString()
        })
        .eq('codigo_contrato', codigoContrato);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Contrato assinado com sucesso!"
      });

      // Enviar email com contrato
      await enviarEmailContrato();
      
      navigate('/contrato-assinado', { 
        state: { 
          codigoContrato, 
          nomeCliente: nomeCompleto 
        } 
      });
    } catch (error) {
      console.error('Erro ao assinar contrato:', error);
      toast({
        title: "Erro",
        description: "Erro ao assinar contrato",
        variant: "destructive"
      });
    } finally {
      setAssinando(false);
    }
  };

  const enviarEmailContrato = async () => {
    try {
      const response = await supabase.functions.invoke('send-contract-email', {
        body: {
          codigo_contrato: codigoContrato,
          cliente_email: contrato?.proposta ? 'cliente@email.com' : '', // Buscar email do cliente
          cliente_nome: nomeCompleto
        }
      });

      if (response.error) throw response.error;
    } catch (error) {
      console.error('Erro ao enviar email:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando contrato...</div>
      </div>
    );
  }

  if (!contrato) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Contrato não encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FileSignature className="h-8 w-8 text-blue-600" />
              <CardTitle className="text-2xl">Assinatura de Contrato</CardTitle>
            </div>
            <p className="text-gray-600">Código do Contrato: <span className="font-mono font-bold">{contrato.codigo_contrato}</span></p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Detalhes do Contrato */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Proposta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg text-blue-600">Veículo Financiado</h4>
                <p className="text-xl font-bold">{contrato.proposta.marca} {contrato.proposta.modelo}</p>
                <p className="text-gray-600">Ano: {contrato.proposta.ano}</p>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  {formatCurrency(contrato.proposta.valorVeiculo)}
                </p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-blue-600 mb-2">Condições do Financiamento</h4>
                <div className="grid grid-cols-1 gap-2">
                  <p><strong>Entrada:</strong> {formatCurrency(contrato.proposta.valorEntrada)}</p>
                  <p><strong>Financiamento:</strong> {contrato.proposta.parcelas}x de {formatCurrency(contrato.proposta.valorParcela)}</p>
                  <p><strong>Total Financiado:</strong> {formatCurrency(contrato.proposta.parcelas * contrato.proposta.valorParcela)}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-blue-600 mb-2">Instituição Financeira</h4>
                <p className="text-lg font-medium">{contrato.banco_promotor}</p>
              </div>
            </CardContent>
          </Card>

          {/* Formulário de Assinatura */}
          <Card>
            <CardHeader>
              <CardTitle>Dados para Assinatura</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  value={nomeCompleto}
                  onChange={(e) => setNomeCompleto(e.target.value)}
                  placeholder="Digite seu nome completo"
                />
              </div>

              <div>
                <Label htmlFor="nascimento">Data de Nascimento</Label>
                <Input
                  id="nascimento"
                  type="date"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="nomeMae">Nome da Mãe</Label>
                <Input
                  id="nomeMae"
                  value={nomeMae}
                  onChange={(e) => setNomeMae(e.target.value)}
                  placeholder="Digite o nome completo da sua mãe"
                />
              </div>

              <div>
                <Label>Assinatura Digital</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
                  <SignatureCanvas
                    ref={(ref) => sigCanvas = ref}
                    canvasProps={{
                      width: 400,
                      height: 200,
                      className: 'signature-canvas w-full'
                    }}
                    onEnd={salvarAssinatura}
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" onClick={limparAssinatura} size="sm">
                    Limpar Assinatura
                  </Button>
                </div>
              </div>

              <Button
                onClick={confirmarAssinatura}
                disabled={assinando || !nomeCompleto || !dataNascimento || !nomeMae || !assinatura}
                className="w-full"
                size="lg"
              >
                {assinando ? 'Processando...' : 'Confirmar Assinatura'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Termos */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Termos e Condições:</strong></p>
              <p>• Ao assinar este contrato, você concorda com todas as condições estabelecidas para o financiamento do veículo descrito acima.</p>
              <p>• O pagamento das parcelas deve ser realizado nas datas estabelecidas no cronograma de pagamentos.</p>
              <p>• O veículo servirá como garantia do financiamento até a quitação total do contrato.</p>
              <p>• Este documento tem validade legal e sua assinatura digital possui o mesmo valor jurídico de uma assinatura manuscrita.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};