import React from 'react';
import { Calculator, Database, FlaskConical, Sparkles } from 'lucide-react';

export type DataOriginKind = 'source' | 'calculated' | 'estimated' | 'demo';

const originStyles: Record<DataOriginKind, { label: string; classes: string; icon: React.ReactNode }> = {
  source: {
    label: 'Dato de la fuente',
    classes: 'bg-blue-50 text-blue-800 border-blue-200',
    icon: <Database className="w-3 h-3" />,
  },
  calculated: {
    label: 'Cálculo FoodLens',
    classes: 'bg-violet-50 text-violet-800 border-violet-200',
    icon: <Calculator className="w-3 h-3" />,
  },
  estimated: {
    label: 'Estimación FoodLens',
    classes: 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200',
    icon: <Sparkles className="w-3 h-3" />,
  },
  demo: {
    label: 'Dato de demostración',
    classes: 'bg-amber-50 text-amber-900 border-amber-200',
    icon: <FlaskConical className="w-3 h-3" />,
  },
};

export const DataOriginBadge: React.FC<{
  kind: DataOriginKind;
  label?: string;
  className?: string;
}> = ({ kind, label, className = '' }) => {
  const origin = originStyles[kind];

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-bold ${origin.classes} ${className}`}>
      {origin.icon}
      {label || origin.label}
    </span>
  );
};

export const DemoDataNotice: React.FC<{ className?: string }> = ({ className = '' }) => (
  <aside className={`rounded-2xl border border-amber-200 bg-amber-50 p-3 text-amber-950 ${className}`}>
    <div className="flex items-start gap-2">
      <FlaskConical className="w-4 h-4 shrink-0 mt-0.5" />
      <div>
        <p className="text-xs font-bold">Modo demostración</p>
        <p className="text-[11px] leading-relaxed text-amber-900/80">
          Los productos, puntuaciones y actividad de esta sección son ejemplos ficticios; no proceden de tus escaneos.
        </p>
      </div>
    </div>
  </aside>
);
