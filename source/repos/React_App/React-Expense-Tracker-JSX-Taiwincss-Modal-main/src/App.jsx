import { useState, useMemo, useEffect } from "react";
import { ExpenseAdd } from './components/ExpenseAdd';
import { NewListModal } from "./components/NewListModal";
import { CategoryCard } from './components/CategoryCard';
import { useLocalStorage } from './components/useLocalStorage';


// Component hiển thị trạng thái hoặc mức độ ưu tiên
const Badge = ({ text, type }) => {
  const styles = {
    paid: "bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded",
    pending: "bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded",
    overdue: "bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded",
    low: "bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded ml-2",
    medium: "bg-orange-100 text-orange-600 text-xs px-1.5 py-0.5 rounded ml-2",
    high: "bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded ml-2",
  };
  return <span className={styles[type] || styles.low}>{text}</span>;
};

// Component thẻ thống kê trên cùng
const StatCard = ({ icon, title, value, unit = "" }) => {
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

// Component thanh tiến trình ngân sách
const ProgressBar = ({ current, total }) => {
  const percentage = Math.min(Math.round((current / total) * 100), 100);
  const isHigh = percentage >= 80;
  const colorClass = isHigh ? "bg-orange-500" : "bg-emerald-500";

  return (
    <div className="mt-2">
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full ${colorClass}`} style={{ width: `${percentage}%` }}></div>
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
        <span>{percentage}% used</span>
        <span>{(total - current).toLocaleString()} đ left</span>
      </div>
    </div>
  );
};

// ==========================================
// 2. COMPONENTS LỚP TRUNG GIAN (ORGANISM)
// ==========================================

// Component thanh tìm kiếm và bộ lọc nhanh
const FilterBar = ({ searchTerm, setSearchTerm, filterOver500k, setFilterOver500k, sortBy, setSortBy }) => {
  
  return (
    <div className="flex justify-between items-center gap-4 my-6">
      <div className="relative flex-1 max-w-md">
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">🔍</span>
        <input
        id="search-expenses"
          name="search"
          type="text"
          placeholder="e.g., Electricity Bill"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>
      <div className="flex gap-2">
        <select 
         id="sort-by"
        name="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-200 rounded-lg p-2 text-sm text-gray-600 bg-white"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
  
        </select>
        <button 
          onClick={() => setFilterOver500k(!filterOver500k)}
          className={`border rounded-lg px-4 py-2 text-sm font-medium transition ${
            filterOver500k ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 border-gray-200"
          }`}
        >
          Over 500k
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 3. DATA KHỞI TẠO BAN ĐẦU
// ==========================================
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

// ==========================================
// 4. COMPONENT CHA LỚN NHẤT (APP)

// ==========================================
{/*
  - State quản lý việc hiển thị form thêm mới
  - State lưu trữ danh sách các danh mục và khoản chi tiêu
  - State cho ô tìm kiếm, bộ lọc Over 500k và sắp xếp
  - useMemo để tính toán số liệu thống kê và lọc dữ liệu hiệu quả
*/}

  export default function App() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOver500k, setFilterOver500k] = useState(false);
  const [sortBy, setSortBy] = useState("newest"); 

 
const [categories, setCategories] = useLocalStorage('expense_categories', initialCategories);
const handleDeleteCategory = (categoryId) => {
  if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ danh mục này không?")) {
    setCategories(prevCategories => prevCategories.filter(cat => cat.id !== categoryId));
  }
};
const [isModalOpen, setIsModalOpen] = useState(false);

const handleCreateList = (title, budget) => {
  const newList = {
     id: "cat_" + Date.now(),
    title: title,
     maxBudget: Number(budget) || 0,
   items: [] 
  };
  setCategories([...categories, newList]); 

};
  const handleDeleteExpense = (categoryId, itemId) => {
    setCategories(prevCategories => {
      const nextCategories = prevCategories.map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            items: cat.items.filter(item => item.id !== itemId)
          };
        }
        return cat;
      });
      return nextCategories;
    });
  };

  
  const handleSubmit = (newExpense) => {
    const expenseWithId = {
      id: "e_" + Date.now(),
      list: newExpense.list,
      name: newExpense.title,   
      title: newExpense.title,  
      amount: Number(newExpense.amount) || 0, 
      priority: newExpense.priority?.toLowerCase(),
      status: newExpense.status?.toLowerCase(),
      date: newExpense.dueDate || newExpense.date,
    };

    setCategories(prevCategories => {
      const nextCategories = prevCategories.map(cat => {
        const currentCatTitle = cat.title.trim().toLowerCase();
        const selectedFormList = newExpense.list.trim().toLowerCase();

        if (currentCatTitle === selectedFormList) {
          return {
            ...cat,
            items: [...(cat.items || []), expenseWithId] 
          };
        }
        return cat;
      });
      return nextCategories;
    });
   
    setShowAddForm(false);
  };
 
  
  useEffect(() => {
    localStorage.setItem('expense_categories', JSON.stringify(categories));
  }, [categories]);

  // Tính số liệu tự động cho Thẻ thống kê
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

  // Bộ lọc dữ liệu theo Ô tìm kiếm và nút bấm Over 500k
  const filteredCategories = useMemo(() => {
    return categories.map(cat => {
      const filteredItems = (cat.items || []).filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAmount = filterOver500k ? item.amount > 500000 : true;
        return matchesSearch && matchesAmount;
        const isDuplicate = categories.some(cat => cat.title.toLowerCase() === title.toLowerCase());
if (isDuplicate) return alert("Danh mục này đã tồn tại rồi nha!");
      })
      .sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          // Nếu chọn 'newest', ngày lớn hơn (mới hơn) sẽ xếp trước
          return sortBy === "newest" ? dateB - dateA : dateA - dateB;
        });
      return { ...cat, items: filteredItems };
    });
  }, [categories, searchTerm, filterOver500k, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50/50 p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-emerald-600 text-white rounded-lg text-lg font-bold">💵</span>
          <h1 className="text-xl font-bold text-gray-800">Expense Tracker</h1>
        </div>
         <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
          >
            + New List
          </button>
      </div>

      {/* Top Stat Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="🟢" title="Spent This Month" value={stats.spentThisMonth.toLocaleString()} unit="đ" />
        <StatCard icon="🕒" title="Pending" value={stats.pendingCount} />
        <StatCard icon="🚨" title="Overdue" value={stats.overdueCount} />
        <StatCard icon="🚩" title="High Priority >500k" value={stats.highPriorityOver500k} />
      </div>
       
      <FilterBar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        filterOver500k={filterOver500k} 
        setFilterOver500k={setFilterOver500k} 
        sortBy={sortBy} 
        setSortBy={setSortBy}
      />

      {/* Lists Main Content Area */}
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {filteredCategories.map((category) => (
          <CategoryCard
            key={category.id}
            id={category.id}
            title={category.title}
            items={category.items}
            maxBudget={category.maxBudget}
               onAddExpense={() => setShowAddForm(true)} 
                onDeleteExpense={handleDeleteExpense}
                 onAddList={handleCreateList}
                 onDeleteCategory={handleDeleteCategory}
            
          />
        ))}
      </div>
 {showAddForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.55)', // Làm mờ nền chuẩn Readdy
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999, // Ép layer nổi lên cao nhất
          padding: '20px'
        }}>
          <ExpenseAdd
            onAddExpense={handleSubmit} // Truyền đúng hàm xử lý lưu dữ liệu
            onCancel={() => setShowAddForm(false)}
            categories={categories}
          />

        </div>
      )}
      <NewListModal 
  isOpen={isModalOpen} 
  onClose={() => setIsModalOpen(false)} 
  onAddList={handleCreateList} 
/>
    </div>
  );
}
