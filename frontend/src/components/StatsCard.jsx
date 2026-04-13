import React from "react";

const StatsCard = ({ icon, title, amount, bgColor = "bg-purple-50", iconColor = "text-purple-600" }) => {
    return (
        <div className="relative group overflow-hidden bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-100 hover:border-purple-200 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_rgba(147,51,234,0.08)] transition-all duration-300 transform hover:-translate-y-1">
            {/* Soft background glow */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full mix-blend-multiply opacity-20 blur-xl transition-all duration-300 group-hover:scale-150 ${bgColor}`} />
            
            <div className="flex items-start justify-between relative z-10">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">{title}</p>
                    <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        ₹{amount?.toLocaleString("en-IN") || 0}
                    </p>
                </div>
                <div className={`flex items-center justify-center w-14 h-14 rounded-2xl ${bgColor} ${iconColor} text-2xl shadow-sm ring-1 ring-black/5`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
