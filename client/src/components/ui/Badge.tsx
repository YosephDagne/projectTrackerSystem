"use client";

import { AlertTriangle, CheckCircle, AlertCircle, Zap } from "lucide-react";
import React from "react";

interface BadgeProps {
  variant?: "default" | "destructive" | "success" | "warning" | "outline" | "indigo";
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const Badge = ({
  variant = "default",
  children,
  className = "",
  dot = false,
}: BadgeProps) => {
  const variantClasses = {
    default: "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-400 border-transparent",
    destructive: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    outline: "border-gray-200 dark:border-zinc-800 bg-transparent text-gray-600 dark:text-zinc-400",
  };

  const dotColors = {
    destructive: "bg-rose-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    indigo: "bg-indigo-500",
    default: "bg-gray-400",
    outline: "bg-gray-400",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${variantClasses[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full mr-2 ${dotColors[variant] || dotColors.default}`} />}
      {children}
    </span>
  );
};

export default Badge;


