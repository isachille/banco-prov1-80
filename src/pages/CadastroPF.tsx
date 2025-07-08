
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState } from '@/utils/authCleanup';

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
    
    if (isLoading) return;
    
    setIsLoading(true);

    try {
      // Validações básicas
      if (formData.senha !== formData.confirmarSenha) {
        toast.error('As senhas não coincidem');
        return;
      }

      if (formData.senha.length < 6) {
        toast.error('A senha deve ter pelo menos 6 caracteres');
        return;
      }

      console.log('Iniciando processo de cadastro PF');

      // Limpar estado anterior para evitar conflitos
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.warn('Logout preventivo falhou (continuando):', err);
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      // Cadastrar no Supabase Auth
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
            tipo: 'PF',
            role: 'usuario',
            status: 'pendente'
          }
        }
      });

      if (error) {
        console.error('Erro no cadastro:', error);
        
        if (error.message.includes('User already registered')) {
          toast.error('Este e-mail já está cadastrado. Tente fazer login.');
        } else if (error.message.includes('Invalid email')) {
          toast.error('E-mail inválido. Verifique o formato.');
        } else if (error.message.includes('Password')) {
          toast.error('Senha inválida. Use pelo menos 6 caracteres.');
        } else {
          toast.error('Erro no cadastro. Tente novamente em alguns momentos.');
        }
        return;
      }

      if (data.user) {
        console.log('Cadastro realizado com sucesso:', data.user.id);
        toast.success('Cadastro realizado! Verifique seu email para confirmar a conta.');
        
        setTimeout(() => {
          navigate('/confirme-email');
        }, 1000);
      }

    } catch (error) {
      console.error('Erro geral no cadastro:', error);
      toast.error('Erro interno. Tente novamente em alguns momentos.');
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-[#0057FF] hover:bg-[#0047CC] text-white font-medium disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Cadastrando...</span>
                  </div>
                ) : (
                  'Cadastrar'
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/login')}
                className="text-[#0057FF] hover:underline disabled:opacity-50"
                disabled={isLoading}
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
