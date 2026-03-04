interface CardProps<T> {
  title: string;
  counts: { [key: string]: number };
}

const BreakdownCard = <T extends object>({ title, counts }: CardProps<T>) => (
  <div className="dark:bg-gray-800 rounded-lg  p-6 border border-gray-200 dark:border-gray-700">
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
      {title}
    </h3>
    {counts && Object.keys(counts).length > 0 ? (
      <ul className="space-y-2">
        {Object.entries(counts).map(([category, count]) => (
          <li
            key={category}
            className="flex justify-between items-center text-gray-700 dark:text-gray-300"
          >
            <span className="font-medium capitalize">{category}:</span>
            <span className="text-lg font-bold">{count}</span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        No data for this breakdown.
      </p>
    )}
  </div>
);

export default BreakdownCard;


