import { useState, useMemo } from "react";
import { StatCard } from "./components/StatCard";
import { FilterBar } from "./components/FilterBar";
import { CategoryCard } from "./components/CategoryCard";
import { ExpenseAdd } from './components/ExpenseAdd';
import { ExpenseItem } from './components/ExpenseItem';
export default function ExpenseTracker() {
  // 1. Quản lý danh sách chi phí bằng State
  const [expenses, setExpenses] = useState([
    { id: 1, name: 'Electricity Bill', priority: 'Medium', status: 'Pending', date: '05/27/2026', amount: 1200000 }
  ]);
  
  // Quản lý trạng thái ẩn/hiện của Form nhập liệu
  const [showAddForm, setShowAddForm] = useState(false);

  // 2. Hàm xử lý khi bấm nút "Add Expense" từ form gửi lên
  const handleAddExpense = (newExpense) => {
    setExpenses([...expenses, { id: Date.now(), ...newExpense }]);
    setShowAddForm(false); // Đóng form sau khi thêm thành công
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Nút để mở Form nhập liệu */}
      <button 
        onClick={() => setShowAddForm(true)}
        className="mb-4 bg-emerald-600 text-white px-4 py-2 rounded-lg"
      >
        + Add New Expense
      </button>

      {/* Hiển thị Form nhập liệu (Modal) nếu showAddForm = true */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <ExpenseAdd 
            onAddExpense={handleAddExpense} 
            onCancel={() => setShowAddForm(false)} 
          />
        </div>
      )}

      {/* Danh sách hiển thị các ExpenseItem */}
      <div className="bg-white rounded-xl shadow mt-4 p-4">
        {expenses.map((item) => (
          <ExpenseItem 
            key={item.id}
            name={item.name}
            priority={item.priority}
            status={item.status}
            date={item.date}
            amount={item.amount}
          />
        ))}
      </div>
    </div>
  );
}

// Mock Data khởi tạo ban đầu bám sát hình ảnh
const initialCategories = [
  {
    id: "cat1",
    title: "Home Bills",
    maxBudget: 5000000,
    items: [
      { id: "e1", name: "Cleaning Service", priority: "low", status: "pending", date: "2026-05-20", amount: 600000 },
      { id: "e2", name: "Internet", priority: "medium", status: "paid", date: "2026-05-10", amount: 300000 },
      { id: "e3", name: "Rent", priority: "high", status: "paid", date: "2026-05-05", amount: 3500000 },
      { id: "e4", name: "Parking Fee", priority: "high", status: "overdue", date: "2026-05-01", amount: 550000 },
    ]
  },
  {
    id: "cat2",
    title: "Subscriptions",
    maxBudget: 1500000,
    items: [
      { id: "e5", name: "Gym Membership", priority: "medium", status: "pending", date: "2026-05-15", amount: 850000 },
      { id: "e6", name: "Netflix", priority: "low", status: "paid", date: "2026-05-03", amount: 260000 },
      { id: "e7", name: "Spotify", priority: "low", status: "paid", date: "2026-05-03", amount: 129000 },
    ]
  },
  {
    id: "cat3",
    title: "Utilities",
    maxBudget: 3000000,
    items: [
      { id: "e8", name: "Gas", priority: "medium", status: "pending", date: "2026-05-28", amount: 450000 },
      { id: "e9", name: "Electricity", priority: "high", status: "pending", date: "2026-05-25", amount: 1200000 },
      { id: "e10", name: "Water", priority: "medium", status: "paid", date: "2026-05-12", amount: 180000 },
    ]
  }
];

export default function ExpenseTracker() {
  // 1. Quản lý State chính cho dữ liệu chi tiêu
  const [categories, setCategories] = useState(initialCategories);
  
  // 2. State phục vụ bộ lọc tìm kiếm (Filter Bar)
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOver500k, setFilterOver500k] = useState(false);

  // 3. Sử dụng useMemo để tính toán số liệu tự động cho Stat Cards khi data thay đổi
  const stats = useMemo(() => {
    let spentThisMonth = 0;
    let pendingCount = 0;
    let overdueCount = 0;
    let highPriorityOver500k = 0;

    categories.forEach(cat => {
      cat.items.forEach(item => {
        if (item.status === "paid") spentThisMonth += item.amount;
        if (item.status === "pending") pendingCount += 1;
        if (item.status === "overdue") overdueCount += 1;
        if (item.priority === "high" && item.amount > 500000) highPriorityOver500k += 1;
      });
    });

    return { spentThisMonth, pendingCount, overdueCount, highPriorityOver500k };
  }, [categories]);

  // 4. Lọc dữ liệu hiển thị theo thanh tìm kiếm và nút Over 500k
  const filteredCategories = useMemo(() => {
    return categories.map(cat => {
      const filteredItems = cat.items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAmount = filterOver500k ? item.amount > 500000 : true;
        return matchesSearch && matchesAmount;
      });
      return { ...cat, items: filteredItems };
    });
  }, [categories, searchTerm, filterOver500k]);

  // Hàm giả lập thêm khoản chi tiêu mới
  const handleAddExpense = (catId) => {
    console.log("Mở modal thêm chi phí cho danh mục:", catId);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-emerald-600 text-white rounded-lg text-lg font-bold">💵</span>
          <h1 className="text-xl font-bold text-gray-800">Expense Tracker</h1>
        </div>
        <button className="bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-emerald-700 transition">
          <span className="text-lg">+</span> New List
        </button>
      </div>

      {/* Top Stat Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="🟢" title="Spent This Month" value={stats.spentThisMonth.toLocaleString()} unit="đ" />
        <StatCard icon="🕒" title="Pending" value={stats.pendingCount} />
        <StatCard icon="🚨" title="Overdue" value={stats.overdueCount} />
        <StatCard icon="🚩" title="High Priority >500k" value={stats.highPriorityOver500k} />
      </div>

      {/* Filter Toolbar */}
      <FilterBar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        filterOver500k={filterOver500k} 
        setFilterOver500k={setFilterOver500k} 
      />

      {/* Lists Main Content Area */}
      <div className="flex flex-wrap gap-6 items-start">
        {filteredCategories.map((category) => (
          <CategoryCard
            key={category.id}
            title={category.title}
            items={category.items}
            maxBudget={category.maxBudget}
            onAddExpense={() => handleAddExpense(category.id)}
          />
        ))}
      </div>
    </div>
  );
}