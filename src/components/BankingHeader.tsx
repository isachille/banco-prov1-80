
import React from 'react';
import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const BankingHeader = () => {
  return (
    <header className="bg-slate-900/50 backdrop-blur-sm border-b border-blue-500/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PRO</span>
            </div>
            <span className="text-white font-semibold text-xl">Banco Pro</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-white hover:bg-blue-500/20">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-blue-500/20">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
