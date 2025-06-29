
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
        <img 
          src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png" 
          alt="Banco Pro" 
          className="h-24 w-auto mx-auto mb-4"
        />
        <p className="text-blue-200 text-lg">Seu banco digital completo</p>
      </div>
    </div>
  );
};

export default Splash;
