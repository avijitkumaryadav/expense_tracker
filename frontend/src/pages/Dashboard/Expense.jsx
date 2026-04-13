import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import TransactionCard from "../../components/TransactionCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import Modal from "../../components/Modal";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { showToast } from "../../utils/toast";
import { expenseIcons } from "../../utils/data";
import { HiOutlinePlus, HiOutlineDownload } from "react-icons/hi";

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    icon: "💸",
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
      setExpenses(response.data);
    } catch (err) {
      showToast("Failed to load expense data", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();

    if (!formData.category || !formData.amount || !formData.date) {
      showToast("Please fill all required fields", "error");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        ...formData,
        amount: parseFloat(formData.amount),
      });

      showToast("Expense added successfully", "success");
      setIsModalOpen(false);
      setFormData({
        icon: "💸",
        category: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
      });
      fetchExpenses();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to add expense", "error");
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      showToast("Expense deleted successfully", "success");
      fetchExpenses();
    } catch (err) {
      showToast("Failed to delete expense", "error");
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

      showToast("Excel downloaded successfully", "success");
    } catch (err) {
      showToast("Failed to download Excel", "error");
    }
  };

  const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
            <p className="text-sm text-gray-600 mt-1">
              Track and manage your expenses
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDownloadExcel}
              disabled={expenses.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiOutlineDownload className="text-lg" />
              <span className="text-sm font-medium">Download Excel</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <HiOutlinePlus className="text-lg" />
              <span className="text-sm font-medium">Add Expense</span>
            </button>
          </div>
        </div>

        {/* Total Expense Card */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-lg p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Total Expenses</p>
              <p className="text-4xl font-bold">
                ₹{totalExpense.toLocaleString("en-IN")}
              </p>
              <p className="text-sm opacity-90 mt-2">
                {expenses.length} {expenses.length === 1 ? "expense" : "expenses"}
              </p>
            </div>
            <div className="text-6xl opacity-20">📉</div>
          </div>
        </div>

        {/* Expense List */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            All Expenses
          </h3>

          {expenses.length > 0 ? (
            <div className="space-y-3">
              {expenses.map((expense) => (
                <TransactionCard
                  key={expense._id}
                  icon={expense.icon}
                  title={expense.category}
                  amount={expense.amount}
                  date={expense.date}
                  type="expense"
                  onDelete={() => handleDeleteExpense(expense._id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="💸"
              title="No Expenses Yet"
              message="Click 'Add Expense' to start tracking your expenses"
            />
          )}
        </div>

        {/* Add Expense Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add Expense"
        >
          <form onSubmit={handleAddExpense}>
            {/* Icon Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon
              </label>
              <div className="grid grid-cols-6 gap-2">
                {expenseIcons.map((iconOption) => (
                  <button
                    key={iconOption.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, icon: iconOption.value })
                    }
                    className={`text-2xl p-2 rounded-lg border-2 transition-all ${formData.icon === iconOption.value
                        ? "border-primary bg-violet-50"
                        : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    {iconOption.value}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="e.g., Food, Rent, Transport"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Amount */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                placeholder="0"
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Date */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors"
            >
              Add Expense
            </button>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
