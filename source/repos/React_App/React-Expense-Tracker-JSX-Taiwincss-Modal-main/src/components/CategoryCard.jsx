import { ExpenseItem } from "./ExpenseItem";
import { ProgressBar } from "./ProgressBar";

export const CategoryCard = ({ id, title, items = [], maxBudget, onAddExpense, onDeleteExpense, onDeleteCategory}) => {
  // Tính tổng số tiền hiện tại của riêng danh mục này
  const currentTotal = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex-1">
      {/* Phần Header của Thẻ */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
            {title} <span className="text-xs font-normal text-gray-400">{items.length} items</span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {currentTotal.toLocaleString()} đ / {((maxBudget) || 0).toLocaleString()} đ
          </p>
        </div>
    <button 
      onClick={() => onDeleteCategory(id)} 
      className="text-red-400 hover:text-red-600 font-medium text-xs px-2 py-1 rounded border border-red-200 hover:bg-red-50"
    >
      Xóa List
    </button>
      </div>

      {/* Thanh hiển thị tiến độ phần trăm ngân sách */}
      <ProgressBar current={currentTotal} total={maxBudget} />

      {/* 🌟 VÒNG LẶP LỚP 2: Duyệt mảng items để sinh ra danh sách ExpenseItem */}
      <div className="mt-4 space-y-1">
        {items.map((item) => (
          <ExpenseItem 
            key={item.id} 
            catId={id} 
            {...item}  
            onDeleteExpense={onDeleteExpense} 
          />
        ))}
      </div>

      {/* Nút bấm thêm mới chi phí */}
      <button 
        onClick={onAddExpense}
        className="mt-4 text-emerald-500 hover:text-emerald-600 text-sm font-semibold flex items-center gap-1"
      >
        <span className="text-lg">+</span> Add expense
      </button>
    </div>
  );
};