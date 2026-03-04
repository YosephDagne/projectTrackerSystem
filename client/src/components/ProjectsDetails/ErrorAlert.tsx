import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => (
  <div className="bg-rose-500/5 border border-rose-500/20 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center animate-scaleIn shadow-2xl shadow-rose-500/5">
    <div className="w-16 h-16 bg-rose-500/10 rounded-3xl flex items-center justify-center text-rose-500 mb-6 shadow-inner">
      <ShieldAlert size={32} />
    </div>
    <h3 className="text-xl font-black text-rose-500 uppercase tracking-tighter italic mb-2">Protocol Bridge Failure</h3>
    <p className="text-sm font-bold text-gray-500 dark:text-zinc-400 max-w-md leading-relaxed">
      {message || "The requested data stream could not be synchronized with the terminal hub."}
    </p>
    <button
      onClick={() => window.location.reload()}
      className="mt-8 px-8 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-rose-600/20 active:scale-95"
    >
      Retry Initialization
    </button>
  </div>
);

export default ErrorAlert;


