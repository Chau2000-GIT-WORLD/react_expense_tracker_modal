// Nhận `type` để đổi màu nền và chữ theo Tailwind
export const Badge = ({ text, type }) => {
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