import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
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
      <div className="max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Expenses</h1>
            <p className="text-sm font-medium text-gray-500 mt-1">
              Track and minimize your daily expenditures
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleDownloadExcel}
              disabled={expenses.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-sm"
            >
              <HiOutlineDownload className="text-xl" />
              <span>Export</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 border border-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all font-semibold shadow-md shadow-rose-500/20"
            >
              <HiOutlinePlus className="text-xl" />
              <span>Log Expense</span>
            </button>
          </div>
        </div>

        {/* Total Expense Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-rose-500 to-rose-700 rounded-3xl shadow-[0_8px_32px_rgba(225,29,72,0.2)] p-8 mb-10 text-white group">
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3 group-hover:scale-110 transition-transform duration-500" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold tracking-widest uppercase opacity-90 mb-3">Total Spend</p>
              <p className="text-6xl font-extrabold tracking-tight">
                ₹{totalExpense.toLocaleString("en-IN")}
              </p>
              <div className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-300 animate-pulse"></span>
                {expenses.length} Logged {expenses.length === 1 ? "Expense" : "Expenses"}
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center w-28 h-28 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20">
              <span className="text-6xl opacity-90 drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">📉</span>
            </div>
          </div>
        </div>

        {/* Expense List */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-8 border border-gray-100/50">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-8">
            Expense Log
          </h3>

          {expenses.length > 0 ? (
            <div className="space-y-4">
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
              title="No Expenses Tracked Yet"
              message="Click 'Log Expense' above to start tracking your spending"
            />
          )}
        </div>

        {/* Add Expense Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Log Expenditure"
        >
          <form onSubmit={handleAddExpense} className="mt-2">
            {/* Icon Selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Category Icon
              </label>
              <div className="grid grid-cols-6 gap-3">
                {expenseIcons.map((iconOption) => (
                  <button
                    key={iconOption.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, icon: iconOption.value })
                    }
                    className={`text-2xl p-2.5 rounded-2xl border-2 transition-all duration-200 transform hover:scale-105 ${formData.icon === iconOption.value
                        ? "border-rose-500 bg-rose-50 shadow-sm"
                        : "border-gray-100 hover:border-rose-200 bg-gray-50 hover:bg-rose-50/50"
                      }`}
                  >
                    {iconOption.value}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="e.g. Food, Rent, Transport"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:bg-white transition-all outline-none font-medium text-gray-900"
                required
              />
            </div>

            {/* Amount */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:bg-white transition-all outline-none font-semibold text-gray-900 text-lg"
                required
              />
            </div>

            {/* Date */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Purchased Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:bg-white transition-all outline-none font-medium text-gray-900"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-rose-600 text-white py-3.5 rounded-xl font-bold tracking-wide hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-500/30 transition-all duration-300"
            >
              Confirm Expense
            </button>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
