
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import BankingNavigation from "./components/BankingNavigation";
import ProtectedRoute from "./components/ProtectedRoute";

// Existing pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import CadastroTipo from "./pages/CadastroTipo";
import CadastroPF from "./pages/CadastroPF";
import CadastroPJ from "./pages/CadastroPJ";
import ConfirmeEmail from "./pages/ConfirmeEmail";
import EmailConfirmado from "./pages/EmailConfirmado";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import PainelAdmin from "./pages/PainelAdmin";
import Extrato from "./pages/Extrato";
import Cartoes from "./pages/Cartoes";
import Ted from "./pages/Ted";
import Transferir from "./pages/Transferir";
import Cobranca from "./pages/Cobranca";
import Pagar from "./pages/Pagar";
import Investir from "./pages/Investir";
import Financiamento from "./pages/Financiamento";
import OpenFinance from "./pages/OpenFinance";
import RealocacaoFundos from "./pages/RealocacaoFundos";
import TransacoesGlobais from "./pages/TransacoesGlobais";
import Auditoria from "./pages/Auditoria";
import Cofrinho from "./pages/Cofrinho";
import Perfil from "./pages/Perfil";
import Configuracoes from "./pages/Configuracoes";
import Ajuda from "./pages/Ajuda";
import Splash from "./pages/Splash";
import ContaAnalise from "./pages/ContaAnalise";
import ContaRecusada from "./pages/ContaRecusada";
import AguardandoAprovacao from "./pages/AguardandoAprovacao";
import Confirmacao from "./pages/Confirmacao";
import Confirmado from "./pages/Confirmado";
import Pendente from "./pages/Pendente";
import Recusado from "./pages/Recusado";
import GiftCards from "./pages/GiftCards";
import NotFound from "./pages/NotFound";

// New banking pages
import Dashboard from "./pages/Dashboard";
import PIX from "./pages/PIX";
import Transferencias from "./pages/Transferencias";
import ExtratoPage from "./pages/ExtratoPage";
import FinancingPage from "./pages/FinancingPage";
import GiftCardsPage from "./pages/GiftCardsPage";
import Investimentos from "./pages/Investimentos";
import AdminUsers from "./pages/AdminUsers";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminExtrato from "./pages/admin/AdminExtrato";
import AdminPix from "./pages/admin/AdminPix";
import AdminTransferencias from "./pages/admin/AdminTransferencias";
import AdminPagamentos from "./pages/admin/AdminPagamentos";
import AdminCobrancas from "./pages/admin/AdminCobrancas";
import AdminArquivos from "./pages/admin/AdminArquivos";
import AdminCedentes from "./pages/admin/AdminCedentes";
import AdminBureaux from "./pages/admin/AdminBureaux";
import AdminRelatorios from "./pages/admin/AdminRelatorios";
import AdminConta from "./pages/admin/AdminConta";
import AdminConfiguracoes from "./pages/admin/AdminConfiguracoes";

const queryClient = new QueryClient();

