
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, Send, History, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AdminTransferencias = () => {
  const { toast } = useToast();
  const [transferencia, setTransferencia] = useState({
    origem: '',
    destino: '',
    valor: '',
    descricao: ''
  });

  const usuarios = [
    { id: 'user1', nome: 'João Silva', saldo: 1500.00 },
    { id: 'user2', nome: 'Maria Santos', saldo: 850.00 },
    { id: 'user3', nome: 'Carlos Lima', saldo: 2300.00 }
  ];

  const transferenciasRecentes = [
    {
      id: '1',
      data: '2024-01-15 15:20',
      origem: 'João Silva',
      destino: 'Maria Santos',
      valor: 250.00,
      status: 'Concluída'
    },
    {
      id: '2',
      data: '2024-01-15 12:10',
      origem: 'Carlos Lima',
      destino: 'João Silva',
      valor: 100.00,
      status: 'Concluída'
    }
  ];

  const handleTransferencia = async () => {
    if (!transferencia.origem || !transferencia.destino || !transferencia.valor) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.rpc('transferir_saldo', {
        p_de: transferencia.origem,
        p_para: transferencia.destino,
        p_valor: parseFloat(transferencia.valor)
      });

      if (error) throw error;

      toast({
        title: "✅ Transferência realizada com sucesso",
        description: `R$ ${parseFloat(transferencia.valor).toFixed(2)} transferidos`,
      });

      setTransferencia({ origem: '', destino: '', valor: '', descricao: '' });
    } catch (error: any) {
      toast({
        title: "Erro na transferência",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transferências Administrativas</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Realizar Transferência */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Nova Transferência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Conta Origem</label>
              <Select value={transferencia.origem} onValueChange={(value) => setTransferencia({...transferencia, origem: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar conta origem" />
                </SelectTrigger>
                <SelectContent>
                  {usuarios.map((usuario) => (
                    <SelectItem key={usuario.id} value={usuario.id}>
                      {usuario.nome} - Saldo: R$ {usuario.saldo.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <ArrowRightLeft className="h-6 w-6 text-gray-400" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Conta Destino</label>
              <Select value={transferencia.destino} onValueChange={(value) => setTransferencia({...transferencia, destino: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar conta destino" />
                </SelectTrigger>
                <SelectContent>
                  {usuarios
                    .filter(user => user.id !== transferencia.origem)
                    .map((usuario) => (
                      <SelectItem key={usuario.id} value={usuario.id}>
                        {usuario.nome} - Saldo: R$ {usuario.saldo.toFixed(2)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Valor (R$)</label>
              <Input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={transferencia.valor}
                onChange={(e) => setTransferencia({...transferencia, valor: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Descrição (opcional)</label>
              <Input
                placeholder="Motivo da transferência"
                value={transferencia.descricao}
                onChange={(e) => setTransferencia({...transferencia, descricao: e.target.value})}
              />
            </div>

            <Button 
              className="w-full flex items-center gap-2"
              onClick={handleTransferencia}
            >
              <Send className="h-4 w-4" />
              Realizar Transferência
            </Button>
          </CardContent>
        </Card>

        {/* Saldos dos Usuários */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Saldos Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {usuarios.map((usuario) => (
                <div key={usuario.id} className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium">{usuario.nome}</h4>
                    <p className="text-sm text-gray-500">ID: {usuario.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      R$ {usuario.saldo.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">Disponível</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Histórico de Transferências */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico de Transferências
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Data/Hora</th>
                  <th className="text-left p-4 font-medium">Origem</th>
                  <th className="text-left p-4 font-medium">Destino</th>
                  <th className="text-left p-4 font-medium">Valor</th>
                  <th className="text-left p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {transferenciasRecentes.map((trans) => (
                  <tr key={trans.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-4">{trans.data}</td>
                    <td className="p-4">{trans.origem}</td>
                    <td className="p-4">{trans.destino}</td>
                    <td className="p-4">
                      <span className="text-blue-600 font-medium">
                        R$ {trans.valor.toFixed(2)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {trans.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTransferencias;
