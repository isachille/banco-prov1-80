
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="w-full">
        {children}
      </main>
    </div>
  );
};

export default Layout;
