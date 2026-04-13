import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
  HiOutlineLogout,
} from "react-icons/hi";
import { UserContext } from "../../context/UserContext";

const SideMenu = ({ activeMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearUser } = useContext(UserContext);

  const menuItems = [
    {
      path: "/dashboard",
      icon: HiOutlineHome,
      label: "Dashboard",
    },
    {
      path: "/income",
      icon: HiOutlineTrendingUp,
      label: "Income",
    },
    {
      path: "/expense",
      icon: HiOutlineTrendingDown,
      label: "Expenses",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    clearUser();
    navigate("/login");
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="flex-1 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-3 transition-all ${isActive
                  ? "bg-violet-50 text-primary border-r-4 border-primary font-medium"
                  : "text-gray-700 hover:bg-gray-50"
                }`}
            >
              <Icon className="text-xl" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="border-t border-gray-200 p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-all"
        >
          <HiOutlineLogout className="text-xl" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SideMenu;