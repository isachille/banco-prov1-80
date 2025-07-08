
import React from 'react';
import { CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const CreditCards = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white flex items-center justify-between">
          <span>Meus Cartões</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-[#6B46C1] hover:bg-[#6B46C1]/10"
            onClick={() => navigate('/cartoes')}
          >
            Ver todos
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-[#6B46C1] to-[#8B5CF6] rounded-full flex items-center justify-center mb-4">
            <CreditCard className="h-8 w-8 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Você ainda não possui cartões
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Solicite seu primeiro cartão e tenha mais praticidade no dia a dia
          </p>
          <Button
            onClick={() => navigate('/cartoes')}
            className="bg-gradient-to-r from-[#6B46C1] to-[#8B5CF6] hover:from-[#553C9A] hover:to-[#7C3AED]"
          >
            Solicitar Cartão
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
