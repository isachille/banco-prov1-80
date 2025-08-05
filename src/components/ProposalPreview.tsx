
import React from 'react';
import { ProposalActions } from '@/components/proposal/ProposalActions';
import proMotorsLogo from '@/assets/pro-motors-logo.png';

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
  return (
    <div className="min-h-screen bg-background">
      <ProposalActions 
        proposal={proposal}
        kycData={kycData}
        onBack={onBack}
      />
      
      <div className="container mx-auto p-6 max-w-4xl pt-20">
        {/* Proposta Preview Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header com Logo */}
          <div className="text-center mb-8 border-b-2 border-blue-600 pb-6">
            <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-6 rounded-lg mb-4">
              <div className="flex items-center justify-center gap-4">
                <img 
                  src={proMotorsLogo} 
                  alt="Pro Motors Logo" 
                  className="w-16 h-16 rounded-lg"
                />
                <div>
                  <h1 className="text-3xl font-bold">PRO MOTORS</h1>
                  <p className="text-blue-100">Financiamento Veicular</p>
                </div>
              </div>
            </div>
            
            {/* Open Finance */}
            <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
              <h4 className="text-blue-800 font-bold text-sm mb-2">🔒 ANÁLISE VIA OPEN FINANCE</h4>
              <p className="text-blue-700 text-xs">
                Nosso sistema utiliza tecnologia Open Finance para avaliar seu perfil de crédito em tempo real junto aos principais bancos do país.
              </p>
            </div>
            
            {/* Logos dos Bancos - Layout Descompactado */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <div className="bg-orange-500 text-white flex items-center justify-center rounded-lg p-4 h-16 shadow-md hover:shadow-lg transition-shadow">
                <span className="text-sm font-bold">ITAÚ</span>
              </div>
              <div className="bg-yellow-400 text-black flex items-center justify-center rounded-lg p-4 h-16 shadow-md hover:shadow-lg transition-shadow">
                <span className="text-sm font-bold">BANCO DO BRASIL</span>
              </div>
              <div className="bg-red-600 text-white flex items-center justify-center rounded-lg p-4 h-16 shadow-md hover:shadow-lg transition-shadow">
                <span className="text-sm font-bold">SANTANDER</span>
              </div>
              <div className="bg-green-600 text-white flex items-center justify-center rounded-lg p-4 h-16 shadow-md hover:shadow-lg transition-shadow">
                <span className="text-sm font-bold">SICREDI</span>
              </div>
              <div className="bg-blue-600 text-white flex items-center justify-center rounded-lg p-4 h-16 shadow-md hover:shadow-lg transition-shadow">
                <span className="text-sm font-bold">SAFRA</span>
              </div>
              <div className="bg-purple-600 text-white flex items-center justify-center rounded-lg p-4 h-16 shadow-md hover:shadow-lg transition-shadow">
                <span className="text-sm font-bold">NUBANK</span>
              </div>
            </div>
          </div>

          {/* Status da Proposta */}
          <div className="text-center mb-6">
            <div className="bg-yellow-500 text-white px-8 py-4 rounded-full inline-block text-xl font-bold mb-3">
              PRÉ-APROVADO
            </div>
            <p className="text-gray-600">Código da Proposta: <strong className="text-blue-600">{proposal.codigo}</strong></p>
          </div>

          {/* Dados do Cliente */}
          <div className="mb-6">
            <h3 className="text-blue-600 text-lg font-bold border-b border-gray-200 pb-2 mb-4">Dados do Cliente</h3>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-gray-800"><strong className="text-blue-600">Nome:</strong> {kycData.nome_completo}</div>
                <div className="text-gray-800"><strong className="text-blue-600">CPF:</strong> {kycData.cpf}</div>
                <div className="text-gray-800"><strong className="text-blue-600">Nascimento:</strong> {new Date(kycData.data_nascimento).toLocaleDateString('pt-BR')}</div>
                <div className="text-gray-800"><strong className="text-blue-600">Nome da Mãe:</strong> {kycData.nome_mae}</div>
                <div className="md:col-span-2 text-gray-800"><strong className="text-blue-600">Profissão:</strong> {kycData.profissao}</div>
              </div>
            </div>
          </div>

          {/* Veículo */}
          <div className="mb-6">
            <h3 className="text-blue-600 text-lg font-bold border-b border-gray-200 pb-2 mb-4">Veículo Selecionado</h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <h4 className="text-xl font-bold text-blue-600 mb-2">{proposal.marca} {proposal.modelo}</h4>
                  <p className="text-gray-600">Ano: <strong>{proposal.ano}</strong></p>
                  {proposal.ano === new Date().getFullYear() && (
                    <p className="text-green-600 text-sm font-bold mt-1">🆕 Veículo 0 KM</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.valorVeiculo)}
                  </div>
                  <p className="text-gray-500 text-sm">Valor de mercado</p>
                </div>
              </div>
            </div>
          </div>

          {/* Financiamento */}
          <div className="mb-6">
            <h3 className="text-blue-600 text-lg font-bold border-b border-gray-200 pb-2 mb-4">Simulação de Financiamento</h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="text-center bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2 font-bold">ENTRADA</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.valorEntrada)}
                  </div>
                </div>
                <div className="text-center bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2 font-bold">PARCELAS</div>
                  <div className="text-2xl font-bold text-blue-600">{proposal.parcelas}x</div>
                  <div className="text-gray-600 mt-1">
                    de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.valorParcela)}
                  </div>
                </div>
              </div>
              <div className="text-center bg-gradient-to-r from-blue-800 to-blue-600 text-white p-6 rounded-lg">
                <div className="text-sm mb-2">VALOR TOTAL DO FINANCIAMENTO</div>
                <div className="text-3xl font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.valorTotal)}
                </div>
              </div>
            </div>
          </div>

          {/* Operador */}
          {proposal.operador && (
            <div className="mb-6">
              <h3 className="text-blue-600 text-lg font-bold border-b border-gray-200 pb-2 mb-4">Operador Responsável</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-bold text-lg">{proposal.operador.nome}</p>
                <p className="text-gray-600">{proposal.operador.telefone}</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600 mb-4">
              Proposta pré-aprovada. Entre em contato para finalizar o processo.
            </p>
            <div className="bg-blue-600 text-white p-3 rounded inline-block mb-4">
              <strong>{proposal.operador?.telefone || '(61) 98483-3965'}</strong>
            </div>
            
            {/* Informações da Empresa */}
            <div className="bg-gray-50 p-4 rounded-lg text-left">
              <h4 className="text-blue-600 font-bold text-center mb-3">PRO MOTORS LTDA</h4>
              <div className="text-xs text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-2">
                <p><strong>CNPJ:</strong> 12.345.678/0001-90</p>
                <p><strong>Telefone:</strong> (61) 3333-4444</p>
                <p className="md:col-span-2"><strong>Endereço:</strong> SIA Trecho 1, Lote 123 - Guará, Brasília - DF, CEP: 71200-000</p>
                <p><strong>E-mail:</strong> contato@promotors.com.br</p>
              </div>
            </div>

            {/* LGPD */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mt-4 rounded">
              <p className="text-xs text-yellow-800 text-left">
                <strong>LGPD - Lei Geral de Proteção de Dados:</strong> Seus dados pessoais são tratados em conformidade com a LGPD (Lei 13.709/2018). 
                Utilizamos suas informações exclusivamente para processar sua solicitação de financiamento. Para exercer seus direitos ou obter mais informações 
                sobre o tratamento de seus dados, entre em contato conosco através dos canais oficiais.
              </p>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              Documento gerado em {new Date().toLocaleDateString('pt-BR')} - Pro Motors Financiamentos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
