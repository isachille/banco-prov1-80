
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
