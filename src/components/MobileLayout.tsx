
import React from 'react';
import MobileNavigation from './MobileNavigation';
import BankingHeader from './BankingHeader';

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <BankingHeader />
      <main className="pt-16 pb-20 px-4">
        <div className="max-w-md mx-auto">
          {children}
        </div>
      </main>
      <MobileNavigation />
    </div>
  );
};

export default MobileLayout;
