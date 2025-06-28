
import React from 'react';
import { AccountBalance } from './AccountBalance';
import { QuickActions } from './QuickActions';
import { RecentTransactions } from './RecentTransactions';
import { CreditCards } from './CreditCards';

export const BankingDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AccountBalance />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CreditCards />
        <RecentTransactions />
      </div>
    </div>
  );
};
