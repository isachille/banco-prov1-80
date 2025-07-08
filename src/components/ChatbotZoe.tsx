
import React, { useState } from 'react';
import { Send, X, MessageCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatbotZoeProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatbotZoe: React.FC<ChatbotZoeProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Eu sou a Zoe, sua assistente virtual do Banco Pro. Como posso ajudá-lo hoje?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');

  const commonQuestions = [
    'Como transferir dinheiro?',
    'Como mudar foto de perfil?',
    'Como pagar boleto?',
    'Como solicitar limite de cartão?',
    'Como fazer PIX?',
    'Qual meu saldo?'
  ];

  const getZoeResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('transferir') || message.includes('transferência')) {
      return 'Para transferir dinheiro: 1) Acesse "Transferir" no menu principal, 2) Digite os dados do destinatário, 3) Informe o valor, 4) Confirme com sua senha. É rápido e seguro!';
    }
    
    if (message.includes('foto') || message.includes('perfil')) {
      return 'Para alterar sua foto de perfil: 1) Vá em Configurações, 2) Clique em "Meu Perfil", 3) Toque na foto atual, 4) Selecione uma nova imagem da galeria. Pronto!';
    }
    
    if (message.includes('boleto') || message.includes('pagar')) {
      return 'Para pagar boletos: 1) Acesse "Pagar" no menu, 2) Escaneie o código de barras ou digite o código, 3) Confirme os dados, 4) Autorize o pagamento. Simples assim!';
    }
    
    if (message.includes('cartão') || message.includes('limite')) {
      return 'Para solicitar aumento de limite: 1) Vá em "Cartões", 2) Selecione seu cartão, 3) Clique em "Solicitar Aumento", 4) Preencha o valor desejado. Analisaremos em até 24h!';
    }
    
    if (message.includes('pix')) {
      return 'Para fazer PIX: 1) Acesse "PIX" no menu, 2) Escolha a chave do destinatário, 3) Digite o valor, 4) Confirme. É instantâneo e funciona 24h!';
    }
    
    if (message.includes('saldo')) {
      return 'Seu saldo está sempre visível na tela inicial. Se não conseguir ver, toque no ícone do olho para mostrar/ocultar o valor.';
    }
    
    if (message.includes('oi') || message.includes('olá') || message.includes('ola')) {
      return 'Olá! Como posso te ajudar hoje? Você pode perguntar sobre transferências, pagamentos, PIX, cartões e muito mais!';
    }
    
    // Se não reconhecer a pergunta, gera protocolo
    const protocolNumber = Math.random().toString(36).substr(2, 8).toUpperCase();
    return `Desculpe, não consegui entender sua dúvida específica. Gerei o protocolo ${protocolNumber} para você. Um analista especializado entrará em contato em breve para te ajudar melhor!`;
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simula digitação da Zoe
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getZoeResponse(inputText),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setInputText('');
  };

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
      <Card className="w-full max-w-md h-[600px] flex flex-col">
        <CardHeader className="flex-row items-center justify-between bg-gradient-to-r from-[#0047AB] to-[#1E5BA8] text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <CardTitle className="text-lg">Zoe - Assistente Virtual</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-[#0047AB] text-white'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.isBot && <MessageCircle className="h-4 w-4 mt-1 flex-shrink-0" />}
                    {!message.isBot && <User className="h-4 w-4 mt-1 flex-shrink-0" />}
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="p-4 border-t">
              <p className="text-sm font-medium mb-2">Perguntas frequentes:</p>
              <div className="grid grid-cols-1 gap-2">
                {commonQuestions.slice(0, 3).map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickQuestion(question)}
                    className="text-left justify-start h-auto p-2 text-xs"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                placeholder="Digite sua dúvida..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button onClick={sendMessage} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

