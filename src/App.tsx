
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import pages
import Index from '@/pages/Index';
import Splash from '@/pages/Splash';
import Login from '@/pages/Login';
import CadastroTipo from '@/pages/CadastroTipo';
import CadastroPF from '@/pages/CadastroPF';
import CadastroPJ from '@/pages/CadastroPJ';
import ConfirmeEmail from '@/pages/ConfirmeEmail';
import EmailConfirmado from '@/pages/EmailConfirmado';
import Confirmacao from '@/pages/Confirmacao';
import Confirmado from '@/pages/Confirmado';
import AguardandoAprovacao from '@/pages/AguardandoAprovacao';
import ContaRecusada from '@/pages/ContaRecusada';
import ContaAnalise from '@/pages/ContaAnalise';
import Home from '@/pages/Home';
import Admin from '@/pages/Admin';
import PainelAdmin from '@/pages/PainelAdmin';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/ProtectedRoute';
import FinancingSimulation from '@/pages/FinancingSimulation';
import PropostasHistorico from '@/pages/PropostasHistorico';
import DetalhesProposta from '@/pages/DetalhesProposta';
import PainelOperador from '@/pages/PainelOperador';
import FinancingAdmin from '@/pages/FinancingAdmin';
import AdminUsers from '@/pages/AdminUsers';

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/splash" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro-tipo" element={<CadastroTipo />} />
          <Route path="/cadastro-pf" element={<CadastroPF />} />
          <Route path="/cadastro-pj" element={<CadastroPJ />} />
          <Route path="/confirme-email" element={<ConfirmeEmail />} />
          <Route path="/email-confirmado" element={<EmailConfirmado />} />
          <Route path="/confirmacao" element={<Confirmacao />} />
          <Route path="/confirmado" element={<Confirmado />} />
          <Route path="/pendente" element={<AguardandoAprovacao />} />
          <Route path="/recusado" element={<ContaRecusada />} />
          <Route path="/analise" element={<ContaAnalise />} />

          {/* Protected routes */}
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          
          {/* Financing routes */}
          <Route path="/simulacao" element={
            <ProtectedRoute>
              <FinancingSimulation />
            </ProtectedRoute>
          } />
          <Route path="/propostas" element={
            <ProtectedRoute>
              <PropostasHistorico />
            </ProtectedRoute>
          } />
          <Route path="/proposta/:id" element={
            <ProtectedRoute>
              <DetalhesProposta />
            </ProtectedRoute>
          } />

          {/* Operator routes */}
          <Route path="/operador" element={
            <ProtectedRoute>
              <PainelOperador />
            </ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/painel-admin" element={
            <ProtectedRoute adminOnly>
              <PainelAdmin />
            </ProtectedRoute>
          } />
          <Route path="/financiamento-admin" element={
            <ProtectedRoute adminOnly>
              <FinancingAdmin />
            </ProtectedRoute>
          } />

          <Route path="/admin/users" element={
            <ProtectedRoute adminOnly>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/relatorios" element={
            <ProtectedRoute adminOnly>
              <div>Relatórios (Em construção)</div>
            </ProtectedRoute>
          } />

          {/* Catch all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </QueryClientProvider>
    </Router>
  );
}

export default App;
