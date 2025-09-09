import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ContratoData {
  codigo_contrato: string;
  cliente_nome: string;
  cliente_cpf: string;
  cliente_endereco?: string;
  cliente_telefone?: string;
  cliente_email?: string;
  cliente_data_nascimento?: string;
  cliente_nome_mae?: string;
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
  banco_promotor: string;
  data_contrato?: string;
}

interface ContratoTemplateProps {
  data: ContratoData;
}

export const ContratoTemplate: React.FC<ContratoTemplateProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatCPF = (cpf: string) => {
    return cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') || '';
  };

  const dataAtual = new Date().toLocaleDateString('pt-BR');
  const valorTotal = data.proposta.parcelas * data.proposta.valorParcela;

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white text-black" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header com Logo */}
      <div className="text-center mb-8">
        <div className="bg-blue-600 text-white p-4 mb-4">
          <h1 className="text-2xl font-bold">PRO MOTORS</h1>
        </div>
        <h2 className="text-lg font-bold mb-2">CONTRATO DE PRESTAÇÃO DE SERVIÇOS PARA AQUISIÇÃO DE PRODUTOS E BENS FINANCEIROS</h2>
        <p className="text-sm">CNPJ: 54.039.082/0001-07</p>
        <p className="text-sm font-bold">PRO MOTORS</p>
      </div>

      {/* Tabela Contratada */}
      <div className="mb-6">
        <div className="bg-blue-100 p-2 text-center font-bold border border-black">CONTRATADA</div>
        <table className="w-full border border-black text-sm">
          <tr>
            <td className="border border-black p-2 font-bold">Nome da empresa:</td>
            <td className="border border-black p-2">PRO MOTORS LTDA</td>
            <td className="border border-black p-2 font-bold">CNPJ:</td>
            <td className="border border-black p-2">54.039.082/0001-07</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold" colSpan={4}>Endereço: EQNO 10/12 LOTE A LOJA 3B W ONE</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold">Telefone:</td>
            <td className="border border-black p-2">(61) 98154-8624</td>
            <td className="border border-black p-2 font-bold">E-mail:</td>
            <td className="border border-black p-2">PROMOTORSADM@GMAIL.COM</td>
          </tr>
        </table>
      </div>

      {/* Tabela Contratante */}
      <div className="mb-6">
        <div className="bg-blue-100 p-2 text-center font-bold border border-black">CONTRATANTE</div>
        <table className="w-full border border-black text-sm">
          <tr>
            <td className="border border-black p-2 font-bold">Do(a) Sr.ª(s):</td>
            <td className="border border-black p-2">{data.cliente_nome}</td>
            <td className="border border-black p-2 font-bold">Nº de registro:</td>
            <td className="border border-black p-2">{data.codigo_contrato}</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold">CPF:</td>
            <td className="border border-black p-2" colSpan={3}>{formatCPF(data.cliente_cpf)}</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold" colSpan={4}>
              Endereço: {data.cliente_endereco || 'A ser preenchido pelo cliente'}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold">Telefone:</td>
            <td className="border border-black p-2">{data.cliente_telefone || 'A ser preenchido'}</td>
            <td className="border border-black p-2 font-bold">E-mail:</td>
            <td className="border border-black p-2">{data.cliente_email || 'A ser preenchido'}</td>
          </tr>
        </table>
      </div>

      {/* Objeto do Contrato */}
      <div className="mb-6">
        <div className="bg-blue-100 p-2 text-center font-bold border border-black">OBJETO DO CONTRATO</div>
        <div className="text-sm text-justify leading-relaxed p-4 border border-black">
          <p className="mb-4">
            <strong>Cláusula 1ª –</strong> O objeto deste contrato é autorização de prestação de serviço, junto às Instituições 
            Financeiras, consistindo no fornecimento de instruções e direcionamento pessoal, servindo a Contratada 
            para conduzir o cliente até a Instituição Financeira, com o objetivo de obter uma resposta dos Bancos, 
            sendo esta positiva ou negativa (para o caso de a situação financeira do cliente não ser favorável à 
            aprovação de crédito junto ao Banco). Fica o cliente informado que a Contratada exerce uma Atividade 
            <strong> MEIO</strong>, apenas para intermediar o negócio e conduzir o cliente até a Instituição Financeira, e que esta 
            exercerá a atividade <strong>FIM</strong>, quando dará a decisão se aprova ou não o crédito para concessão dos bens.
          </p>

          <p className="mb-4">
            <strong>Cláusula 1B- de Contratação de Serviços Financeiros</strong>
          </p>

          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>
              <strong>Objeto do Contrato:</strong> O presente contrato tem como objeto a prestação de serviços financeiros 
              oferecidos pelo Banco Pro à CONTRATANTE, incluindo, mas não se limitando a: financiamentos, 
              créditos, rodadas de giro, conta digital, PIX, transferências e maquininhas.
            </li>
            <li>
              <strong>Aquisição de Conta Digital:</strong> O CONTRATANTE, ao firmar o presente contrato, está ciente de que 
              adquirirá uma conta digital do Banco Pro, através da qual serão operacionalizados os serviços 
              financeiros ou contratados.
            </li>
            <li>
              <strong>Serviços oferecidos:</strong> Os serviços financeiros disponibilizados ao CONTRATANTE por meio deste 
              contrato estão sujeitos às condições e taxas impostas pelo Banco Pro, as quais serão informadas 
              previamente ao CONTRATANTE.
            </li>
            <li>
              <strong>Aceitação dos Termos:</strong> Ao concordar com o presente contrato, o CONTRATANTE declara ter lido e 
              compreendido todas as cláusulas aqui contidas, aceitando os termos e condições para a contratação 
              dos serviços financeiros do Banco Pro.
            </li>
          </ol>

          <p className="mb-4">
            <strong>Parágrafo Segundo:</strong> A prestação dos serviços realizada por esta Contratada, se findará tão logo, se 
            obtenha a resposta de no mínimo 3 (três) Instituições Financeiras, quer a resposta seja favorável ou não 
            ao interesse do(a) Contratante.
          </p>
        </div>
      </div>

      {/* Dados do Veículo/Financiamento */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h3 className="font-bold text-center bg-blue-100 p-2 mb-4">DETALHES DO FINANCIAMENTO</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Veículo:</strong> {data.proposta.marca} {data.proposta.modelo}</p>
              <p><strong>Ano:</strong> {data.proposta.ano}</p>
              <p><strong>Valor do Veículo:</strong> {formatCurrency(data.proposta.valorVeiculo)}</p>
            </div>
            <div>
              <p><strong>Valor da Entrada:</strong> {formatCurrency(data.proposta.valorEntrada)}</p>
              <p><strong>Parcelas:</strong> {data.proposta.parcelas}x de {formatCurrency(data.proposta.valorParcela)}</p>
              <p><strong>Total Financiado:</strong> {formatCurrency(valorTotal)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Obrigações */}
      <div className="mb-6">
        <div className="bg-blue-100 p-2 text-center font-bold border border-black">DA OBRIGAÇÃO DA CONTRATANTE</div>
        <div className="text-sm text-justify leading-relaxed p-4 border border-black">
          <p className="mb-4">
            <strong>9.1.</strong> A prestação de serviços objeto deste contrato proporcionará à CONTRATADA o recebimento do valor de 
            R$ 510,25 (quinhentos e dez reais e vinte e cinco centavos), referente ao produto final (casa, veículo, crédito ou 
            bens), mediante as seguintes formas de pagamento:
          </p>

          <div className="mb-4">
            <p><strong>(a) Pagamento Interno via Aplicativo:</strong></p>
            <ul className="list-disc list-inside ml-4">
              <li>O PAGADOR deverá criar conta no aplicativo próprio da CONTRATADA (PRO MOTORS LTDA);</li>
              <li>O valor deverá ser alocado diretamente na plataforma;</li>
              <li>A transferência será processada internamente pelo sistema da CONTRATADA.</li>
            </ul>
          </div>

          <div className="mb-4">
            <p><strong>(b) Alternativas Adicionais (apenas em casos excepcionais e com prévia autorização):</strong></p>
            <ul className="list-disc list-inside ml-4">
              <li>Pagamento à vista, em moeda corrente nacional;</li>
              <li>Transferência bancária para a conta jurídica da CONTRATADA (dados fornecidos separadamente);</li>
              <li>PIX exclusivamente para a conta jurídica cadastrada.</li>
            </ul>
          </div>

          <p className="mb-4">
            <strong>9.2. Observações Importantes:</strong>
          </p>
          <ul className="list-disc list-inside ml-4 mb-4">
            <li>Não serão aceitas contestações após a confirmação do pagamento interno via aplicativo;</li>
            <li>Em caso de pagamento externo (transferência/PIX), o PAGADOR deve enviar comprovante para 
            <strong> financeiro@promotors.com.br</strong> dentro de 24h;</li>
            <li>A CONTRATADA se reserva o direito de bloquear serviços em caso de não cumprimento desta cláusula.</li>
          </ul>
        </div>
      </div>

      {/* Cláusulas Legais */}
      <div className="mb-6 text-xs text-justify leading-relaxed">
        <div className="bg-blue-100 p-2 text-center font-bold border border-black">SOBRE A LEI GERAL DE PROTEÇÃO DE DADOS Nº. 13.709/18</div>
        <div className="p-4 border border-black">
          <p className="mb-3">
            <strong>Cláusula 11ª -</strong> Conforme a Lei Geral de Proteção de Dados (LGPD), a Contratada exerce no tratamento de 
            dados pessoais, a atividade de operador, ou seja, aquele, quem realiza o tratamento de dados pessoais 
            em nome do controlador, no caso as instituições financeiras.
          </p>
          <p className="mb-3">
            <strong>Parágrafo Único:</strong> O Contratante dará ciência, no início da negociação do Termo de Acesso e 
            Responsabilidade nas informações pessoais.
          </p>

          <div className="bg-blue-100 p-2 text-center font-bold mt-4">PRAZO DE VIGÊNCIA</div>
          <p className="mt-3">
            <strong>Cláusula 12ª –</strong> O presente contrato vigorará até que o CONTRATANTE obtenha os meios necessários para a 
            possível obtenção da linha de crédito desejada (aprovação do crédito) ou o prazo de 90 (noventa), o que 
            sobre vier primeiro.
          </p>
        </div>
      </div>

      {/* Assinaturas */}
      <div className="mt-8 pt-8">
        <div className="text-center mb-8">
          <p className="mb-4">Por ser verdade, as partes firmam o presente pacto.</p>
          <p>Brasília/DF, {dataAtual}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="text-center">
            <div className="border-t border-black pt-2">
              <p className="font-bold">{data.cliente_nome.toUpperCase()}</p>
              <p>CONTRATANTE</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-black pt-2">
              <p className="font-bold">PRO MOTORS LTDA</p>
              <p>CNPJ: 54.039.082/0001-07</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};