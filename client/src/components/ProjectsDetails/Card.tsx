// src/components/ui/Card.tsx
import React from "react";
import { LucideProps } from "lucide-react";

interface CardProps {
  title?: string;
  icon?: React.ComponentType<LucideProps>;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, icon: Icon, children }) => {
  return (
    <div className="">
      {title && (
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-5 flex items-center">
          {Icon && (
            <Icon className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
          )}
          {title}
        </h2>
      )}
      <div className="text-gray-700 dark:text-gray-300">{children}</div>
    </div>
  );
};

export default Card;


