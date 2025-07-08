
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { FloatingChatButton } from '@/components/FloatingChatButton';

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
import Cartoes from '@/pages/Cartoes';
import PIX from '@/pages/PIX';
import Transferir from '@/pages/Transferir';
import Pagar from '@/pages/Pagar';
import Cofrinho from '@/pages/Cofrinho';
import Investimentos from '@/pages/Investimentos';
import GiftCardsPage from '@/pages/GiftCardsPage';
import TransacoesGlobais from '@/pages/TransacoesGlobais';
import Configuracoes from '@/pages/Configuracoes';
import Perfil from '@/pages/Perfil';
import Ajuda from '@/pages/Ajuda';
import Cripto from '@/pages/Cripto';
import Consorcio from '@/pages/Consorcio';
import Emprestimo from '@/pages/Emprestimo';
import Chatbot from '@/pages/Chatbot';
import Transferencias from '@/pages/Transferencias';
import Ted from '@/pages/Ted';
import OpenFinance from '@/pages/OpenFinance';
import PixAdmin from '@/pages/PixAdmin';

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/splash" element={<Splash />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<CadastroTipo />} />
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
              
              {/* Configuration routes */}
              <Route path="/configuracoes" element={
                <ProtectedRoute>
                  <Configuracoes />
                </ProtectedRoute>
              } />
              <Route path="/perfil" element={
                <ProtectedRoute>
                  <Perfil />
                </ProtectedRoute>
              } />
              <Route path="/ajuda" element={
                <ProtectedRoute>
                  <Ajuda />
                </ProtectedRoute>
              } />
              
              {/* Banking routes */}
              <Route path="/transferir" element={
                <ProtectedRoute>
                  <Transferir />
                </ProtectedRoute>
              } />
              <Route path="/transferencias" element={
                <ProtectedRoute>
                  <Transferencias />
                </ProtectedRoute>
              } />
              <Route path="/ted" element={
                <ProtectedRoute>
                  <Ted />
                </ProtectedRoute>
              } />
              <Route path="/pix" element={
                <ProtectedRoute>
                  <PIX />
                </ProtectedRoute>
              } />
              <Route path="/pix-admin" element={
                <ProtectedRoute>
                  <PixAdmin />
                </ProtectedRoute>
              } />
              <Route path="/pagar" element={
                <ProtectedRoute>
                  <Pagar />
                </ProtectedRoute>
              } />
              <Route path="/cartoes" element={
                <ProtectedRoute>
                  <Cartoes />
                </ProtectedRoute>
              } />
              <Route path="/cofrinho" element={
                <ProtectedRoute>
                  <Cofrinho />
                </ProtectedRoute>
              } />
              <Route path="/investimentos" element={
                <ProtectedRoute>
                  <Investimentos />
                </ProtectedRoute>
              } />
              <Route path="/gift-cards" element={
                <ProtectedRoute>
                  <GiftCardsPage />
                </ProtectedRoute>
              } />
              <Route path="/open-finance" element={
                <ProtectedRoute>
                  <OpenFinance />
                </ProtectedRoute>
              } />
              
              {/* New routes */}
              <Route path="/cripto" element={
                <ProtectedRoute>
                  <Cripto />
                </ProtectedRoute>
              } />
              <Route path="/consorcio" element={
                <ProtectedRoute>
                  <Consorcio />
                </ProtectedRoute>
              } />
              <Route path="/emprestimo" element={
                <ProtectedRoute>
                  <Emprestimo />
                </ProtectedRoute>
              } />
              <Route path="/chatbot" element={
                <ProtectedRoute>
                  <Chatbot />
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
              <Route path="/transacoes-globais" element={
                <ProtectedRoute adminOnly>
                  <TransacoesGlobais />
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
            <FloatingChatButton />
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
