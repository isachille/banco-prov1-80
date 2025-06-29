
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const CadastroPJ = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    ie: '',
    dataAbertura: '',
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    capitalSocial: '',
    faturamentoMensal: '',
    representanteNome: '',
    representanteCpf: '',
    representanteRg: '',
    representanteNascimento: '',
    senha: '',
    confirmarSenha: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.senha !== formData.confirmarSenha) {
      toast.error('As senhas não coincidem');
      return;
    }

    try {
      console.log('Cadastro PJ:', formData);
      toast.success('Cadastro enviado! Sua conta está em análise.');
      navigate('/conta-analise');
    } catch (error) {
      toast.error('Erro ao processar cadastro');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#0057FF] mb-4">Dados da Empresa</h3>
            <Input
              name="razaoSocial"
              placeholder="Razão Social"
              value={formData.razaoSocial}
              onChange={handleInputChange}
              required
            />
            <Input
              name="nomeFantasia"
              placeholder="Nome Fantasia"
              value={formData.nomeFantasia}
              onChange={handleInputChange}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="cnpj"
                placeholder="CNPJ"
                value={formData.cnpj}
                onChange={handleInputChange}
                required
              />
              <Input
                name="ie"
                placeholder="Inscrição Estadual"
                value={formData.ie}
                onChange={handleInputChange}
                required
              />
            </div>
            <Input
              name="dataAbertura"
              type="date"
              placeholder="Data de Abertura"
              value={formData.dataAbertura}
              onChange={handleInputChange}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="capitalSocial"
                placeholder="Capital Social (R$)"
                type="number"
                value={formData.capitalSocial}
                onChange={handleInputChange}
                required
              />
              <Input
                name="faturamentoMensal"
                placeholder="Faturamento Mensal (R$)"
                type="number"
                value={formData.faturamentoMensal}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#0057FF] mb-4">Endereço e Representante Legal</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="cep"
                placeholder="CEP"
                value={formData.cep}
                onChange={handleInputChange}
                required
              />
              <Input
                name="numero"
                placeholder="Número"
                value={formData.numero}
                onChange={handleInputChange}
                required
              />
            </div>
            <Input
              name="rua"
              placeholder="Rua"
              value={formData.rua}
              onChange={handleInputChange}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="bairro"
                placeholder="Bairro"
                value={formData.bairro}
                onChange={handleInputChange}
                required
              />
              <Input
                name="cidade"
                placeholder="Cidade"
                value={formData.cidade}
                onChange={handleInputChange}
                required
              />
            </div>
            <Input
              name="estado"
              placeholder="Estado"
              value={formData.estado}
              onChange={handleInputChange}
              required
            />
            <hr className="my-6" />
            <h4 className="font-semibold text-gray-700 mb-4">Representante Legal</h4>
            <Input
              name="representanteNome"
              placeholder="Nome completo do representante"
              value={formData.representanteNome}
              onChange={handleInputChange}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="representanteCpf"
                placeholder="CPF"
                value={formData.representanteCpf}
                onChange={handleInputChange}
                required
              />
              <Input
                name="representanteRg"
                placeholder="RG"
                value={formData.representanteRg}
                onChange={handleInputChange}
                required
              />
            </div>
            <Input
              name="representanteNascimento"
              type="date"
              placeholder="Data de nascimento"
              value={formData.representanteNascimento}
              onChange={handleInputChange}
              required
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#0057FF] mb-4">Documentos e Senha</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Envie os documentos necessários:</p>
              <div className="space-y-2">
                <label className="block">
                  <span className="text-sm text-gray-700">Contrato Social (PDF)</span>
                  <input type="file" accept=".pdf" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </label>
                <label className="block">
                  <span className="text-sm text-gray-700">Selfie do Representante</span>
                  <input type="file" accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </label>
              </div>
            </div>
            <Input
              name="senha"
              type="password"
              placeholder="Criar senha"
              value={formData.senha}
              onChange={handleInputChange}
              required
            />
            <Input
              name="confirmarSenha"
              type="password"
              placeholder="Confirmar senha"
              value={formData.confirmarSenha}
              onChange={handleInputChange}
              required
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => currentStep === 1 ? navigate('/cadastro') : handlePrev()}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#0057FF]">Cadastro Pessoa Jurídica</h1>
            <p className="text-gray-600">Etapa {currentStep} de 3</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex space-x-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex-1 h-2 rounded ${
                  step <= currentStep ? 'bg-[#0057FF]' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={currentStep === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
              {renderStep()}
              
              <div className="flex justify-between mt-6">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrev}
                  >
                    Voltar
                  </Button>
                )}
                <Button
                  type="submit"
                  className="bg-[#0057FF] hover:bg-[#0047CC] ml-auto"
                >
                  {currentStep === 3 ? 'Finalizar Cadastro' : 'Continuar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CadastroPJ;
