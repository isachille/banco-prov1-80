import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Star, CreditCard, Shield, Recycle, Briefcase } from 'lucide-react';

const CadastroPF = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    nome_completo: '',
    cpf: '',
    telefone: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validações básicas
    if (formData.senha !== formData.confirmarSenha) {
      toast.error('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    if (formData.senha.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Iniciando cadastro PF:', formData);

      // Cadastrar no Supabase Auth com redirect para confirmação
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
        options: {
          emailRedirectTo: `${window.location.origin}/confirmacao`,
          data: {
            nome: formData.nome,
            nome_completo: formData.nome_completo,
            cpf: formData.cpf.replace(/\D/g, ''),
            cpf_cnpj: formData.cpf.replace(/\D/g, ''),
            telefone: formData.telefone.replace(/\D/g, ''),
            tipo: 'cliente'
          }
        }
      });

      if (error) {
        console.error('Erro no cadastro:', error);
        if (error.message === 'User already registered') {
          toast.error('Este e-mail já está cadastrado. Tente fazer login.');
        } else {
          toast.error('Erro no cadastro: ' + error.message);
        }
        return;
      }

      console.log('Cadastro realizado:', data);
      
      if (data.user) {
        toast.success('Cadastro realizado! Verifique seu email para confirmar a conta.');
        navigate('/confirme-email');
      }

    } catch (error) {
      console.error('Erro no cadastro:', error);
      toast.error('Erro interno no cadastro');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatTelefone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const handlePremiumClick = () => {
    const whatsappNumber = '5561982021656';
    const message = 'Olá! Tenho interesse no plano PREMIUM do ProBank. Gostaria de mais informações para ativação.';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md space-y-4">
        <Card>
          <CardHeader className="text-center">
            <img 
              src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png" 
              alt="Banco Pro" 
              className="h-16 w-auto mx-auto mb-4"
            />
            <CardTitle className="text-2xl font-bold text-[#0057FF]">Cadastro Pessoa Física</CardTitle>
            <p className="text-muted-foreground">Preencha seus dados para criar sua conta</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  name="nome"
                  placeholder="Nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                  className="h-12"
                />
              </div>
              <div>
                <Input
                  type="text"
                  name="nome_completo"
                  placeholder="Nome Completo"
                  value={formData.nome_completo}
                  onChange={handleInputChange}
                  required
                  className="h-12"
                />
              </div>
              <div>
                <Input
                  type="text"
                  name="cpf"
                  placeholder="CPF"
                  value={formData.cpf}
                  onChange={(e) => setFormData({...formData, cpf: formatCPF(e.target.value)})}
                  required
                  className="h-12"
                  maxLength={14}
                />
              </div>
              <div>
                <Input
                  type="text"
                  name="telefone"
                  placeholder="Telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: formatTelefone(e.target.value)})}
                  required
                  className="h-12"
                  maxLength={15}
                />
              </div>
              <div>
                <Input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="h-12"
                />
              </div>
              <div>
                <Input
                  type="password"
                  name="senha"
                  placeholder="Senha"
                  value={formData.senha}
                  onChange={handleInputChange}
                  required
                  className="h-12"
                />
              </div>
              <div>
                <Input
                  type="password"
                  name="confirmarSenha"
                  placeholder="Confirmar Senha"
                  value={formData.confirmarSenha}
                  onChange={handleInputChange}
                  required
                  className="h-12"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-[#0057FF] hover:bg-[#0047CC] text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Cadastrando...' : 'Cadastrar'}
              </Button>
            </form>
            
            {/* Premium Section */}
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="text-center mb-3">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <h3 className="text-lg font-bold text-yellow-700 dark:text-yellow-300">PREMIUM</h3>
                  <Star className="h-5 w-5 text-yellow-500" />
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  <span>Cartão Black</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  <span>Limite de até R$10.000</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  <span>Seguro de vida, celular e compras online</span>
                </div>
                <div className="flex items-center gap-2">
                  <Recycle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  <span>Cashback sustentável em todas as transações</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  <span>Vantagens exclusivas e atendimento prioritário</span>
                </div>
              </div>
              
              <div className="text-center mb-3">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Valor da anuidade: <span className="text-green-600 dark:text-green-400">R$ 24,99</span>
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">(cobrados uma vez ao ano)</p>
              </div>
              
              <Button
                onClick={handlePremiumClick}
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-semibold"
              >
                Quero ser PREMIUM
              </Button>
            </div>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/login')}
                className="text-[#0057FF] hover:underline"
              >
                Já tem conta? Faça login
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CadastroPF;
