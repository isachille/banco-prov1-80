
import React from 'react';

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <main className="p-4">
        <div className="max-w-md mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MobileLayout;
