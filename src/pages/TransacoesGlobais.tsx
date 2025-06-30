
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const TransacoesGlobais = () => {
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState({
    tipo: '',
    periodo: '',
    valor: '',
    busca: ''
  });

  const mockTransacoes = [
    {
      id: 1,
      data: '2024-06-30 14:30',
      cliente: 'João Silva',
      tipo: 'Pix',
      valor: 1500.00,
      origem: 'Banco Pro',
      destino: 'Nubank',
      status: 'Concluído'
    },
    {
      id: 2,
      data: '2024-06-29 09:15',
      cliente: 'Maria Santos',
      tipo: 'Boleto',
      valor: 850.00,
      origem: 'Conta Corrente',
      destino: 'Light',
      status: 'Processando'
    },
    {
      id: 3,
      data: '2024-06-28 16:45',
      cliente: 'Pedro Costa',
      tipo: 'Cofrinho',
      valor: 5000.00,
      origem: 'Conta Corrente',
      destino: 'Fundo Energia Solar',
      status: 'Investido'
    },
    {
      id: 4,
      data: '2024-06-27 11:20',
      cliente: 'Ana Lima',
      tipo: 'TED',
      valor: 2300.00,
      origem: 'Banco Pro',
      destino: 'Itaú',
      status: 'Concluído'
    }
  ];

  const exportarCSV = () => {
    const headers = ['Data', 'Cliente', 'Tipo', 'Valor', 'Origem', 'Destino', 'Status'];
    const csvContent = [
      headers.join(','),
      ...mockTransacoes.map(t => [
        t.data,
        t.cliente,
        t.tipo,
        `R$ ${t.valor.toFixed(2)}`,
        t.origem,
        t.destino,
        t.status
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transacoes_globais.csv';
    a.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluído': return 'default';
      case 'Processando': return 'secondary';
      case 'Investido': return 'outline';
      default: return 'destructive';
    }
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
              <h1 className="text-2xl font-bold">Transações Globais</h1>
              <p className="text-blue-100">Monitoramento completo de movimentações</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filtros e Controles</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cliente..."
                  className="pl-10"
                  value={filtros.busca}
                  onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
                />
              </div>
              
              <Select value={filtros.tipo} onValueChange={(value) => setFiltros({ ...filtros, tipo: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de transação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">Pix</SelectItem>
                  <SelectItem value="ted">TED</SelectItem>
                  <SelectItem value="boleto">Boleto</SelectItem>
                  <SelectItem value="cofrinho">Cofrinho</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filtros.periodo} onValueChange={(value) => setFiltros({ ...filtros, periodo: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hoje">Hoje</SelectItem>
                  <SelectItem value="semana">Esta semana</SelectItem>
                  <SelectItem value="mes">Este mês</SelectItem>
                  <SelectItem value="ano">Este ano</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={exportarCSV} className="bg-[#0057FF] hover:bg-[#0047CC]">
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Transações */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTransacoes.map((transacao) => (
                  <TableRow key={transacao.id}>
                    <TableCell>{transacao.data}</TableCell>
                    <TableCell className="font-medium">{transacao.cliente}</TableCell>
                    <TableCell>{transacao.tipo}</TableCell>
                    <TableCell>R$ {transacao.valor.toFixed(2)}</TableCell>
                    <TableCell>{transacao.origem}</TableCell>
                    <TableCell>{transacao.destino}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(transacao.status)}>
                        {transacao.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransacoesGlobais;
