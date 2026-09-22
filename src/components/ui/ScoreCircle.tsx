import React from 'react';
import { getScoreColor } from './ScoreBadges';

interface ScoreCircleProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
}

export const ScoreCircle: React.FC<ScoreCircleProps> = ({
  score,
  size = 112,
  strokeWidth = 9,
  label,
  sublabel
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const colors = getScoreColor(score);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Active progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.fill}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold tracking-tight text-stone-900 tabular-nums">
            {score}
          </span>
          <span className="text-[11px] font-semibold text-stone-400">/ 100</span>
        </div>
      </div>

      {label && (
        <span className={`mt-2 font-bold text-sm ${colors.text}`}>
          {label}
        </span>
      )}
      {sublabel && (
        <span className="text-[12px] text-stone-500 text-center max-w-[200px] mt-0.5 leading-tight">
          {sublabel}
        </span>
      )}
    </div>
  );
};
