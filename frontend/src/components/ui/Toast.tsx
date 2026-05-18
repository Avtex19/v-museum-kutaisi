'use client';

import { useEffect } from 'react';

interface Props {
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, onClose, duration = 3000 }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2" style={{ animation: 'fadeInUp 0.2s ease' }}>
      <div className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-neutral-900 px-5 py-3 shadow-xl">
        <span className="text-green-400">✓</span>
        <p className="text-sm font-medium text-neutral-100">{message}</p>
      </div>
    </div>
  );
}
