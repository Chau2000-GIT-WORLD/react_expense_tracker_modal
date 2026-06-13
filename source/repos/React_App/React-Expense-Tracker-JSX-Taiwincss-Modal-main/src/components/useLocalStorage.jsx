import { useState, useEffect } from 'react';


export function useLocalStorage(key, initialValue) {
  // 1. Đọc dữ liệu từ máy khi vừa mở ứng dụng lên
  const [state, setState] = useState(() => {
    const localData = localStorage.getItem(key);
    return localData ? JSON.parse(localData) : initialValue;
  });

  // 2. Camera tự động rình rập để lưu vào máy khi dữ liệu thay đổi
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  // 3. Trả về đúng 2 thứ giống hệt useState thông thường
  return [state, setState];
}