
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, Shield, TrendingUp, Zap, Headphones, Lock, 
  Send, Smartphone, ChevronRight, Menu, X, Car,
  Banknote, Building2, BarChart3, ArrowRight, Star,
  Linkedin, Instagram, MessageCircle, Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroPerson from '@/assets/hero-person.png';
import paymentsPerson from '@/assets/payments-person.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const menuItems = [
    'Pagamentos', 'O Banco PRO', 'Baixe o APP', 'TAX++', 'PRO COIN', 'Vantagens', 'Planos e taxas'
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ===== HEADER ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 bg-gradient-to-br from-[#0057FF] to-[#003DB8] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-xl font-bold text-[#0a1628]">BANCO <span className="text-[#0057FF]">PRO</span></span>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex items-center gap-1">
              {menuItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-[#0057FF] transition-colors rounded-lg hover:bg-blue-50"
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* Desktop Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                className="text-[#0057FF] font-semibold hover:bg-blue-50"
              >
                Entrar
              </Button>
              <Button
                onClick={() => navigate('/cadastro')}
                className="bg-gradient-to-r from-[#0057FF] to-[#003DB8] text-white font-semibold px-6 rounded-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-105"
              >
                Abrir minha conta PRO
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="lg:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="h-6 w-6 text-slate-700" /> : <Menu className="h-6 w-6 text-slate-700" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 shadow-xl animate-fade-in">
            <div className="px-4 py-4 space-y-1">
              {menuItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block px-4 py-3 text-slate-700 font-medium rounded-lg hover:bg-blue-50 hover:text-[#0057FF] transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="pt-4 space-y-2 border-t border-slate-100">
                <Button variant="outline" className="w-full border-[#0057FF] text-[#0057FF]" onClick={() => navigate('/login')}>
                  Entrar
                </Button>
                <Button className="w-full bg-gradient-to-r from-[#0057FF] to-[#003DB8] text-white rounded-full" onClick={() => navigate('/cadastro')}>
                  Abrir minha conta PRO
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ===== HERO ===== */}
      <section className="pt-24 lg:pt-32 pb-16 lg:pb-24 bg-gradient-to-br from-[#f0f6ff] via-white to-[#e8f0fe] relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#0057FF]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-72 h-72 bg-[#003DB8]/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <div className="inline-flex items-center gap-2 bg-[#0057FF]/10 text-[#0057FF] px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Star className="h-4 w-4" />
                Fintech 100% digital
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0a1628] leading-tight mb-6">
                O sonho do seu carro novo{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0057FF] to-[#003DB8]">
                  mais perto de você.
                </span>
              </h1>
              <p className="text-lg text-slate-500 mb-8 max-w-lg">
                Financiamento, pagamentos, conta digital e soluções financeiras completas para transformar sua vida.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="bg-gradient-to-r from-[#0057FF] to-[#003DB8] text-white font-bold px-8 rounded-full shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-105 text-base"
                >
                  Acessar Banco PRO <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => window.open('https://promotorsfinch.com.br', '_blank')}
                  className="border-[#0057FF] text-[#0057FF] font-bold px-8 rounded-full hover:bg-blue-50 text-base"
                >
                  Conheça nossa concessionária
                </Button>
              </div>
            </div>
            <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0057FF]/20 to-[#003DB8]/20 rounded-full blur-3xl scale-75" />
                <img src={heroPerson} alt="Pessoa com chave de carro e celular" className="relative w-80 lg:w-96 drop-shadow-2xl" />
                {/* Floating badges */}
                <div className="absolute top-8 -left-4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2 animate-bounce-slow">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Zap className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">PIX Aprovado</p>
                    <p className="text-xs text-green-600">R$ 1.500,00</p>
                  </div>
                </div>
                <div className="absolute bottom-16 -right-4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-[#0057FF]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">100% Seguro</p>
                    <p className="text-xs text-slate-500">Proteção total</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONHEÇA O BANCO PRO ===== */}
      <section id="o-banco-pro" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a1628] mb-4">
              Conheça o <span className="text-[#0057FF]">Banco PRO</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Soluções financeiras modernas para você e sua empresa.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Banknote,
                title: 'Empréstimos e Financiamentos',
                desc: 'Realize seus projetos com crédito acessível e taxas competitivas do mercado.',
                color: 'from-blue-500 to-blue-700',
                bg: 'bg-blue-50',
              },
              {
                icon: Building2,
                title: 'Conta digital gratuita',
                desc: 'Conta digital completa para pessoas físicas e jurídicas sem taxas de manutenção.',
                color: 'from-emerald-500 to-emerald-700',
                bg: 'bg-emerald-50',
              },
              {
                icon: BarChart3,
                title: 'TAX++',
                desc: 'Sistema exclusivo de rendimento em CDI com tecnologia digital avançada.',
                color: 'from-violet-500 to-violet-700',
                bg: 'bg-violet-50',
              },
            ].map((card, i) => (
              <div
                key={card.title}
                className={`animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 group cursor-pointer`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="bg-white border border-slate-100 rounded-3xl p-8 h-full shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <div className={`w-14 h-14 ${card.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <card.icon className={`h-7 w-7 text-transparent bg-clip-text bg-gradient-to-r ${card.color}`} style={{ color: card.color.includes('blue') ? '#3b82f6' : card.color.includes('emerald') ? '#10b981' : '#8b5cf6' }} />
                  </div>
                  <h3 className="text-xl font-bold text-[#0a1628] mb-3">{card.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PAGAMENTOS DIGITAIS ===== */}
      <section id="pagamentos" className="py-20 lg:py-28 bg-gradient-to-br from-[#f0f6ff] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 order-2 lg:order-1 flex justify-center">
              <div className="relative">
                <img src={paymentsPerson} alt="Pagamentos digitais" className="w-72 lg:w-80 drop-shadow-xl" />
                {/* Notification bubbles */}
                <div className="absolute top-4 -right-8 bg-white rounded-2xl shadow-lg p-3 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Send className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">PIX enviado</p>
                      <p className="text-sm font-bold text-green-600">R$ 1.000</p>
                    </div>
                  </div>
                </div>
                <div className="absolute top-1/2 -left-12 bg-white rounded-2xl shadow-lg p-3 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#0057FF] rounded-full flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-xs font-bold text-slate-800">Pagamento finalizado</p>
                  </div>
                </div>
                <div className="absolute bottom-8 -right-4 bg-white rounded-2xl shadow-lg p-3 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                      <Zap className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-xs font-bold text-slate-800">Pedido recebido</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200 order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a1628] mb-6">
                Pagamentos rápidos e seguros com{' '}
                <span className="text-[#0057FF]">tecnologia avançada.</span>
              </h2>
              <p className="text-lg text-slate-500 mb-8">
                PIX, TED, boletos e pagamentos instantâneos na palma da sua mão. Tudo integrado em uma única plataforma.
              </p>
              <div className="space-y-4">
                {['PIX instantâneo 24h', 'Pagamento de boletos', 'Transferências ilimitadas'].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-[#0057FF] rounded-full flex items-center justify-center flex-shrink-0">
                      <ChevronRight className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-slate-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== VANTAGENS ===== */}
      <section id="vantagens" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a1628] mb-4">
              Por que escolher o <span className="text-[#0057FF]">Banco PRO</span>?
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Headphones, title: 'Suporte 24h', desc: 'Atendimento humano e inteligente a qualquer hora do dia.', color: 'bg-blue-50', iconColor: '#0057FF' },
              { icon: Lock, title: 'Segurança avançada', desc: 'Infraestrutura com múltiplas camadas de proteção.', color: 'bg-emerald-50', iconColor: '#10b981' },
              { icon: Zap, title: 'Transferências instantâneas', desc: 'PIX e pagamentos em segundos.', color: 'bg-amber-50', iconColor: '#f59e0b' },
              { icon: TrendingUp, title: 'Fintech moderna', desc: 'Tecnologia financeira com inovação constante.', color: 'bg-violet-50', iconColor: '#8b5cf6' },
            ].map((item, i) => (
              <div
                key={item.title}
                className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 text-center"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                  <item.icon className="h-8 w-8" style={{ color: item.iconColor }} />
                </div>
                <h3 className="text-lg font-bold text-[#0a1628] mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONCESSIONÁRIA ===== */}
      <section className="py-20 lg:py-24 bg-gradient-to-r from-[#0057FF] to-[#003DB8] relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
          <Car className="h-16 w-16 text-white/80 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Conheça a concessionária do Banco PRO
          </h2>
          <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">
            Os melhores veículos com condições exclusivas de financiamento.
          </p>
          <Button
            size="lg"
            onClick={() => window.open('https://promotorsfinch.com.br', '_blank')}
            className="bg-white text-[#0057FF] font-bold px-10 rounded-full shadow-xl hover:bg-blue-50 transition-all hover:scale-105 text-base"
          >
            Acessar estoque de veículos <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* ===== BAIXAR APP ===== */}
      <section id="baixe-o-app" className="py-20 lg:py-28 bg-[#0a1628] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0057FF]/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
          <div className="w-20 h-20 bg-gradient-to-br from-[#0057FF] to-[#003DB8] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/30">
            <Smartphone className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Leve o Banco PRO no seu celular.
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto">
            Acesse sua conta, faça pagamentos e gerencie suas finanças de qualquer lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-[#0a1628] font-bold px-8 rounded-full hover:bg-slate-100 transition-all text-base"
            >
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.023a.5.5 0 0 0-.452.054L3.577 11.5a.5.5 0 0 0 0 .854l13.494 9.423a.5.5 0 0 0 .776-.427V2.5a.5.5 0 0 0-.324-.477z"/></svg>
              Baixar para Android
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white font-bold px-8 rounded-full hover:bg-white/10 transition-all text-base"
            >
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              Baixar para iPhone
            </Button>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#071020] text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0057FF] to-[#003DB8] rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                <span className="text-lg font-bold">BANCO <span className="text-[#0057FF]">PRO</span></span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Sua fintech completa com soluções financeiras modernas e seguras.
              </p>
            </div>

            {/* Menu rápido */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-slate-300 mb-4">Menu rápido</h4>
              <ul className="space-y-2">
                {['Pagamentos', 'Conta digital', 'Planos e taxas', 'Vantagens'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-slate-400 text-sm hover:text-[#0057FF] transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contato */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-slate-300 mb-4">Contato</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <Mail className="h-4 w-4 text-[#0057FF]" />
                  ouvidoria@bancopro.com.br
                </li>
                <li>
                  <a href="https://wa.me/5500000000000" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-400 hover:text-green-400 transition-colors">
                    <MessageCircle className="h-4 w-4 text-green-500" />
                    Suporte WhatsApp
                  </a>
                </li>
              </ul>
            </div>

            {/* Redes sociais */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-slate-300 mb-4">Redes sociais</h4>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-[#0057FF] transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-slate-500 text-sm">
              Banco PRO © {new Date().getFullYear()} Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* CSS for scroll animations */}
      <style>{`
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(2rem);
          transition: opacity 0.7s ease-out, transform 0.7s ease-out;
        }
        .animate-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
