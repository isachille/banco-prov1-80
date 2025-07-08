import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, AlertTriangle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const InvestorProfile = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [profile, setProfile] = useState<string | null>(null);

  const questions = [
    {
      question: "Qual é o seu conhecimento sobre investimentos?",
      options: [
        { value: "iniciante", label: "Iniciante - Pouco ou nenhum conhecimento" },
        { value: "basico", label: "Básico - Conhecimentos gerais" },
        { value: "intermediario", label: "Intermediário - Boa experiência" },
        { value: "avancado", label: "Avançado - Muito experiente" }
      ]
    },
    {
      question: "Qual é o seu principal objetivo com investimentos?",
      options: [
        { value: "reserva", label: "Criar uma reserva de emergência" },
        { value: "crescimento", label: "Fazer o dinheiro crescer no longo prazo" },
        { value: "renda", label: "Gerar renda mensal" },
        { value: "especulacao", label: "Especular para ganhos rápidos" }
      ]
    },
    {
      question: "Por quanto tempo pretende deixar o dinheiro investido?",
      options: [
        { value: "curto", label: "Menos de 1 ano" },
        { value: "medio", label: "1 a 3 anos" },
        { value: "longo", label: "3 a 10 anos" },
        { value: "muito_longo", label: "Mais de 10 anos" }
      ]
    },
    {
      question: "Como você reagiria se seus investimentos perdessem 20% do valor?",
      options: [
        { value: "vender", label: "Venderia tudo imediatamente" },
        { value: "preocupar", label: "Ficaria muito preocupado" },
        { value: "aguardar", label: "Aguardaria a recuperação" },
        { value: "comprar", label: "Aproveitaria para comprar mais" }
      ]
    },
    {
      question: "Qual porcentagem da sua renda você pode investir mensalmente?",
      options: [
        { value: "ate5", label: "Até 5%" },
        { value: "5a15", label: "5% a 15%" },
        { value: "15a30", label: "15% a 30%" },
        { value: "mais30", label: "Mais de 30%" }
      ]
    }
  ];

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calcular perfil baseado nas respostas
      calculateProfile(newAnswers);
    }
  };

  const calculateProfile = (allAnswers: string[]) => {
    let score = 0;
    
    // Pontuação baseada nas respostas
    const scoring = {
      0: { iniciante: 1, basico: 2, intermediario: 3, avancado: 4 },
      1: { reserva: 1, crescimento: 3, renda: 2, especulacao: 4 },
      2: { curto: 1, medio: 2, longo: 3, muito_longo: 4 },
      3: { vender: 1, preocupar: 2, aguardar: 3, comprar: 4 },
      4: { ate5: 1, "5a15": 2, "15a30": 3, mais30: 4 }
    };

    allAnswers.forEach((answer, index) => {
      score += scoring[index as keyof typeof scoring][answer as keyof typeof scoring[0]] || 0;
    });

    // Determinar perfil
    if (score <= 8) {
      setProfile('conservador');
    } else if (score <= 15) {
      setProfile('moderado');
    } else {
      setProfile('arrojado');
    }
  };

  const getProfileInfo = (profileType: string) => {
    const profiles = {
      conservador: {
        title: 'Perfil Conservador',
        icon: Shield,
        color: 'text-green-600',
        bg: 'bg-green-50',
        description: 'Você prefere segurança e baixo risco.',
        investments: ['Tesouro Selic', 'CDB', 'Poupança', 'LCI/LCA']
      },
      moderado: {
        title: 'Perfil Moderado',
        icon: TrendingUp,
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
        description: 'Você aceita algum risco em busca de melhor rentabilidade.',
        investments: ['Tesouro IPCA+', 'Fundos Multimercado', 'Fundos Imobiliários', 'Debêntures']
      },
      arrojado: {
        title: 'Perfil Arrojado',
        icon: AlertTriangle,
        color: 'text-red-600',
        bg: 'bg-red-50',
        description: 'Você aceita alto risco para buscar maiores retornos.',
        investments: ['Ações', 'ETFs', 'Fundos de Ações', 'Derivativos']
      }
    };

    return profiles[profileType as keyof typeof profiles];
  };

  const handleFinish = () => {
    // Salvar perfil no localStorage
    localStorage.setItem('investor_profile', profile || '');
    navigate('/investimentos');
  };

  if (profile) {
    const profileInfo = getProfileInfo(profile);
    
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-gradient-to-r from-[#001B3A] to-[#003F5C] text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/investimentos')}
                className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Perfil do Investidor</h1>
                <p className="text-blue-100">Resultado da análise</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto p-6 max-w-md space-y-6">
          <Card className={profileInfo.bg}>
            <CardContent className="p-6 text-center">
              <profileInfo.icon className={`w-16 h-16 ${profileInfo.color} mx-auto mb-4`} />
              <h2 className={`text-2xl font-bold ${profileInfo.color} mb-2`}>
                {profileInfo.title}
              </h2>
              <p className="text-gray-700 mb-4">{profileInfo.description}</p>
              
              <div className="text-left">
                <h3 className="font-semibold mb-2">Investimentos recomendados:</h3>
                <ul className="space-y-1">
                  {profileInfo.investments.map((investment, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-sm">{investment}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={handleFinish}
            className="w-full bg-gradient-to-r from-[#001B3A] to-[#003F5C]"
          >
            Ir para Investimentos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-[#001B3A] to-[#003F5C] text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/investimentos')}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Perfil do Investidor</h1>
              <p className="text-blue-100">
                Pergunta {currentQuestion + 1} de {questions.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-md space-y-6">
        {/* Barra de Progresso */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {questions[currentQuestion].question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup onValueChange={handleAnswer}>
              {questions[currentQuestion].options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvestorProfile;