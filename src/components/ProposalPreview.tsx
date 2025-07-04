
import React from 'react';
import { ArrowLeft, Download, Share, Car, User, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProposalPreviewProps {
  proposal: {
    codigo: string;
    marca: string;
    modelo: string;
    ano: number;
    valorVeiculo: number;
    valorEntrada: number;
    parcelas: number;
    valorParcela: number;
    valorTotal: number;
    taxaJuros: number;
    operador?: {
      nome: string;
      telefone: string;
    };
  };
  kycData: {
    nome_completo: string;
    cpf: string;
    data_nascimento: string;
    nome_mae: string;
    profissao: string;
  };
  onBack: () => void;
}

export const ProposalPreview: React.FC<ProposalPreviewProps> = ({
  proposal,
  kycData,
  onBack
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#001B3A] to-[#003F5C] text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Proposta de Financiamento</h1>
              <p className="text-blue-100">Código: {proposal.codigo}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-[#001B3A]">
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
            <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-[#001B3A]">
              <Share className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dados do Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Dados do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nome Completo</p>
                <p className="font-medium">{kycData.nome_completo}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CPF</p>
                <p className="font-medium">{formatCPF(kycData.cpf)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                <p className="font-medium">{formatDate(kycData.data_nascimento)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nome da Mãe</p>
                <p className="font-medium">{kycData.nome_mae}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Profissão</p>
                <p className="font-medium">{kycData.profissao}</p>
              </div>
            </CardContent>
          </Card>

          {/* Dados do Veículo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Car className="mr-2 h-5 w-5" />
                Dados do Veículo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Veículo</p>
                <p className="font-medium">{proposal.marca} {proposal.modelo}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ano</p>
                <p className="font-medium">{proposal.ano}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor do Veículo</p>
                <p className="font-medium text-lg text-green-600">{formatCurrency(proposal.valorVeiculo)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detalhes do Financiamento */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Detalhes do Financiamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Valor de Entrada</p>
                <p className="text-xl font-bold text-blue-600">{formatCurrency(proposal.valorEntrada)}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Parcelas</p>
                <p className="text-xl font-bold text-green-600">{proposal.parcelas}x</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Valor da Parcela</p>
                <p className="text-xl font-bold text-purple-600">{formatCurrency(proposal.valorParcela)}</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-xl font-bold text-orange-600">{formatCurrency(proposal.valorTotal)}</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Taxa de Juros:</span>
                <span className="font-medium">{proposal.taxaJuros.toFixed(2)}% a.m.</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">Valor Financiado:</span>
                <span className="font-medium">{formatCurrency(proposal.valorVeiculo - proposal.valorEntrada)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operador Responsável */}
        {proposal.operador && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="mr-2 h-5 w-5" />
                Operador Responsável
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{proposal.operador.nome}</p>
                  <p className="text-sm text-muted-foreground">{formatPhone(proposal.operador.telefone)}</p>
                </div>
                <Badge variant="secondary">Atribuído</Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="text-center">
              <Badge className="mb-4 bg-yellow-100 text-yellow-800">Proposta Pendente</Badge>
              <p className="text-sm text-muted-foreground">
                Sua proposta foi gerada com sucesso e está sendo analisada pela nossa equipe.
                Em breve você será contatado por um de nossos operadores.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
