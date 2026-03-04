import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "destructive" | "outline" | "ghost" | "zinc";
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
  className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = "primary",
  size = "default",
  children,
  className = "",
  ...props
}, ref) => {
  const variantClasses = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 active:scale-95",
    zinc: "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-xl active:scale-95",
    destructive: "bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20 active:scale-95",
    outline: "border border-gray-200 dark:border-zinc-800 bg-transparent hover:bg-gray-50 dark:hover:bg-zinc-900 text-gray-700 dark:text-zinc-300 active:scale-95",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-zinc-900 text-gray-600 dark:text-zinc-400 active:scale-95",
  };

  const sizeClasses = {
    default: "px-5 py-2.5 text-sm",
    sm: "px-3 py-1.5 text-xs",
    lg: "px-8 py-4 text-base",
    icon: "h-10 w-10 flex items-center justify-center",
  };

  return (
    <button
      ref={ref}
      className={`rounded-2xl font-black uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none
        ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;


