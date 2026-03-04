import React from "react";

interface ProgressProps {
  value: number;
  className?: string;
}

const Progress = ({ value, className = "" }: ProgressProps) => {
  // Clamp value between 0 and 100
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 ${className}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clampedValue}
      aria-label="progress"
    >
      <div
        className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
};

export default Progress;


