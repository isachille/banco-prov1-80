
import React, { useState, useEffect } from 'react';
import { MessageCircle, Minus, X, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatbotZoe } from '@/components/ChatbotZoe';

export const FloatingChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  // Carregar histórico do localStorage ao montar o componente
  useEffect(() => {
    const savedHistory = localStorage.getItem('zoe-chat-history');
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Salvar histórico no localStorage sempre que mudar
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('zoe-chat-history', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  const handleOpenChat = () => {
    setIsChatOpen(true);
    setIsMinimized(false);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setIsMinimized(false);
  };

  const handleMinimizeChat = () => {
    setIsMinimized(true);
  };

  const handleMaximizeChat = () => {
    setIsMinimized(false);
  };

  return (
    <>
      {/* Botão flutuante */}
      {!isChatOpen && (
        <Button
          onClick={handleOpenChat}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-[#0047AB] to-[#1E5BA8] hover:from-[#003580] hover:to-[#1A4F96] shadow-lg border-none"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Chat minimizado */}
      {isChatOpen && isMinimized && (
        <div className="fixed bottom-6 right-6 z-50 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 flex items-center space-x-2">
          <MessageCircle className="h-5 w-5 text-[#0047AB]" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">Zoe</span>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMaximizeChat}
              className="h-6 w-6"
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCloseChat}
              className="h-6 w-6"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Chat completo */}
      {isChatOpen && !isMinimized && (
        <div className="fixed bottom-6 right-6 z-50 w-80 h-96">
          <ChatbotZoe
            isOpen={true}
            onClose={handleCloseChat}
            onMinimize={handleMinimizeChat}
            chatHistory={chatHistory}
            onUpdateHistory={setChatHistory}
          />
        </div>
      )}
    </>
  );
};
