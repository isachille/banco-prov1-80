
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const CadastroPF = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    nomeMae: '',
    cpf: '',
    sexo: '',
    estadoCivil: '',
    dataNascimento: '',
    nacionalidade: 'Brasileira',
    profissao: '',
    rendaMensal: '',
    patrimonio: '',
    telefone: '',
    email: '',
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
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
    if (currentStep < 4) {
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
      console.log('Cadastro PF:', formData);
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
            <h3 className="text-lg font-semibold text-[#0057FF] mb-4">Dados Pessoais</h3>
            <Input
              name="nomeCompleto"
              placeholder="Nome completo"
              value={formData.nomeCompleto}
              onChange={handleInputChange}
              required
            />
            <Input
              name="nomeMae"
              placeholder="Nome da mãe"
              value={formData.nomeMae}
              onChange={handleInputChange}
              required
            />
            <Input
              name="cpf"
              placeholder="CPF"
              value={formData.cpf}
              onChange={handleInputChange}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <select
                name="sexo"
                value={formData.sexo}
                onChange={(e) => setFormData({...formData, sexo: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="">Sexo</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
              </select>
              <select
                name="estadoCivil"
                value={formData.estadoCivil}
                onChange={(e) => setFormData({...formData, estadoCivil: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="">Estado Civil</option>
                <option value="solteiro">Solteiro(a)</option>
                <option value="casado">Casado(a)</option>
                <option value="divorciado">Divorciado(a)</option>
                <option value="viuvo">Viúvo(a)</option>
              </select>
            </div>
            <Input
              name="dataNascimento"
              type="date"
              placeholder="Data de nascimento"
              value={formData.dataNascimento}
              onChange={handleInputChange}
              required
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#0057FF] mb-4">Informações Profissionais</h3>
            <Input
              name="nacionalidade"
              placeholder="Nacionalidade"
              value={formData.nacionalidade}
              onChange={handleInputChange}
              required
            />
            <Input
              name="profissao"
              placeholder="Profissão"
              value={formData.profissao}
              onChange={handleInputChange}
              required
            />
            <Input
              name="rendaMensal"
              placeholder="Renda mensal (R$)"
              type="number"
              value={formData.rendaMensal}
              onChange={handleInputChange}
              required
            />
            <Input
              name="patrimonio"
              placeholder="Patrimônio aproximado (R$)"
              type="number"
              value={formData.patrimonio}
              onChange={handleInputChange}
              required
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#0057FF] mb-4">Contato e Endereço</h3>
            <Input
              name="telefone"
              placeholder="Telefone"
              value={formData.telefone}
              onChange={handleInputChange}
              required
            />
            <Input
              name="email"
              type="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
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
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#0057FF] mb-4">Documentos e Senha</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Envie seus documentos:</p>
              <div className="space-y-2">
                <label className="block">
                  <span className="text-sm text-gray-700">RG/CNH (Frente)</span>
                  <input type="file" accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </label>
                <label className="block">
                  <span className="text-sm text-gray-700">RG/CNH (Verso)</span>
                  <input type="file" accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </label>
                <label className="block">
                  <span className="text-sm text-gray-700">Selfie</span>
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
            <h1 className="text-2xl font-bold text-[#0057FF]">Cadastro Pessoa Física</h1>
            <p className="text-gray-600">Etapa {currentStep} de 4</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((step) => (
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
            <form onSubmit={currentStep === 4 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
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
                  {currentStep === 4 ? 'Finalizar Cadastro' : 'Continuar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CadastroPF;
