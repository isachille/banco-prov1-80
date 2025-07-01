import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Pendente from "./pages/Pendente";
import Recusado from "./pages/Recusado";
import CadastroTipo from "./pages/CadastroTipo";
import CadastroPF from "./pages/CadastroPF";
import CadastroPJ from "./pages/CadastroPJ";
import ContaAnalise from "./pages/ContaAnalise";
import PainelAdmin from "./pages/PainelAdmin";
import Home from "./pages/Home";
import Cartoes from "./pages/Cartoes";
import Transferir from "./pages/Transferir";
import Pagar from "./pages/Pagar";
import Investir from "./pages/Investir";
import Configuracoes from "./pages/Configuracoes";
import Ajuda from "./pages/Ajuda";
import Pix from "./pages/Pix";
import Ted from "./pages/Ted";
import Cobranca from "./pages/Cobranca";
import Extrato from "./pages/Extrato";
import Financiamento from "./pages/Financiamento";
import Perfil from "./pages/Perfil";
import GiftCards from "./pages/GiftCards";
import OpenFinance from "./pages/OpenFinance";
import Cofrinho from "./pages/Cofrinho";
import TransacoesGlobais from "./pages/TransacoesGlobais";
import RealocacaoFundos from "./pages/RealocacaoFundos";
import Auditoria from "./pages/Auditoria";
import NotFound from "./pages/NotFound";
import AguardandoAprovacao from "./pages/AguardandoAprovacao";
import ContaRecusada from "./pages/ContaRecusada";
import Confirmado from "./pages/Confirmado";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/login" element={<Login />} />
            <Route path="/pendente" element={<Pendente />} />
            <Route path="/recusado" element={<Recusado />} />
            <Route path="/confirmado" element={<Confirmado />} />
            <Route path="/cadastro" element={<CadastroTipo />} />
            <Route path="/cadastro-pf" element={<CadastroPF />} />
            <Route path="/cadastro-pj" element={<CadastroPJ />} />
            <Route path="/conta-analise" element={<ContaAnalise />} />
            <Route path="/aguardando-aprovacao" element={<AguardandoAprovacao />} />
            <Route path="/conta-recusada" element={<ContaRecusada />} />
            
            {/* Rota protegida para Admin */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly={true} requireActive={false}>
                  <PainelAdmin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/painel-admin" 
              element={
                <ProtectedRoute adminOnly={true} requireActive={false}>
                  <PainelAdmin />
                </ProtectedRoute>
              } 
            />
            
            {/* Rotas protegidas que requerem usuário ativo */}
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <Layout><Home /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cartoes" 
              element={
                <ProtectedRoute>
                  <Layout><Cartoes /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/transferir" 
              element={
                <ProtectedRoute>
                  <Layout><Transferir /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pagar" 
              element={
                <ProtectedRoute>
                  <Layout><Pagar /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/investir" 
              element={
                <ProtectedRoute>
                  <Layout><Investir /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/configuracoes" 
              element={
                <ProtectedRoute>
                  <Layout><Configuracoes /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ajuda" 
              element={
                <ProtectedRoute>
                  <Layout><Ajuda /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pix" 
              element={
                <ProtectedRoute>
                  <Layout><Pix /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ted" 
              element={
                <ProtectedRoute>
                  <Layout><Ted /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cobranca" 
              element={
                <ProtectedRoute>
                  <Layout><Cobranca /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/extrato" 
              element={
                <ProtectedRoute>
                  <Layout><Extrato /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/perfil" 
              element={
                <ProtectedRoute>
                  <Layout><Perfil /></Layout>
                </ProtectedRoute>
              } 
            />
            
            {/* Rotas especiais protegidas */}
            <Route 
              path="/transacoes-globais" 
              element={
                <ProtectedRoute adminOnly={true} requireActive={false}>
                  <TransacoesGlobais />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/realocacao-fundos" 
              element={
                <ProtectedRoute adminOnly={true} requireActive={false}>
                  <RealocacaoFundos />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/auditoria" 
              element={
                <ProtectedRoute adminOnly={true} requireActive={false}>
                  <Auditoria />
                </ProtectedRoute>
              } 
            />
            
            {/* Rotas sem proteção específica */}
            <Route path="/financiamento" element={<Financiamento />} />
            <Route path="/gift-cards" element={<GiftCards />} />
            <Route path="/open-finance" element={<OpenFinance />} />
            <Route path="/cofrinho" element={<Cofrinho />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
