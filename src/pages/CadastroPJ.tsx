
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft } from 'lucide-react';

const CadastroPJ = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    nome_completo: '',
    cnpj: '',
    telefone: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Aplicar máscara para CNPJ
    if (name === 'cnpj') {
      const maskedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
      setFormData({ ...formData, [name]: maskedValue });
    }
    // Aplicar máscara para telefone
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
    if (!formData.nome || !formData.nome_completo || !formData.cnpj || 
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

    // Validar CNPJ (formato básico)
    const cnpjLimpo = formData.cnpj.replace(/\D/g, '');
    if (cnpjLimpo.length !== 14) {
      toast.error('CNPJ deve ter 14 dígitos');
      return false;
    }

    // Validar email
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
      console.log('Iniciando cadastro PJ:', formData);

      // Registrar no Supabase Auth com metadados
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
        options: {
          emailRedirectTo: `${window.location.origin}/confirmacao`,
          data: {
            nome: formData.nome,
            nome_completo: formData.nome_completo,
            cnpj: formData.cnpj.replace(/\D/g, ''),
            cpf_cnpj: formData.cnpj.replace(/\D/g, ''),
            telefone: formData.telefone.replace(/\D/g, ''),
            tipo: 'PJ'
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

      console.log('Cadastro PJ realizado:', data);
      toast.success('Cadastro realizado! Verifique seu email para confirmar a conta.');
      navigate('/login');

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
            <CardTitle className="text-2xl font-bold text-[#0057FF]">Cadastro Pessoa Jurídica</CardTitle>
            <p className="text-muted-foreground">Preencha os dados da sua empresa</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="text"
                  name="nome"
                  placeholder="Nome fantasia"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                  className="h-12"
                />
                <Input
                  type="text"
                  name="cnpj"
                  placeholder="CNPJ"
                  value={formData.cnpj}
                  onChange={handleInputChange}
                  required
                  maxLength={18}
                  className="h-12"
                />
              </div>
              
              <Input
                type="text"
                name="nome_completo"
                placeholder="Razão social"
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

        {/* Card informativo */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-sm text-blue-800">
              <strong>📧 Confirme seu email:</strong> Após o cadastro, verifique sua caixa de entrada e clique no link de confirmação para ativar sua conta.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CadastroPJ;
