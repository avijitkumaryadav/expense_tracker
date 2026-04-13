import React from "react";

const EmptyState = ({ icon = "📭", title, message }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="text-6xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 text-center max-w-md">{message}</p>
        </div>
    );
};

export default EmptyState;
