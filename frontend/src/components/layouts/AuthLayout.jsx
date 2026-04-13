import React from "react";
import CARD_2 from "../../assets/images/dashboard.jpeg";
import { LuTrendingUpDown } from "react-icons/lu";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex h-screen w-screen bg-gray-50 overflow-hidden">
      {/* Left Form Area */}
      <div className="w-full md:w-[50vw] flex flex-col justify-center px-10 sm:px-24 relative z-10 bg-white shadow-2xl overflow-y-auto">
        <div className="absolute top-8 left-10 hidden sm:block">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Expense Tracker
          </h2>
        </div>
        <div className="mt-16 sm:mt-0">
          {children}
        </div>
      </div>

      {/* Right Visual Area */}
      <div className="hidden md:flex w-[50vw] flex-col justify-center items-center relative overflow-hidden bg-slate-900 overflow-y-auto">
        {/* Soft abstract blobs */}
        <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[120px] opacity-60" />
        <div className="absolute bottom-[20%] right-[10%] w-[30rem] h-[30rem] bg-indigo-500 rounded-full mix-blend-screen filter blur-[128px] opacity-70" />
        
        <div className="z-10 px-12 text-center text-white max-w-lg mb-8">
          <h1 className="text-4xl font-extrabold mb-4 leading-tight">Master Your<br/>Finances</h1>
          <p className="text-indigo-200 text-lg">Track every penny effortlessly and reach your financial goals faster with gorgeous, actionable insights.</p>
        </div>
        
        <div className="z-10 backdrop-blur-xl bg-white/10 p-6 rounded-3xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] w-80">
            <StatsInfoCard
              icon={<LuTrendingUpDown />}
              label="Active Balances"
              value="430,000"
              color="bg-purple-500"
            />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

const StatsInfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex items-center gap-6 z-10">
      <div
        className={`w-14 h-14 flex items-center justify-center text-[28px] text-white ${color} rounded-2xl shadow-lg ring-4 ring-white/10`}
      >
        {icon}
      </div>
      <div>
        <h6 className="text-sm text-indigo-100 font-medium tracking-wide mb-1 opacity-90">{label}</h6>
        <span className="text-[26px] font-bold text-white tracking-tight">${value}</span>
      </div>
    </div>
  );
};
