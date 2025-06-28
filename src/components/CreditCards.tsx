
import React from 'react';
import { CreditCard, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const CreditCards = () => {
  return (
    <Card className="bg-slate-800/50 backdrop-blur border-blue-500/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>Meus Cartões</span>
          <Button variant="ghost" size="icon" className="text-blue-400 hover:bg-blue-500/20">
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gradient-to-r from-slate-700 to-slate-600 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <CreditCard className="h-6 w-6 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">DÉBITO</span>
          </div>
          <div className="space-y-2">
            <p className="text-white text-sm">**** 1234</p>
            <p className="text-gray-300 text-xs">Cartão Principal</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <CreditCard className="h-6 w-6 text-white" />
            <span className="text-white text-sm font-medium">CRÉDITO</span>
          </div>
          <div className="space-y-2">
            <p className="text-white text-sm">**** 5678</p>
            <p className="text-blue-100 text-xs">Limite: R$ 5.000,00</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
