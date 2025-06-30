
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const Auditoria = () => {
  const navigate = useNavigate();

  const mockLogs = [
    {
      id: 1,
      data: '2024-06-30 14:30:15',
      admin: 'Isac Soares',
      acao: 'Realocação de Fundos',
      usuario_afetado: 'João Silva',
      valor: 1500.00,
      motivo: 'CONTESTAÇÃO',
      status: 'Executado'
    },
    {
      id: 2,
      data: '2024-06-29 11:20:45',
      admin: 'Isac Soares',
      acao: 'Bloqueio de Conta',
      usuario_afetado: 'Maria Santos',
      valor: 0,
      motivo: 'OPERAÇÃO DE RISCO',
      status: 'Executado'
    },
    {
      id: 3,
      data: '2024-06-28 09:15:30',
      admin: 'Isac Soares',
      acao: 'Alocação Cofrinho',
      usuario_afetado: 'Pedro Costa',
      valor: 5000.00,
      motivo: 'Energia Solar',
      status: 'Executado'
    }
  ];

  const resumoSeguranca = {
    totalAcoes: 15,
    valorMovimentado: 45000.00,
    contasBloqueadas: 3,
    ultimaAuditoria: '2024-06-30 18:00:00'
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
              <h1 className="text-2xl font-bold">Sistema de Auditoria</h1>
              <p className="text-blue-100">Rastreamento completo de ações administrativas</p>
            </div>
          </div>
          <Shield className="w-8 h-8" />
        </div>
      </div>

      <div className="p-6">
        {/* Resumo de Segurança */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total de Ações</p>
                  <p className="text-2xl font-bold">{resumoSeguranca.totalAcoes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Valor Movimentado</p>
                  <p className="text-2xl font-bold">R$ {(resumoSeguranca.valorMovimentado / 1000).toFixed(0)}K</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Contas Bloqueadas</p>
                  <p className="text-2xl font-bold">{resumoSeguranca.contasBloqueadas}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-muted-foreground">Última Auditoria</p>
                <p className="font-medium">{resumoSeguranca.ultimaAuditoria}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Log de Ações */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Ações Administrativas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Administrador</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Usuário Afetado</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">{log.data}</TableCell>
                    <TableCell className="font-medium">{log.admin}</TableCell>
                    <TableCell>{log.acao}</TableCell>
                    <TableCell>{log.usuario_afetado}</TableCell>
                    <TableCell>
                      {log.valor > 0 ? `R$ ${log.valor.toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.motivo}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{log.status}</Badge>
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

export default Auditoria;
