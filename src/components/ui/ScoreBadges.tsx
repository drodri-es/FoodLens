import React from 'react';
import { ScoreCategory, NovaLevel, NutriScoreGrade } from '../../types/foodlens';

// Score color utilities (clean semantic non-alarmist palette)
export const getScoreColor = (score: number) => {
  if (score >= 80) {
    return {
      bg: 'bg-emerald-500',
      text: 'text-emerald-700',
      softBg: 'bg-emerald-50',
      border: 'border-emerald-200',
      ring: 'stroke-emerald-500',
      fill: '#10b981'
    };
  }
  if (score >= 60) {
    return {
      bg: 'bg-lime-500',
      text: 'text-lime-700',
      softBg: 'bg-lime-50',
      border: 'border-lime-200',
      ring: 'stroke-lime-500',
      fill: '#84cc16'
    };
  }
  if (score >= 40) {
    return {
      bg: 'bg-amber-500',
      text: 'text-amber-700',
      softBg: 'bg-amber-50',
      border: 'border-amber-200',
      ring: 'stroke-amber-500',
      fill: '#f59e0b'
    };
  }
  return {
    bg: 'bg-rose-500',
    text: 'text-rose-700',
    softBg: 'bg-rose-50',
    border: 'border-rose-200',
    ring: 'stroke-rose-500',
    fill: '#f43f5e'
  };
};

export const ScoreBadge: React.FC<{ score: number; label?: string; size?: 'sm' | 'md' | 'lg' }> = ({
  score,
  label,
  size = 'md'
}) => {
  const colors = getScoreColor(score);
  
  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold text-xs px-2 py-0.5 rounded-full ${colors.softBg} ${colors.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${colors.bg}`} />
        <span className="tabular-nums">{score}</span>
        {label && <span className="text-[11px] font-normal opacity-80">· {label}</span>}
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 font-bold text-sm px-2.5 py-1 rounded-xl ${colors.softBg} ${colors.text} border ${colors.border}`}>
      <span className={`w-2 h-2 rounded-full ${colors.bg}`} />
      <span className="tabular-nums">{score}</span>
      <span className="text-xs font-medium text-stone-500">/ 100</span>
      {label && <span className="text-xs font-semibold ml-1">· {label}</span>}
    </div>
  );
};

export const NutriScoreBadge: React.FC<{ grade: NutriScoreGrade; size?: 'sm' | 'md' }> = ({ grade, size = 'md' }) => {
  const grades: NutriScoreGrade[] = ['A', 'B', 'C', 'D', 'E'];
  const gradeColors: Record<NutriScoreGrade, string> = {
    A: '#15803d', // dark green
    B: '#84cc16', // light green
    C: '#eab308', // yellow
    D: '#f97316', // orange
    E: '#ef4444', // red
  };

  if (size === 'sm') {
    return (
      <span 
        className="inline-flex items-center justify-center font-bold text-white text-[11px] px-2 py-0.5 rounded-md"
        style={{ backgroundColor: gradeColors[grade] }}
      >
        Nutri-Score {grade}
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-0.5 bg-stone-100 p-1 rounded-lg">
      {grades.map(g => {
        const isActive = g === grade;
        return (
          <span
            key={g}
            className={`flex items-center justify-center font-bold transition-transform ${
              isActive 
                ? 'w-7 h-7 text-white text-xs rounded-md shadow-sm scale-110' 
                : 'w-5 h-6 text-stone-400 text-[10px]'
            }`}
            style={{ backgroundColor: isActive ? gradeColors[g] : 'transparent' }}
          >
            {g}
          </span>
        );
      })}
    </div>
  );
};

export const NovaBadge: React.FC<{ nova: NovaLevel; size?: 'sm' | 'md' }> = ({ nova, size = 'md' }) => {
  const labels: Record<NovaLevel, { text: string; color: string; bg: string }> = {
    1: { text: 'NOVA 1 · No procesado', color: 'text-emerald-700', bg: 'bg-emerald-50' },
    2: { text: 'NOVA 2 · Culinario', color: 'text-teal-700', bg: 'bg-teal-50' },
    3: { text: 'NOVA 3 · Procesado', color: 'text-amber-700', bg: 'bg-amber-50' },
    4: { text: 'NOVA 4 · Ultraprocesado', color: 'text-orange-700', bg: 'bg-orange-50' },
  };

  const item = labels[nova];

  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-lg ${item.bg} ${item.color} ${
      size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
    }`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {item.text}
    </span>
  );
};
