import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleProps {
  children: React.ReactNode;
}

interface CollapsibleTriggerProps {
  children: React.ReactNode;
  isOpen?: boolean;
  onClick?: () => void;
  className?: string;
}

interface CollapsibleContentProps {
  children: React.ReactNode;
  className?: string;
}

export const Collapsible = ({ children }: CollapsibleProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          if (child.type === CollapsibleTrigger) {
            return React.cloneElement(child, { 
              onClick: () => setIsOpen(!isOpen),
              isOpen
            } as any);
          }
          if (child.type === CollapsibleContent && !isOpen) {
            return null;
          }
        }
        return child;
      })}
    </div>
  );
};

export const CollapsibleTrigger = ({ 
  children, 
  isOpen,
  onClick,
  className = ''
}: CollapsibleTriggerProps) => {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-1 ${className}`}
    >
      {children}
      {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
    </button>
  );
};

export const CollapsibleContent = ({ children, className = '' }: CollapsibleContentProps) => {
  return (
    <div className={`mt-1 ${className}`}>
      {children}
    </div>
  );
};


