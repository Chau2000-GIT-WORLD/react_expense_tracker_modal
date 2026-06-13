import React, { useState } from 'react';

export function NewListModal({ isOpen, onClose, onAddList }) {
  // 1. Khai báo 2 State để lưu giá trị người dùng nhập vào Form
  const [title, setTitle] = useState('');
  const [budget, setBudget] = useState('');

  // Nếu Modal đang đóng (isOpen === false) thì không hiển thị gì cả
  if (!isOpen) return null;

  // 2. Hàm xử lý khi người dùng nhấn nút "Tạo mới" (Submit Form)
  const handleSubmit = (e) => {
    e.preventDefault(); // Chặn reload lại trang
    if (!title.trim()) return;

    // Gửi dữ liệu title và budget ngược lên hàm handleCreateList ở file App.jsx
    onAddList(title, Number(budget) || 0);

    // Reset lại ô nhập liệu về rỗng và đóng modal
    setTitle('');
    setBudget('');
    onClose();
  };

  return (
    // Lớp nền đen mờ bao phủ toàn màn hình
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      
      {/* Thẻ form bọc ngoài cùng để bắt sự kiện onSubmit */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Tạo danh mục mới</h3>
        
        {/* Ô nhập tên danh mục */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-600">Tên danh mục:</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Ví dụ: Shopping, Travel..."
            required 
            autoFocus
          />
        </div>

        {/* Ô nhập ngân sách */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-gray-600">Ngân sách (đ):</label>
          <input 
            type="number" 
            value={budget} 
            onChange={(e) => setBudget(e.target.value)}
            className="w-full border p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Ví dụ: 2000000"
          />
        </div>

        {/* Cặp nút bấm Hủy và Tạo mới */}
        <div className="flex justify-end gap-2 text-sm font-medium">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tạo mới
          </button>
        </div>
      </form>
    </div>
  );
}