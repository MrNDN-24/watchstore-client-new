import { useLocation, Link } from "react-router-dom";

const sidebarItems = [
  { label: "Thông tin cá nhân", href: "/api/profile" },
  { label: "Địa chỉ", href: "/address" },
  { label: "Order", href: "/order" },
];

const SidebarMenu = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Quản lý tài khoản
        </h2>
      </div>
      <nav className="flex-1 overflow-auto bg-white dark:bg-gray-900 transition-colors duration-300">
        <ul className="space-y-2 px-3 py-4">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.label}>
                <Link
                  to={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200
              ${
                isActive
                  ? "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              }`}
                >
                  <div className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default SidebarMenu;
