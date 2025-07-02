
import React, { useState, useEffect } from 'react';
import { ArrowLeft, PiggyBank, Plus, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const Cofrinho = () => {
  const navigate = useNavigate();
  const [savings, setSavings] = useState([
    { id: 1, name: 'Viagem para Europa', target: 15000, current: 3500, color: 'bg-blue-500' },
    { id: 2, name: 'Reserva de Emergência', target: 10000, current: 7800, color: 'bg-green-500' },
    { id: 3, name: 'Novo Carro', target: 50000, current: 12000, color: 'bg-red-500' }
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="p-6 space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Cofrinho</h1>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Meta
        </Button>
      </div>

      <Card className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm">Total Economizado</p>
              <p className="text-2xl font-bold">
                {formatCurrency(savings.reduce((acc, saving) => acc + saving.current, 0))}
              </p>
            </div>
            <PiggyBank className="h-12 w-12 text-pink-100" />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {savings.map((saving) => (
          <Card key={saving.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full ${saving.color}`} />
                  <span>{saving.name}</span>
                </div>
                <Target className="h-5 w-5 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>{formatCurrency(saving.current)}</span>
                <span>{formatCurrency(saving.target)}</span>
              </div>
              <Progress value={getProgress(saving.current, saving.target)} className="h-2" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {getProgress(saving.current, saving.target).toFixed(1)}% da meta
                </span>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Depositar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Cofrinho;
