
import React from 'react';
import { BankingSidebar } from './BankingSidebar';
import { BankingDashboard } from './BankingDashboard';
import { BankingHeader } from './BankingHeader';

export const BankingApp = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <BankingHeader />
      <div className="flex">
        <BankingSidebar />
        <main className="flex-1 p-6">
          <BankingDashboard />
        </main>
      </div>
    </div>
  );
};
