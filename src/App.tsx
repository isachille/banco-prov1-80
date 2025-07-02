
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Layout from "./components/Layout";
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
import Pix from "./pages/Pix";
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

const queryClient = new QueryClient();

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
              
              <Route path="/" element={<Layout />}>
                <Route path="home" element={<Home />} />
                <Route path="admin" element={<Admin />} />
                <Route path="painel-admin" element={<PainelAdmin />} />
                <Route path="extrato" element={<Extrato />} />
                <Route path="cartoes" element={<Cartoes />} />
                <Route path="pix" element={<Pix />} />
                <Route path="ted" element={<Ted />} />
                <Route path="transferir" element={<Transferir />} />
                <Route path="cobranca" element={<Cobranca />} />
                <Route path="pagar" element={<Pagar />} />
                <Route path="investir" element={<Investir />} />
                <Route path="financiamento" element={<Financiamento />} />
                <Route path="open-finance" element={<OpenFinance />} />
                <Route path="realocacao-fundos" element={<RealocacaoFundos />} />
                <Route path="transacoes-globais" element={<TransacoesGlobais />} />
                <Route path="auditoria" element={<Auditoria />} />
                <Route path="cofrinho" element={<Cofrinho />} />
                <Route path="perfil" element={<Perfil />} />
                <Route path="configuracoes" element={<Configuracoes />} />
                <Route path="ajuda" element={<Ajuda />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
