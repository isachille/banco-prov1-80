import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const TestRegister = () => {
  const [formData, setFormData] = useState({
    email: 'isac.soares23@gmail.com',
    senha: 'a33776734',
    nome_completo: 'Isac Soares',
    cpf_cnpj: '12345678901',
    tipo: 'PF'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Chave API que estava funcionando
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqY3Zwb3p3anl5ZGJlZ3Jjc2txIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNDU1NzYsImV4cCI6MjA2NjgyMTU3Nn0.ndEdb2KTe0LfPfFis41H4hU4mNBnlvizcHhYtIBkeUE';

  const handleTestRegister = async () => {
    setIsLoading(true);
    
    try {
      console.log('Iniciando cadastro de teste:', formData);
      
      // Fazer cadastro usando Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
        options: {
          data: {
            nome_completo: formData.nome_completo,
            cpf_cnpj: formData.cpf_cnpj,
            tipo: formData.tipo
          }
        }
      });

      if (error) {
        console.error('Erro no cadastro:', error);
        toast.error('Erro no cadastro: ' + error.message);
        return;
      }

      if (data.user && data.session) {
        console.log('Cadastro realizado:', data);
        
        // Salvar token para usar na chamada REST
        const token = data.session.access_token;
        const userId = data.user.id;
        
        // Inserir dados na tabela users via REST API
        const response = await fetch('https://hjcvpozwjyydbegrcskq.supabase.co/rest/v1/users', {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: userId,
            email: formData.email,
            nome_completo: formData.nome_completo,
            cpf_cnpj: formData.cpf_cnpj,
            tipo: formData.tipo,
            role: formData.email === 'isac.soares23@gmail.com' ? 'dono' : 'usuario',
            status: 'ativo'
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Erro ao inserir dados do usuário:', errorData);
          toast.error('Erro ao salvar dados: ' + JSON.stringify(errorData));
          return;
        }

        console.log('Dados do usuário salvos via REST API');

        // Criar carteira para o usuário
        const walletResponse = await fetch('https://hjcvpozwjyydbegrcskq.supabase.co/rest/v1/wallets', {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id: userId,
            saldo: 1000,
            status: 'ativa'
          })
        });

        if (!walletResponse.ok) {
          const walletErrorData = await walletResponse.json();
          console.error('Erro ao criar carteira:', walletErrorData);
          toast.error('Erro ao criar carteira: ' + JSON.stringify(walletErrorData));
          return;
        }

        console.log('Carteira criada via REST API');

        toast.success('Usuário de teste criado com sucesso!');
        console.log('Token de acesso:', token);
        console.log('User ID:', userId);
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      toast.error('Erro no cadastro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestLogin = async () => {
    try {
      console.log('Tentando login com email:', formData.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.senha
      });

      if (error) {
        console.error('Erro detalhado no login:', error);
        toast.error('Erro no login de teste: ' + error.message);
        return;
      }

      if (data.session) {
        toast.success('Login de teste realizado!');
        console.log('Token:', data.session.access_token);
        console.log('User ID:', data.user?.id);
        
        // Salvar no localStorage para teste
        localStorage.setItem('token', data.session.access_token);
        localStorage.setItem('user_id', data.user?.id || '');
      }
    } catch (error) {
      console.error('Erro no login de teste:', error);
      toast.error('Erro no login de teste');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#0057FF]">
          Cadastro de Teste
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Criar usuário de teste para validar token e funcionalidades
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleInputChange}
            className="h-10"
          />
        </div>
        <div>
          <Input
            type="password"
            name="senha"
            placeholder="Senha"
            value={formData.senha}
            onChange={handleInputChange}
            className="h-10"
          />
        </div>
        <div>
          <Input
            type="text"
            name="nome_completo"
            placeholder="Nome Completo"
            value={formData.nome_completo}
            onChange={handleInputChange}
            className="h-10"
          />
        </div>
        <div>
          <Input
            type="text"
            name="cpf_cnpj"
            placeholder="CPF"
            value={formData.cpf_cnpj}
            onChange={handleInputChange}
            className="h-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleTestRegister}
            className="flex-1 bg-[#0057FF] hover:bg-[#0047CC] text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Cadastrando...' : 'Cadastrar Teste'}
          </Button>
          
          <Button
            onClick={handleTestLogin}
            variant="outline"
            className="flex-1"
          >
            Login Teste
          </Button>
        </div>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p className="text-xs text-gray-600">
            <strong>Dados pré-definidos:</strong><br/>
            Email: {formData.email}<br/>
            Senha: {formData.senha}<br/>
            Será criado como admin e com saldo inicial de R$ 1.000
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestRegister;
