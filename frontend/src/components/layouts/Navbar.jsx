import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  return (
    <div className="flex items-center gap-5 bg-white/80 backdrop-blur-md border border-b border-gray-200/50 p-4 sticky top-0 z-50 shadow-sm">
      <button
        className="block lg:hidden text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors"
        onClick={() => {
          setOpenSideMenu(!openSideMenu);
        }}
      >
        {openSideMenu ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>

      <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
        Expense Tracker
      </h2>

      {openSideMenu && (
        <div className="fixed top-[73px] -ml-4 bg-white/95 backdrop-blur-xl shadow-2xl h-[calc(100vh-73px)] z-40 transition-all">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
