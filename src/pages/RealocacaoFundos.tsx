
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const RealocacaoFundos = () => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [valor, setValor] = useState('');
  const [motivo, setMotivo] = useState('');

  const mockUsuarios = [
    { id: 1, nome: 'João Silva', email: 'joao@email.com', saldo: 15000, saldoBloqueado: 0 },
    { id: 2, nome: 'Maria Santos', email: 'maria@email.com', saldo: 8500, saldoBloqueado: 1000 },
    { id: 3, nome: 'Pedro Costa', email: 'pedro@email.com', saldo: 22000, saldoBloqueado: 0 },
    { id: 4, nome: 'Ana Lima', email: 'ana@email.com', saldo: 12300, saldoBloqueado: 500 }
  ];

  const motivosRelocacao = [
    { value: 'bloqueio_medico', label: 'BLOQUEIO MÉDICO' },
    { value: 'contestacao', label: 'CONTESTAÇÃO' },
    { value: 'pagamento_taxa', label: 'PAGAMENTO DE TAXA' },
    { value: 'operacao_risco', label: 'OPERAÇÃO DE RISCO' }
  ];

  const handleRealocacao = () => {
    if (!selectedUser || !valor || !motivo) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const valorNumerico = parseFloat(valor.replace(',', '.'));
    if (valorNumerico > selectedUser.saldo) {
      toast.error('Valor excede o saldo disponível do usuário');
      return;
    }

    // Simular realocação
    console.log('Realocando fundos:', {
      usuario: selectedUser.nome,
      valor: valorNumerico,
      motivo,
      timestamp: new Date().toISOString()
    });

    toast.success(`R$ ${valorNumerico.toFixed(2)} realocados da conta de ${selectedUser.nome}`);
    
    // Reset form
    setSelectedUser(null);
    setValor('');
    setMotivo('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-[#001B3A] to-[#003F5C] text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/painel-admin')}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Realocação de Fundos</h1>
              <p className="text-blue-100">Mover saldo entre subcontas e carteira-mãe</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de Usuários */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Selecionar Usuário</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockUsuarios.map((usuario) => (
                  <div
                    key={usuario.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedUser?.id === usuario.id
                        ? 'border-[#0057FF] bg-blue-50 dark:bg-blue-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setSelectedUser(usuario)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{usuario.nome}</h4>
                        <p className="text-sm text-muted-foreground">{usuario.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">R$ {usuario.saldo.toLocaleString()}</p>
                        {usuario.saldoBloqueado > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            R$ {usuario.saldoBloqueado} bloqueado
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Formulário de Realocação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <span>Executar Realocação</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedUser ? (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-medium">{selectedUser.nome}</h4>
                    <p className="text-sm text-muted-foreground">
                      Saldo disponível: R$ {selectedUser.saldo.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Valor a ser realocado
                    </label>
                    <Input
                      type="text"
                      placeholder="0,00"
                      value={valor}
                      onChange={(e) => setValor(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Motivo da realocação
                    </label>
                    <Select value={motivo} onValueChange={setMotivo}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o motivo" />
                      </SelectTrigger>
                      <SelectContent>
                        {motivosRelocacao.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleRealocacao}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Confirmar Realocação
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Selecione um usuário para continuar
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RealocacaoFundos;
