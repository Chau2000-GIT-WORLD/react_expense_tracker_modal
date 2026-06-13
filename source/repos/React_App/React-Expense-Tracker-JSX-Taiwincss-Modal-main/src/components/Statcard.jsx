export const StatCard = ({ icon, title, value, unit = "" }) => {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex-1">
      <div className="p-3 bg-gray-50 rounded-lg text-xl">{icon}</div>
      <div>
        <p className="text-gray-400 text-xs font-medium">{title}</p>
        <p className="text-gray-800 text-lg font-bold mt-1">
          {value} <span className="text-sm font-normal">{unit}</span>
        </p>
      </div>
    </div>
  );
};