// Layout wrapper for banking pages
const BankingLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50">
    {children}
    <BankingNavigation />
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/splash" element={<Splash />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<CadastroTipo />} />
              <Route path="/cadastro-pf" element={<CadastroPF />} />
              <Route path="/cadastro-pj" element={<CadastroPJ />} />
              <Route path="/confirme-email" element={<ConfirmeEmail />} />
              <Route path="/email-confirmado" element={<EmailConfirmado />} />
              <Route path="/conta-analise" element={<ContaAnalise />} />
              <Route path="/conta-recusada" element={<ContaRecusada />} />
              <Route path="/aguardando-aprovacao" element={<AguardandoAprovacao />} />
              <Route path="/confirmacao" element={<Confirmacao />} />
              <Route path="/confirmado" element={<Confirmado />} />
              <Route path="/pendente" element={<Pendente />} />
              <Route path="/recusado" element={<Recusado />} />
              <Route path="/gift-cards" element={<GiftCards />} />
              
              {/* Banking App Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <BankingLayout>
                    <Dashboard />
                  </BankingLayout>
                </ProtectedRoute>
              } />
              <Route path="/pix" element={
                <ProtectedRoute>
                  <BankingLayout>
                    <PIX />
                  </BankingLayout>
                </ProtectedRoute>
              } />
              <Route path="/transferencias" element={
                <ProtectedRoute>
                  <BankingLayout>
                    <Transferencias />
                  </BankingLayout>
                </ProtectedRoute>
              } />
              <Route path="/extrato-page" element={
                <ProtectedRoute>
                  <BankingLayout>
                    <ExtratoPage />
                  </BankingLayout>
                </ProtectedRoute>
              } />
              <Route path="/financing-page" element={
                <ProtectedRoute>
                  <BankingLayout>
                    <FinancingPage />
                  </BankingLayout>
                </ProtectedRoute>
              } />
              <Route path="/gift-cards-page" element={
                <ProtectedRoute>
                  <BankingLayout>
                    <GiftCardsPage />
                  </BankingLayout>
                </ProtectedRoute>
              } />
              <Route path="/cofrinho" element={
                <ProtectedRoute>
                  <BankingLayout>
                    <Cofrinho />
                  </BankingLayout>
                </ProtectedRoute>
              } />
              <Route path="/investimentos" element={
                <ProtectedRoute>
                  <BankingLayout>
                    <Investimentos />
                  </BankingLayout>
                </ProtectedRoute>
              } />

              {/* Admin Banking Routes */}
              <Route path="/admin/users" element={
                <ProtectedRoute adminOnly>
                  <BankingLayout>
                    <AdminUsers />
                  </BankingLayout>
                </ProtectedRoute>
              } />
              
              {/* Mobile Layout Routes (legacy) */}
              <Route path="/home" element={<Layout><Home /></Layout>} />
              <Route path="/extrato" element={<Layout><Extrato /></Layout>} />
              <Route path="/cartoes" element={<Layout><Cartoes /></Layout>} />
              <Route path="/ted" element={<Layout><Ted /></Layout>} />
              <Route path="/transferir" element={<Layout><Transferir /></Layout>} />
              <Route path="/cobranca" element={<Layout><Cobranca /></Layout>} />
              <Route path="/pagar" element={<Layout><Pagar /></Layout>} />
              <Route path="/investir" element={<Layout><Investir /></Layout>} />
              <Route path="/financiamento" element={<Layout><Financiamento /></Layout>} />
              <Route path="/open-finance" element={<Layout><OpenFinance /></Layout>} />
              <Route path="/realocacao-fundos" element={<Layout><RealocacaoFundos /></Layout>} />
              <Route path="/transacoes-globais" element={<Layout><TransacoesGlobais /></Layout>} />
              <Route path="/auditoria" element={<Layout><Auditoria /></Layout>} />
              <Route path="/perfil" element={<Layout><Perfil /></Layout>} />
              <Route path="/configuracoes" element={<Layout><Configuracoes /></Layout>} />
              <Route path="/ajuda" element={<Layout><Ajuda /></Layout>} />
              
              {/* Admin Routes - Painel integrado */}
              <Route path="/admin" element={<Admin />} />
              <Route path="/painel-admin" element={<PainelAdmin />} />
              
              {/* Admin Layout Routes (legacy) */}
              <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
              <Route path="/admin/extrato" element={<AdminLayout><AdminExtrato /></AdminLayout>} />
              <Route path="/admin/pix" element={<AdminLayout><AdminPix /></AdminLayout>} />
              <Route path="/admin/transferencias" element={<AdminLayout><AdminTransferencias /></AdminLayout>} />
              <Route path="/admin/pagamentos" element={<AdminLayout><AdminPagamentos /></AdminLayout>} />
              <Route path="/admin/cobrancas" element={<AdminLayout><AdminCobrancas /></AdminLayout>} />
              <Route path="/admin/arquivos" element={<AdminLayout><AdminArquivos /></AdminLayout>} />
              <Route path="/admin/cedentes" element={<AdminLayout><AdminCedentes /></AdminLayout>} />
              <Route path="/admin/bureaux" element={<AdminLayout><AdminBureaux /></AdminLayout>} />
              <Route path="/admin/relatorios" element={<AdminLayout><AdminRelatorios /></AdminLayout>} />
              <Route path="/admin/conta" element={<AdminLayout><AdminConta /></AdminLayout>} />
              <Route path="/admin/configuracoes" element={<AdminLayout><AdminConfiguracoes /></AdminLayout>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
