import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const RecargaCelular = () => {
  const navigate = useNavigate();
  const [selectedOperator, setSelectedOperator] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedValue, setSelectedValue] = useState(0);

  const operators = [
    { id: 'vivo', name: 'Vivo', logo: '🟦', color: 'bg-purple-600' },
    { id: 'claro', name: 'Claro', logo: '🔴', color: 'bg-red-600' },
    { id: 'tim', name: 'TIM', logo: '🔵', color: 'bg-blue-600' },
    { id: 'oi', name: 'Oi', logo: '🟡', color: 'bg-yellow-600' }
  ];

  const rechargeValues = [10, 15, 20, 25, 30, 50, 100];

  const handleRecharge = () => {
    if (!selectedOperator || !phoneNumber || !selectedValue) {
      toast.error('Preencha todos os campos');
      return;
    }
    
    toast.success(`Recarga de R$ ${selectedValue} realizada com sucesso!`);
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-[#001B3A] to-[#003F5C] text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/home')}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Recarga de Celular</h1>
              <p className="text-blue-100">Recarregue seu celular rapidamente</p>
            </div>
          </div>
          <Phone className="w-8 h-8" />
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-md space-y-6">
        {/* Seleção de Operadora */}
        <Card>
          <CardHeader>
            <CardTitle>Selecione a Operadora</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {operators.map((operator) => (
                <button
                  key={operator.id}
                  onClick={() => setSelectedOperator(operator.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedOperator === operator.id 
                      ? `${operator.color} text-white border-transparent` 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-2xl">{operator.logo}</span>
                    <span className="font-medium">{operator.name}</span>
                    {selectedOperator === operator.id && (
                      <Check className="w-4 h-4" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Número do Telefone */}
        {selectedOperator && (
          <Card>
            <CardHeader>
              <CardTitle>Número do Telefone</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="phone">Número</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Valores de Recarga */}
        {selectedOperator && phoneNumber && (
          <Card>
            <CardHeader>
              <CardTitle>Valor da Recarga</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {rechargeValues.map((value) => (
                  <button
                    key={value}
                    onClick={() => setSelectedValue(value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedValue === value 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    R$ {value}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Confirmação */}
        {selectedOperator && phoneNumber && selectedValue > 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Recarga para</p>
                  <p className="font-semibold text-lg">{phoneNumber}</p>
                  <p className="text-sm text-gray-600">
                    {operators.find(op => op.id === selectedOperator)?.name}
                  </p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    R$ {selectedValue}
                  </p>
                </div>
                <Button 
                  onClick={handleRecharge}
                  className="w-full bg-gradient-to-r from-[#001B3A] to-[#003F5C]"
                >
                  Confirmar Recarga
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RecargaCelular;