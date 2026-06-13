import { Badge } from "./Badge";

export const ExpenseItem = ({ id, catId, name, priority, status, date, amount, onDeleteExpense }) => {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
      <div>
        <div className="flex items-center">
          <span className="text-sm font-semibold text-gray-800">{name}</span>
          <Badge text={priority} type={priority} />
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Badge text={status} type={status} />
          <span className="text-gray-400 text-[10px]">{date}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
  <span className="text-sm font-bold text-gray-800">
    {amount.toLocaleString()} đ
  </span>
  
  {/* Nút xóa nhỏ gọn màu đỏ nhạt */}
  <button
    onClick={() => onDeleteExpense(catId, id)}
    className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded bg-red-50 transition-colors"
  >
    Xóa
  </button>
</div>
    </div>
  );
};
