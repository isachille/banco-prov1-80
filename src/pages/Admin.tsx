
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Smartphone, ArrowRightLeft, 
  CreditCard, Receipt, Archive, Users, Building2, 
  BarChart3, User, Settings, Eye, Edit, Filter,
  TrendingUp, TrendingDown, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Admin = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'extrato', label: 'Extrato', icon: FileText },
    { id: 'pix', label: 'Pix', icon: Smartphone },
    { id: 'transferencias', label: 'Transferências', icon: ArrowRightLeft },
    { id: 'pagamentos', label: 'Pagamentos', icon: CreditCard },
    { id: 'cobrancas', label: 'Cobranças', icon: Receipt },
    { id: 'arquivos', label: 'Arquivos', icon: Archive },
    { id: 'cedentes', label: 'Cedentes / Pagadores', icon: Users },
    { id: 'bureaux', label: 'Bureaux', icon: Building2 },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
    { id: 'conta', label: 'Conta / Faturamento', icon: User },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  const summaryCards = [
    {
      title: 'Saldo disponível',
      value: 'R$ 1.500.673,45',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Cobranças a vencer',
      value: 'R$ 900.432,34',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Cobranças vencidas',
      value: 'R$ 2.234,67',
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  const transactions = [
    {
      id: 1,
      data: '01/07/2025',
      nome: 'João Silva Santos',
      tipo: 'PIX Recebido',
      valor: 'R$ 2.500,00',
      saldoAtualizado: 'R$ 1.500.673,45',
      status: 'concluida'
    },
    {
      id: 2,
      data: '01/07/2025',
      nome: 'Empresa ABC Ltda',
      tipo: 'Cobrança Paga',
      valor: 'R$ 15.000,00',
      saldoAtualizado: 'R$ 1.498.173,45',
      status: 'concluida'
    },
    {
      id: 3,
      data: '30/06/2025',
      nome: 'Maria Oliveira',
      tipo: 'TED Enviada',
      valor: '- R$ 8.900,00',
      saldoAtualizado: 'R$ 1.483.173,45',
      status: 'processando'
    },
    {
      id: 4,
      data: '30/06/2025',
      nome: 'Fornecedor XYZ',
      tipo: 'Boleto Pago',
      valor: '- R$ 3.450,00',
      saldoAtualizado: 'R$ 1.492.073,45',
      status: 'concluida'
    },
    {
      id: 5,
      data: '29/06/2025',
      nome: 'Cliente Premium',
      tipo: 'PIX Recebido',
      valor: 'R$ 7.200,00',
      saldoAtualizado: 'R$ 1.495.523,45',
      status: 'concluida'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'concluida':
        return <Badge className="bg-green-100 text-green-800">Concluída</Badge>;
      case 'processando':
        return <Badge className="bg-yellow-100 text-yellow-800">Processando</Badge>;
      case 'pendente':
        return <Badge className="bg-gray-100 text-gray-800">Pendente</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 shadow-sm">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#0057FF] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BP</span>
            </div>
            <span className="text-xl font-bold text-[#0057FF]">Banco Pro</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeMenu === item.id
                  ? 'bg-[#0057FF] text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-4 gap-1 p-2">
          {menuItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`flex flex-col items-center p-2 rounded-lg ${
                activeMenu === item.id
                  ? 'bg-[#0057FF] text-white'
                  : 'text-gray-600'
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 pb-20 lg:pb-0">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
            <p className="text-gray-600 mt-1">Visão geral das operações bancárias</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {summaryCards.map((card, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">{card.title}</p>
                      <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                    </div>
                    <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                      <card.icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Extrato de Transações</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Buscar por nome..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filtrar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="ted">TED</SelectItem>
                        <SelectItem value="boleto">Boleto</SelectItem>
                        <SelectItem value="cobranca">Cobrança</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Nome / Razão</TableHead>
                      <TableHead>Tipo de Transação</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="text-right">Saldo Atualizado</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{transaction.data}</TableCell>
                        <TableCell>{transaction.nome}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{transaction.tipo}</Badge>
                        </TableCell>
                        <TableCell className={`text-right font-semibold ${
                          transaction.valor.startsWith('-') ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {transaction.valor}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {transaction.saldoAtualizado}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(transaction.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center space-x-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
