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
  const { user, clearUser } = useContext(UserContext);

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
    <div className="w-64 bg-white/80 backdrop-blur-md border-r border-gray-200/50 h-full flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* User Info Header */}
      <div className="p-6 border-b border-gray-100 flex items-center gap-4">
        {user?.profileImageUrl ? (
          <img 
            src={user.profileImageUrl} 
            alt="Profile" 
            className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-purple-100" 
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            {user?.fullName?.charAt(0) || "U"}
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-900 truncate w-32">{user?.fullName || "User"}</span>
          <span className="text-xs text-gray-500 truncate w-32">{user?.email || ""}</span>
        </div>
      </div>

      <div className="flex-1 py-6 px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                  ? "bg-purple-50 text-purple-700 font-semibold shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <Icon className={`text-xl ${isActive ? "text-purple-600" : "text-gray-400"}`} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="border-t border-gray-100 p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
        >
          <HiOutlineLogout className="text-xl opacity-80" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SideMenu;