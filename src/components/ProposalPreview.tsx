
import React from 'react';
import { ProposalActions } from '@/components/proposal/ProposalActions';
import sedanImage from '@/assets/sedan-3d.png';
import suvImage from '@/assets/suv-3d.png';
import motoImage from '@/assets/moto-3d.png';

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
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header com Logo - Estilo Profissional - Reduzido */}
          <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-4">
            <div className="flex items-center justify-center gap-4 mb-3">
              <img 
                src="/lovable-uploads/ffb83455-1b27-47d5-819d-980104813842.png" 
                alt="Banco Pro Logo" 
                className="w-32 h-20 object-contain"
              />
              <div className="text-center">
                <h1 className="text-2xl font-bold text-white">BANCO PRO</h1>
                <p className="text-blue-100 text-sm">Financiamento Veicular</p>
              </div>
            </div>
            
            <div className="text-center">
              <h2 className="text-lg font-bold mb-1">PROTOCOLO DA PROPOSTA {proposal.codigo}</h2>
            </div>
          </div>

          {/* Logos dos Bancos - Formato Profissional */}
          <div className="bg-gray-100 p-6">
            <div className="flex justify-center items-center gap-2 mb-4 flex-wrap">
              <div className="bg-black text-white px-3 py-2 rounded text-xs font-bold">BANCO PAN</div>
              <div className="bg-orange-600 text-white px-3 py-2 rounded text-xs font-bold">C6 BANK</div>
              <div className="bg-blue-800 text-white px-3 py-2 rounded text-xs font-bold">BANCO SAFRA</div>
              <div className="bg-purple-600 text-white px-3 py-2 rounded text-xs font-bold">BV</div>
              <div className="bg-yellow-500 text-black px-3 py-2 rounded text-xs font-bold">BANCO DO BRASIL</div>
              <div className="bg-orange-500 text-white px-3 py-2 rounded text-xs font-bold">ITAÚ</div>
              <div className="bg-green-600 text-white px-3 py-2 rounded text-xs font-bold">SICREDI</div>
              <div className="bg-blue-500 text-white px-3 py-2 rounded text-xs font-bold">CAIXA</div>
              <div className="bg-red-600 text-white px-3 py-2 rounded text-xs font-bold">BRADESCO</div>
              <div className="bg-red-800 text-white px-3 py-2 rounded text-xs font-bold">SANTANDER</div>
            </div>
            
            {/* Status da Proposta */}
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-700 mb-3">SITUAÇÃO DO PERFIL AVALIADO</h3>
              <div className="flex justify-center gap-4">
                <div className="bg-red-100 border border-red-300 px-6 py-2 text-red-700 font-bold text-sm">RECUSADO</div>
                <div className="bg-green-400 border border-green-500 px-6 py-2 text-white font-bold text-sm">PRÉ-APROVADO</div>
                <div className="bg-gray-100 border border-gray-300 px-6 py-2 text-gray-700 font-bold text-sm">APROVADO</div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Dados Empresariais */}
            <div className="bg-blue-50 p-6 rounded-lg mb-6 border border-blue-200">
              <h3 className="text-blue-800 font-bold text-center mb-4">DADOS EMPRESARIAIS</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                <div className="text-center">
                  <div className="font-bold text-gray-800 mb-1">CNPJ:</div>
                  <div className="bg-white p-2 border rounded text-gray-900 font-semibold">54.039.082/0001-07</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-800 mb-1">EMPRESA</div>
                  <div className="text-gray-900 font-semibold">PRO MOTORS - LTDA</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-800 mb-1">CENTRAL SAC</div>
                  <div className="text-gray-900 font-semibold">61 98154-8624</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
                <div className="text-center">
                  <div className="font-bold text-gray-800 mb-1">UNIDADE 1</div>
                  <div className="bg-white p-3 border rounded text-gray-900 font-semibold">
                    <div>TAGUATINGA-DF</div>
                    <div>QNM 34 ÁREA ESPECIAL 01</div>
                    <div>CEP: 72145-450</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-800 mb-1">UNIDADE 2</div>
                  <div className="bg-white p-3 border rounded text-gray-900 font-semibold">
                    <div>SAMAMBAIA - BRASÍLIA</div>
                    <div>QS 406 - SAMAMBAIA</div>
                    <div>CEP: 72318-200</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dados Consultados */}
            <div className="bg-blue-50 p-6 rounded-lg mb-6 border border-blue-200">
              <h3 className="text-blue-800 font-bold text-center mb-4">DADOS CONSULTADOS</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="font-bold text-gray-800 mb-2">CPF / CNPJ</div>
                  <div className="bg-white p-3 border rounded font-mono text-gray-900">{kycData.cpf}</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-800 mb-2">NOME COMPLETO</div>
                  <div className="bg-white p-3 border rounded text-gray-900">{kycData.nome_completo}</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-800 mb-2">DATA DE NASCIMENTO</div>
                  <div className="bg-white p-3 border rounded text-gray-900">{new Date(kycData.data_nascimento).toLocaleDateString('pt-BR')}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="text-center">
                  <div className="font-bold text-gray-800 mb-2">NOME DA MÃE</div>
                  <div className="bg-white p-3 border rounded text-gray-900">{kycData.nome_mae}</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-800 mb-2">PROFISSÃO</div>
                  <div className="bg-white p-3 border rounded text-gray-900">{kycData.profissao}</div>
                </div>
              </div>
            </div>

            {/* Dados do Operador */}
            <div className="bg-green-50 p-6 rounded-lg mb-6 border border-green-200">
              <h3 className="text-green-800 font-bold text-center mb-4">DADOS DO OPERADOR RESPONSÁVEL</h3>
              <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                <div className="grid grid-cols-3 gap-0">
                  {/* Headers */}
                  <div className="bg-gray-100 border-r border-gray-300 p-3 text-center font-bold text-gray-800 text-sm">OPERADOR</div>
                  <div className="bg-gray-100 border-r border-gray-300 p-3 text-center font-bold text-gray-800 text-sm">TELEFONE</div>
                  <div className="bg-gray-100 p-3 text-center font-bold text-gray-800 text-sm">PROTOCOLO</div>
                  
                  {/* Data */}
                  <div className="border-r border-gray-300 border-t p-3 text-center text-gray-900 font-semibold">
                    {proposal.operador?.nome || 'PRO MOTORS'}
                  </div>
                  <div className="border-r border-gray-300 border-t p-3 text-center text-gray-900 font-semibold">
                    {proposal.operador?.telefone || '(61) 98154-8624'}
                  </div>
                  <div className="border-t p-3 text-center text-gray-900 font-semibold">
                    {proposal.codigo}
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <p className="text-green-700 text-sm font-medium">
                  Para dúvidas ou mais informações, entre em contato com o operador responsável
                </p>
              </div>
            </div>

            {/* Dados do Bem Desejado com Imagem */}
            <div className="bg-blue-50 p-6 rounded-lg mb-6 border border-blue-200">
              <h3 className="text-blue-800 font-bold text-center mb-4">DADOS DO BEM. DESEJADO COM CRÉDITO BANCÁRIO</h3>
              
              {/* Imagem do Veículo */}
              <div className="flex justify-center mb-6">
                <img 
                  src={
                    proposal.modelo.toLowerCase().includes('moto') || proposal.modelo.toLowerCase().includes('motorcycle') ? motoImage :
                    proposal.modelo.toLowerCase().includes('suv') || proposal.modelo.toLowerCase().includes('pickup') ? suvImage :
                    sedanImage
                  }
                  alt={`${proposal.marca} ${proposal.modelo}`}
                  className="w-48 h-36 object-contain"
                />
              </div>

              {/* Dados em Grid Estilo Excel */}
              <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                <div className="grid grid-cols-5 gap-0">
                  {/* Headers */}
                  <div className="bg-gray-100 border-r border-gray-300 p-3 text-center font-bold text-gray-800 text-sm">MARCA</div>
                  <div className="bg-gray-100 border-r border-gray-300 p-3 text-center font-bold text-gray-800 text-sm">VALOR</div>
                  <div className="bg-gray-100 border-r border-gray-300 p-3 text-center font-bold text-gray-800 text-sm">VALOR FINAN.</div>
                  <div className="bg-gray-100 border-r border-gray-300 p-3 text-center font-bold text-gray-800 text-sm">COR</div>
                  <div className="bg-gray-100 p-3 text-center font-bold text-gray-800 text-sm">ANO DE FAB.</div>
                  
                  {/* Data */}
                  <div className="border-r border-gray-300 border-t p-3 text-center text-gray-900 font-semibold">{proposal.marca || 'N/A'}</div>
                  <div className="border-r border-gray-300 border-t p-3 text-center text-gray-900 font-semibold">R$ {new Intl.NumberFormat('pt-BR').format(proposal.valorVeiculo || 0)},00</div>
                  <div className="border-r border-gray-300 border-t p-3 text-center text-gray-900 font-semibold">R$ {new Intl.NumberFormat('pt-BR').format((proposal.valorVeiculo || 0) - (proposal.valorEntrada || 0))},00</div>
                  <div className="border-r border-gray-300 border-t p-3 text-center text-gray-900 font-semibold">A DEFINIR</div>
                  <div className="border-t p-3 text-center text-gray-900 font-semibold">{proposal.ano || 'N/A'}</div>
                </div>
                
                {/* Modelo em linha separada */}
                <div className="grid grid-cols-1 border-t border-gray-300">
                  <div className="bg-gray-100 p-3 text-center font-bold text-gray-800 text-sm">NOME/MODELO</div>
                  <div className="p-3 text-center text-gray-900 font-semibold">{proposal.modelo || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Parcelamento Simulado - Reorganizado */}
            <div className="bg-blue-50 p-6 rounded-lg mb-6 border border-blue-200">
              <h3 className="text-blue-800 font-bold text-center mb-4">PARCELAMENTO SIMULADO</h3>
              
              {/* Primeira linha: 12X, 24X, 36X */}
              <div className="bg-white border border-gray-300 rounded-lg overflow-hidden mb-4">
                <div className="grid grid-cols-3 gap-0">
                  {/* Headers */}
                  <div className="bg-gray-100 border-r border-gray-300 p-4 text-center font-bold text-gray-800">12X</div>
                  <div className="bg-gray-100 border-r border-gray-300 p-4 text-center font-bold text-gray-800">24X</div>
                  <div className="bg-gray-100 p-4 text-center font-bold text-gray-800">36X</div>
                  
                  {/* Values */}
                  <div className="border-r border-gray-300 border-t p-4 text-center text-gray-900 font-bold text-lg">
                    R$ {new Intl.NumberFormat('pt-BR').format(Math.round(((proposal.valorVeiculo || 0) - (proposal.valorEntrada || 0)) * 1.12 / 12))},00
                  </div>
                  <div className="border-r border-gray-300 border-t p-4 text-center text-gray-900 font-bold text-lg">
                    R$ {new Intl.NumberFormat('pt-BR').format(Math.round(((proposal.valorVeiculo || 0) - (proposal.valorEntrada || 0)) * 1.24 / 24))},00
                  </div>
                  <div className="border-t p-4 text-center text-gray-900 font-bold text-lg">
                    R$ {new Intl.NumberFormat('pt-BR').format(Math.round(((proposal.valorVeiculo || 0) - (proposal.valorEntrada || 0)) * 1.36 / 36))},00
                  </div>
                </div>
              </div>

              {/* Segunda linha: 48X, 60X */}
              <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                <div className="grid grid-cols-2 gap-0">
                  {/* Headers */}
                  <div className="bg-gray-100 border-r border-gray-300 p-4 text-center font-bold text-gray-800">48X</div>
                  <div className="bg-gray-100 p-4 text-center font-bold text-gray-800">60X</div>
                  
                  {/* Values */}
                  <div className="border-r border-gray-300 border-t p-4 text-center text-gray-900 font-bold text-lg">
                    R$ {new Intl.NumberFormat('pt-BR').format(Math.round(((proposal.valorVeiculo || 0) - (proposal.valorEntrada || 0)) * 1.48 / 48))},00
                  </div>
                  <div className="border-t p-4 text-center text-gray-900 font-bold text-lg">
                    R$ {new Intl.NumberFormat('pt-BR').format(Math.round(((proposal.valorVeiculo || 0) - (proposal.valorEntrada || 0)) * 1.60 / 60))},00
                  </div>
                </div>
              </div>
            </div>

            {/* Financiamento Escolhido */}
            <div className="bg-blue-600 text-white p-6 rounded-lg mb-6 text-center">
              <h3 className="font-bold text-xl mb-4">FINANCIAMENTO SOB REGULARIZAÇÃO</h3>
              <div className="text-sm mb-2">VALOR DE ENTRADA</div>
              <div className="text-4xl font-bold">R$ {new Intl.NumberFormat('pt-BR').format(proposal.valorEntrada)},00</div>
              <div className="text-sm mt-4 opacity-90">
                <div className="font-bold">PROPONENTE</div>
                <div>{kycData.nome_completo}</div>
              </div>
            </div>

            {/* Componentes com Necessidade de Regularização */}
            <div className="bg-red-50 p-6 rounded-lg mb-6 border-l-4 border-red-500">
              <h3 className="text-red-700 font-bold mb-4">COMPONENTES COM NECESSIDADE DE REGULARIZAÇÃO</h3>
              <ul className="space-y-2 text-sm text-gray-800">
                <li className="flex items-start gap-2"><span className="text-red-500 font-bold">•</span> <span className="text-gray-900">Dados inconsistentes com o sistema. Confirmação necessária para correção.</span></li>
                <li className="flex items-start gap-2"><span className="text-red-500 font-bold">•</span> <span className="text-gray-900">Renda não atualizada no sistema. Enviar documentação recente para regularização.</span></li>
                <li className="flex items-start gap-2"><span className="text-red-500 font-bold">•</span> <span className="text-gray-900">Histórico de consumo dos últimos 24 meses, com média de movimentação verificada.</span></li>
                <li className="flex items-start gap-2"><span className="text-red-500 font-bold">•</span> <span className="text-gray-900">Confirmação necessária para atualizar o perfil cadastral do proponente de financiamento.</span></li>
              </ul>
            </div>

            {/* Cotações Promocionais */}
            <div className="bg-green-50 p-6 rounded-lg mb-6 border-l-4 border-green-500">
              <h3 className="text-green-700 font-bold mb-4">COTAÇÕES PROMOCIONAIS DISPONÍVEIS POR PRAZO LIMITADO</h3>
              <ul className="space-y-2 text-sm text-gray-800">
                <li className="flex items-start gap-2"><span className="text-green-500 font-bold">•</span> <span className="text-gray-900"><strong>1° PLANO CDC</strong> COM CONDIÇÕES ESPECIAIS INCLUSO DURANTE TODO O PERÍODO DE FINANCIAMENTO</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500 font-bold">•</span> <span className="text-gray-900"><strong>2° GARANTIA ESTENDIDA</strong> DE 3 MESES PARA TODOS OS VEÍCULOS, OFERECENDO MAIS SEGURANÇA PARA VOCÊ</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500 font-bold">•</span> <span className="text-gray-900"><strong>3° ACOMPANHAMENTO FINANCEIRO</strong> COMPLETO E SUPORTE TOTAL NA COMPLEMENTAÇÃO DOCUMENTAL</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500 font-bold">•</span> <span className="text-gray-900"><strong>4° COMECE A PAGAR EM ATÉ</strong> 60 DIAS APÓS A ASSINATURA DO CONTRATO. MAIS FLEXIBILIDADE PARA O SEU BOLSO</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500 font-bold">•</span> <span className="text-gray-900"><strong>5° FRETE GRATUITO VIA CEGONHA</strong> OU GUINCHO PARA CLIENTES SELECIONADOS. CONSULTE CONDIÇÕES</span></li>
              </ul>
            </div>

            {/* Footer com Data - Visibilidade Melhorada */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="font-bold text-gray-900 mb-2 text-lg">PROPOSTA ABERTA EM:</div>
                <div className="bg-white p-3 border-2 border-gray-400 rounded text-gray-900 font-bold text-lg">{new Date().toLocaleDateString('pt-BR')}</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-red-700 mb-2 text-lg">EXPIRA EM:</div>
                <div className="bg-red-100 p-3 border-2 border-red-400 rounded text-red-700 font-bold text-lg">{new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}</div>
              </div>
            </div>

            {/* Footer Legal */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-yellow-600 font-bold text-sm">SPC BRASIL</div>
                <div className="text-sm text-gray-700">LEI N 13.709 2018 BUSCA GARANTIR A QUALQUER PESSOA O DIREITO SOBRE OS SEUS DADOS PESSOAIS</div>
                <div className="text-blue-600 font-bold text-sm">LGPD</div>
              </div>
              <p className="text-xs text-gray-600">
                <strong>LGPD - Lei Geral de Proteção de Dados:</strong> Seus dados pessoais são tratados em conformidade com a LGPD (Lei 13.709/2018). 
                Utilizamos suas informações exclusivamente para processar sua solicitação de financiamento. Para exercer seus direitos ou obter mais informações 
                sobre o tratamento de seus dados, entre em contato conosco através dos canais oficiais.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
