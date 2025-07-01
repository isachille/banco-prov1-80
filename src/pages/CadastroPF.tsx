
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft } from 'lucide-react';

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
    const { name, value } = e.target;
    
    if (name === 'cpf') {
      const maskedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      setFormData({ ...formData, [name]: maskedValue });
    }
    else if (name === 'telefone') {
      const maskedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
      setFormData({ ...formData, [name]: maskedValue });
    }
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validarFormulario = () => {
    if (!formData.nome || !formData.nome_completo || !formData.cpf || 
        !formData.telefone || !formData.email || !formData.senha) {
      toast.error('Todos os campos são obrigatórios');
      return false;
    }

    if (formData.senha !== formData.confirmarSenha) {
      toast.error('As senhas não coincidem');
      return false;
    }

    if (formData.senha.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    const cpfLimpo = formData.cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      toast.error('CPF deve ter 11 dígitos');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Email inválido');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;
    
    setIsLoading(true);

    try {
      console.log('Iniciando cadastro PF:', formData);

      // Apenas Supabase Auth SignUp - triggers automáticos criarão os registros
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
            tipo: 'PF'
          }
        }
      });

      if (error) {
        console.error('Erro no cadastro:', error);
        if (error.message === 'User already registered') {
          toast.error('Este email já está cadastrado');
        } else {
          toast.error('Erro no cadastro: ' + error.message);
        }
        return;
      }

      console.log('Cadastro realizado:', data);
      toast.success('Cadastro realizado! Verifique seu email para confirmar a conta.');
      navigate('/confirme-email');

    } catch (error) {
      console.error('Erro no cadastro:', error);
      toast.error('Erro interno no cadastro');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md space-y-4">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <button
                onClick={() => navigate('/cadastro')}
                className="absolute left-6 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <img 
                src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png" 
                alt="Banco Pro" 
                className="h-16 w-auto"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-[#0057FF]">Cadastro Pessoa Física</CardTitle>
            <p className="text-muted-foreground">Preencha seus dados para criar sua conta</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="text"
                  name="nome"
                  placeholder="Nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                  className="h-12"
                />
                <Input
                  type="text"
                  name="cpf"
                  placeholder="CPF"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  required
                  maxLength={14}
                  className="h-12"
                />
              </div>
              
              <Input
                type="text"
                name="nome_completo"
                placeholder="Nome completo"
                value={formData.nome_completo}
                onChange={handleInputChange}
                required
                className="h-12"
              />
              
              <Input
                type="tel"
                name="telefone"
                placeholder="Telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                required
                maxLength={15}
                className="h-12"
              />
              
              <Input
                type="email"
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="h-12"
              />
              
              <Input
                type="password"
                name="senha"
                placeholder="Senha"
                value={formData.senha}
                onChange={handleInputChange}
                required
                className="h-12"
              />
              
              <Input
                type="password"
                name="confirmarSenha"
                placeholder="Confirmar senha"
                value={formData.confirmarSenha}
                onChange={handleInputChange}
                required
                className="h-12"
              />
              
              <Button
                type="submit"
                className="w-full h-12 bg-[#0057FF] hover:bg-[#0047CC] text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Cadastrando...' : 'Criar Conta'}
              </Button>
            </form>
            
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
