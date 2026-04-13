import React from "react";
import { HiOutlineTrash } from "react-icons/hi";

const TransactionCard = ({ icon, title, amount, date, type, onDelete }) => {
    const isIncome = type === "income";

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all group">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                    <div className="text-3xl">{icon || (isIncome ? "💰" : "💸")}</div>
                    <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{title}</h4>
                        <p className="text-xs text-gray-500">
                            {new Date(date).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <p
                        className={`text-lg font-semibold ${isIncome ? "text-green-600" : "text-red-600"
                            }`}
                    >
                        {isIncome ? "+" : "-"}₹{amount?.toLocaleString("en-IN")}
                    </p>

                    {onDelete && (
                        <button
                            onClick={onDelete}
                            className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all p-2 hover:bg-red-50 rounded"
                        >
                            <HiOutlineTrash className="text-xl" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionCard;
