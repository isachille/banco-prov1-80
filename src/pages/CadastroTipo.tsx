
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Building2 } from 'lucide-react';

const CadastroTipo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏦</div>
          <h1 className="text-3xl font-bold text-[#0057FF] mb-2">Banco Pro</h1>
          <p className="text-gray-600">Escolha o tipo de conta que deseja abrir</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => navigate('/cadastro-pf')}
          >
            <CardHeader className="text-center pb-4">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-[#0057FF]" />
              </div>
              <CardTitle className="text-xl text-[#0057FF]">Pessoa Física</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Para você que é pessoa física e quer uma conta completa
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Conta corrente gratuita</li>
                <li>• Cartão de débito e crédito</li>
                <li>• Pix e transferências</li>
                <li>• Investimentos</li>
              </ul>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => navigate('/cadastro-pj')}
          >
            <CardHeader className="text-center pb-4">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-[#0057FF]" />
              </div>
              <CardTitle className="text-xl text-[#0057FF]">Pessoa Jurídica</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Para sua empresa ter uma conta empresarial completa
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Conta empresarial</li>
                <li>• Múltiplos cartões</li>
                <li>• Gestão financeira</li>
                <li>• APIs de integração</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/login')}
            className="text-[#0057FF] hover:underline"
          >
            Já tem conta? Faça login
          </button>
        </div>
      </div>
    </div>
  );
};

export default CadastroTipo;
