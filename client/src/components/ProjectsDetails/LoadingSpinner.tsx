import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-32 animate-fadeIn">
    <Loader2 className="animate-spin h-12 w-12 text-indigo-500 mb-6 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
    <div className="space-y-1 text-center">
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Intercepting Data Packets</p>
      <div className="flex gap-1 justify-center">
        <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" />
      </div>
    </div>
  </div>
);

export default LoadingSpinner;


