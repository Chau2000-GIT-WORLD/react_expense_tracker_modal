export const ProgressBar = ({ current, total }) => {
  const percentage = Math.min(Math.round((current / total) * 100), 100);
  const isHigh = percentage >= 80;
  const colorClass = isHigh ? "bg-orange-500" : "bg-emerald-500";

  return (
    <div className="mt-2">
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full ${colorClass}`} style={{ width: `${percentage}%` }}></div>
      </div>
      <div className="flex justify-between text-3xs text-gray-400 mt-1">
        <span>{percentage}% used</span>
        <span>{(total - current).toLocaleString()} đ left</span>
      </div>
    </div>
  );
};