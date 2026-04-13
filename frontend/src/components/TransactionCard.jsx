import React from "react";
import { HiOutlineTrash } from "react-icons/hi";

const TransactionCard = ({ icon, title, amount, date, type, onDelete }) => {
    const isIncome = type === "income";

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-4 border border-gray-100 hover:border-gray-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 group hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 flex items-center justify-center rounded-xl text-2xl shadow-sm ring-1 ring-black/5 ${isIncome ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {icon || (isIncome ? "💰" : "💸")}
                    </div>
                    <div className="flex-1">
                        <h4 className="text-base font-semibold text-gray-900 tracking-tight">{title}</h4>
                        <p className="text-xs font-medium text-gray-400 mt-0.5">
                            {new Date(date).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className={`text-lg font-bold tracking-tight ${isIncome ? "text-green-600" : "text-gray-900"}`}>
                            {isIncome ? "+" : "-"}₹{amount?.toLocaleString("en-IN")}
                        </p>
                    </div>

                    {onDelete && (
                        <button
                            onClick={onDelete}
                            className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-white transition-all p-2.5 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/30 rounded-xl"
                            title="Delete transaction"
                        >
                            <HiOutlineTrash className="text-lg" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionCard;
