
import React from 'react';
import Sidebar from './Sidebar';
import BankingHeader from './BankingHeader';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 transition-colors duration-300">
      <BankingHeader />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-[220px] p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
