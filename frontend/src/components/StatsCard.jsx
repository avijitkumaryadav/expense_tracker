import React from "react";

const StatsCard = ({ icon, title, amount, bgColor = "bg-violet-50", iconColor = "text-violet-600" }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                        ₹{amount?.toLocaleString("en-IN") || 0}
                    </p>
                </div>
                <div className={`${bgColor} ${iconColor} p-3 rounded-full text-2xl`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
