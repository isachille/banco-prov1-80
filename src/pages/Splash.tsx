
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0057FF] to-[#003DB8] flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="text-8xl mb-4">🏦</div>
        <h1 className="text-4xl font-bold text-white mb-2">Banco Pro</h1>
        <p className="text-blue-200">Seu banco digital completo</p>
      </div>
    </div>
  );
};

export default Splash;
