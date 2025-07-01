
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const CadastroPF = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
    
    if (formData.senha !== formData.confirmarSenha) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (formData.senha.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Iniciando cadastro PF:', formData);
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
        options: {
          emailRedirectTo: `${window.location.origin}/confirmacao`,
          data: {
            nome_completo: formData.nome_completo,
            cpf_cnpj: formData.cpf,
            telefone: formData.telefone,
            tipo: 'PF'
          }
        }
      });

      if (error) {
        console.error('Erro no cadastro:', error);
        toast.error('Erro no cadastro: ' + error.message);
        return;
      }

      if (data.user) {
        console.log('Cadastro realizado com sucesso:', data);
        toast.success('Cadastro realizado! Verifique seu email para confirmar a conta.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      toast.error('Erro no cadastro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/cadastro')}
                className="text-[#0057FF]"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <img 
                src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png" 
                alt="Banco Pro" 
                className="h-12 w-auto"
              />
              <div className="w-10" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#0057FF]">Cadastro Pessoa Física</CardTitle>
            <p className="text-muted-foreground">Preencha seus dados pessoais</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  onChange={handleInputChange}
                  required
                  className="h-12"
                />
              </div>
              <div>
                <Input
                  type="tel"
                  name="telefone"
                  placeholder="Telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  required
                  className="h-12"
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
                {isLoading ? 'Cadastrando...' : 'Criar Conta'}
              </Button>
            </form>
            
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-700">
                📧 Após o cadastro, você receberá um email de confirmação. Clique no link para ativar sua conta.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CadastroPF;
