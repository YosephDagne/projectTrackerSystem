import React from "react";

interface CardProps<T> {
  title: string;
  value: number;
  percentage?: number;
  color: string;
}

const colorMap: Record<string, { border: string; progress: string }> = {
  blue: { border: "border-blue-500", progress: "bg-blue-600" },
  green: { border: "border-green-500", progress: "bg-green-600" },
  red: { border: "border-red-500", progress: "bg-red-600" },
  purple: { border: "border-purple-500", progress: "bg-purple-600" },
  teal: { border: "border-teal-500", progress: "bg-teal-600" },
  orange: { border: "border-orange-500", progress: "bg-orange-600" },
  gray: { border: "border-gray-500", progress: "bg-gray-600" },
};

const MetricCard = <T extends object>({
  title,
  value,
  percentage,
  color = "gray",
}: CardProps<T>) => {
  const { border, progress } = colorMap[color] || colorMap.gray;

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg  p-5 border-l-4 ${border}`}
    >
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
        {title}
      </h3>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">
        {value}
        {percentage !== undefined && percentage !== null && (
          <span className="ml-2 text-base text-gray-500 dark:text-gray-400">
            ({percentage.toFixed(0)}%)
          </span>
        )}
      </p>
      {percentage !== undefined && percentage !== null && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
          <div
            className={`${progress} h-2 rounded-full`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default MetricCard;


