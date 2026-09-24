import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

const browserIsOnline = () => typeof navigator === 'undefined' || navigator.onLine;

export const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(browserIsOnline);

  useEffect(() => {
    const updateStatus = () => setIsOnline(browserIsOnline());
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  if (isOnline) return null;

  return (
    <aside
      role="status"
      className="absolute inset-x-3 top-3 z-40 flex items-center gap-2 rounded-2xl border border-amber-300 bg-amber-50 px-3.5 py-2.5 text-xs font-semibold text-amber-950 shadow-lg"
    >
      <WifiOff className="h-4 w-4 shrink-0 text-amber-700" />
      <span>Sin conexión · puedes consultar los productos guardados.</span>
    </aside>
  );
};
