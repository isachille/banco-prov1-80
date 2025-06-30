
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Confirmacao from "./pages/Confirmacao";
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
            <Route path="/confirmacao" element={<Confirmacao />} />
            <Route path="/cadastro" element={<CadastroTipo />} />
            <Route path="/cadastro-pf" element={<CadastroPF />} />
            <Route path="/cadastro-pj" element={<CadastroPJ />} />
            <Route path="/conta-analise" element={<ContaAnalise />} />
            <Route path="/painel-admin" element={<PainelAdmin />} />
            <Route path="/transacoes-globais" element={<TransacoesGlobais />} />
            <Route path="/realocacao-fundos" element={<RealocacaoFundos />} />
            <Route path="/auditoria" element={<Auditoria />} />
            <Route path="/home" element={<Layout><Home /></Layout>} />
            <Route path="/cartoes" element={<Layout><Cartoes /></Layout>} />
            <Route path="/transferir" element={<Layout><Transferir /></Layout>} />
            <Route path="/pagar" element={<Layout><Pagar /></Layout>} />
            <Route path="/investir" element={<Layout><Investir /></Layout>} />
            <Route path="/configuracoes" element={<Layout><Configuracoes /></Layout>} />
            <Route path="/ajuda" element={<Layout><Ajuda /></Layout>} />
            <Route path="/pix" element={<Layout><Pix /></Layout>} />
            <Route path="/ted" element={<Layout><Ted /></Layout>} />
            <Route path="/cobranca" element={<Layout><Cobranca /></Layout>} />
            <Route path="/extrato" element={<Layout><Extrato /></Layout>} />
            <Route path="/perfil" element={<Layout><Perfil /></Layout>} />
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
