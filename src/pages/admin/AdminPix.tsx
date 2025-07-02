
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Smartphone, Send, QrCode, History } from 'lucide-react';

const AdminPix = () => {
  const [pixData, setPixData] = useState({
    chave: '',
    valor: '',
    descricao: '',
    remetente: ''
  });

  const pixRecentes = [
    {
      id: '1',
      data: '2024-01-15 14:30',
      chave: 'joao@email.com',
      valor: 250.00,
      status: 'Concluído',
      tipo: 'Enviado'
    },
    {
      id: '2',
      data: '2024-01-15 12:15',
      chave: '11999999999',
      valor: 100.00,
      status: 'Concluído',
      tipo: 'Recebido'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">PIX Administrativo</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enviar PIX */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Enviar PIX
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Usuário Remetente</label>
              <Select value={pixData.remetente} onValueChange={(value) => setPixData({...pixData, remetente: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user1">João Silva</SelectItem>
                  <SelectItem value="user2">Maria Santos</SelectItem>
                  <SelectItem value="user3">Carlos Lima</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Chave PIX Destinatário</label>
              <Input
                placeholder="email@exemplo.com, CPF, telefone ou chave aleatória"
                value={pixData.chave}
                onChange={(e) => setPixData({...pixData, chave: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Valor (R$)</label>
              <Input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={pixData.valor}
                onChange={(e) => setPixData({...pixData, valor: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Descrição (opcional)</label>
              <Input
                placeholder="Descrição da transferência"
                value={pixData.descricao}
                onChange={(e) => setPixData({...pixData, descricao: e.target.value})}
              />
            </div>

            <Button className="w-full flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Enviar PIX
            </Button>
          </CardContent>
        </Card>

        {/* Configurações PIX */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Configurações PIX
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
              <QrCode className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-sm text-gray-600">QR Code PIX</p>
              <p className="text-xs text-gray-500 mt-2">Gere um QR Code para recebimentos</p>
              <Button variant="outline" className="mt-4">
                Gerar QR Code
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Chaves PIX Cadastradas</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="text-sm">admin@bancoPro.com</span>
                  <span className="text-xs text-gray-500">Email</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="text-sm">+55 11 99999-9999</span>
                  <span className="text-xs text-gray-500">Telefone</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Histórico PIX */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico PIX
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Data/Hora</th>
                  <th className="text-left p-4 font-medium">Chave</th>
                  <th className="text-left p-4 font-medium">Valor</th>
                  <th className="text-left p-4 font-medium">Tipo</th>
                  <th className="text-left p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {pixRecentes.map((pix) => (
                  <tr key={pix.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-4">{pix.data}</td>
                    <td className="p-4">{pix.chave}</td>
                    <td className="p-4">
                      <span className={pix.tipo === 'Recebido' ? 'text-green-600' : 'text-red-600'}>
                        {pix.tipo === 'Recebido' ? '+' : '-'}R$ {pix.valor.toFixed(2)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        pix.tipo === 'Recebido' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {pix.tipo}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {pix.status}
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

export default AdminPix;
