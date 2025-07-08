
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MobileLayout from '@/components/MobileLayout';
import { ChatbotZoe } from '@/components/ChatbotZoe';

const Chatbot = () => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(true);

  return (
    <MobileLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Ajuda e Suporte</h1>
        </div>

        <ChatbotZoe 
          isOpen={isChatOpen} 
          onClose={() => {
            setIsChatOpen(false);
            navigate(-1);
          }} 
        />
      </div>
    </MobileLayout>
  );
};

export default Chatbot;

