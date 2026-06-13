
import React, { useState } from 'react';

export const ExpenseAdd = ({ onAddExpense, onCancel, categories = [] }) => {
  const [list, setList] = useState('Home Bills');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState(''); // Lưu chuỗi có dấu chấm để hiển thị
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Pending');
  const [dueDate, setDueDate] = useState('2026-05-27');

  // Hàm định dạng số thành 1.200.000 khi người dùng gõs
  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Chỉ lấy số
    if (!value) {
      setAmount('');
      return;
    }
    const formatted = new Intl.NumberFormat('vi-VN').format(value);
    setAmount(formatted);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) return alert('Vui lòng nhập đủ thông tin!');
    
    // Chuyển chuỗi định dạng '1.200.000' quay lại thành kiểu số nguyên để lưu state tổng
    const numericAmount = Number(amount.replace(/\./g, ''));

    onAddExpense({ 
      list, 
      title, 
      amount: numericAmount, 
      priority, 
      status, 
      dueDate 
    });
  };

  return (
    // Thêm relative và z-50 để đảm bảo form luôn nổi lên trên mọi lớp phủ overlay tối màu
    <div className="relative z-50 bg-white p-6 rounded-xl max-w-lg w-full shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto mx-auto my-auto">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-800">Add Expense</h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 text-2xl font-light">&times;</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* List Selection */}
        <div>
          <label htmlFor="expense-list" className="block text-sm font-medium text-gray-700 mb-1">List</label>
          <select 
            id="expense-list"
            name="list" 
            value={list} 
            onChange={(e) => setList(e.target.value)} 
            className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
        <option  className="capitalize" >-- Chọn danh mục --</option>
      {/* Duyệt mảng tự động hiện đầy đủ danh mục cũ lẫn mới */}
      {categories.map(cat => (
        <option key={cat.id} value={cat.title}>
          {cat.title}
        </option>
      ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="expense-title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input 
            id="expense-title"
            name="title" 
            type="text" 
            placeholder="e.g., Electricity Bill" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" 
          />
        </div>

        {/* Amount (Thay type="number" bằng text để dùng định dạng dấu chấm) */}
        <div>
          <label htmlFor="expense-amount" className="block text-sm font-medium text-gray-700 mb-1">Amount (VND)</label>
          <input 
            id="expense-amount"
            name="amount" 
            type="text" 
            placeholder="1.200.000" 
            value={amount} 
            onChange={handleAmountChange} 
            className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" 
          />
        </div>

        {/* Priority & Status (Sửa khoảng cách gap thành gap-6 giúp thông thoáng hơn) */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="expense-priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select 
              id="expense-priority"
              name="priority" 
              value={priority} 
              onChange={(e) => setPriority(e.target.value)} 
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <div>
            <label htmlFor="expense-status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              id="expense-status"
              name="status" 
              value={status} 
              onChange={(e) => setStatus(e.target.value)} 
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              <option>Pending</option>
              <option>Paid</option>
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label htmlFor="expense-due-date" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input 
            id="expense-due-date"
            name="dueDate" 
            type="date" 
            value={dueDate} 
            onChange={(e) => setDueDate(e.target.value)} 
            className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" 
          />
        </div>

        {/* Buttons (Giữ nguyên cấu trúc flex-end chuẩn chỉnh) */}
        <div className="flex justify-end gap-3 pt-4">
          <button 
            type="button" 
            onClick={onCancel} 
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 active:bg-emerald-800 font-medium transition-colors shadow-sm block cursor-pointer"
          >
            Add Expense
          </button>
        </div>
      </form>
    </div>
  );
};