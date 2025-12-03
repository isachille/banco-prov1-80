import React from 'react';

interface CreditScoreGaugeProps {
  score: number;
  className?: string;
}

export const CreditScoreGauge: React.FC<CreditScoreGaugeProps> = ({ score, className = '' }) => {
  // Calculate needle rotation based on score (0-1000 maps to -90deg to 90deg)
  const minScore = 0;
  const maxScore = 1000;
  const clampedScore = Math.max(minScore, Math.min(maxScore, score));
  const percentage = (clampedScore - minScore) / (maxScore - minScore);
  const rotation = -90 + (percentage * 180); // -90 to 90 degrees

  // Determine score status
  const getScoreStatus = () => {
    if (score < 300) return { text: 'MUITO BAIXO', color: 'text-red-600' };
    if (score < 500) return { text: 'BAIXO', color: 'text-orange-500' };
    if (score < 600) return { text: 'REGULAR', color: 'text-yellow-500' };
    if (score < 750) return { text: 'BOM', color: 'text-lime-500' };
    return { text: 'EXCELENTE', color: 'text-green-600' };
  };

  const status = getScoreStatus();

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Gauge SVG */}
      <div className="relative w-64 h-36 mb-2">
        <svg viewBox="0 0 200 110" className="w-full h-full">
          {/* Background arc segments */}
          <defs>
            <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>
            <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#facc15" />
            </linearGradient>
            <linearGradient id="limeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#84cc16" />
              <stop offset="100%" stopColor="#a3e635" />
            </linearGradient>
            <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
          </defs>
          
          {/* Arc segments - each 36 degrees (180/5) */}
          {/* Red segment (0-300) */}
          <path
            d="M 20 100 A 80 80 0 0 1 38.04 46.18"
            fill="none"
            stroke="url(#redGradient)"
            strokeWidth="24"
            strokeLinecap="round"
          />
          {/* Orange segment (300-500) */}
          <path
            d="M 43.82 40.24 A 80 80 0 0 1 80.8 22.35"
            fill="none"
            stroke="url(#orangeGradient)"
            strokeWidth="24"
            strokeLinecap="round"
          />
          {/* Yellow segment (500-600) */}
          <path
            d="M 88.24 20.38 A 80 80 0 0 1 119.2 22.35"
            fill="none"
            stroke="url(#yellowGradient)"
            strokeWidth="24"
            strokeLinecap="round"
          />
          {/* Lime segment (600-750) */}
          <path
            d="M 127.2 25.5 A 80 80 0 0 1 161.96 46.18"
            fill="none"
            stroke="url(#limeGradient)"
            strokeWidth="24"
            strokeLinecap="round"
          />
          {/* Green segment (750-1000) */}
          <path
            d="M 166.18 52.24 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#greenGradient)"
            strokeWidth="24"
            strokeLinecap="round"
          />
          
          {/* Needle pivot point */}
          <circle cx="100" cy="100" r="8" fill="#1f2937" />
          
          {/* Needle */}
          <g transform={`rotate(${rotation}, 100, 100)`}>
            <polygon 
              points="100,30 96,100 104,100" 
              fill="#1f2937"
            />
          </g>
          
          {/* Center cover circle */}
          <circle cx="100" cy="100" r="6" fill="#374151" />
        </svg>
      </div>
      
      {/* Score display */}
      <div className="text-center">
        <div className="text-4xl font-bold text-gray-800">{score}</div>
        <div className={`text-lg font-bold ${status.color}`}>{status.text}</div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-1 mt-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span className="text-gray-600">0-299</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-orange-500"></div>
          <span className="text-gray-600">300-499</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-yellow-400"></div>
          <span className="text-gray-600">500-599</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-lime-500"></div>
          <span className="text-gray-600">600-749</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-500"></div>
          <span className="text-gray-600">750+</span>
        </div>
      </div>
    </div>
  );
};
