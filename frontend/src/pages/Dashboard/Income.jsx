import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import TransactionCard from "../../components/TransactionCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import Modal from "../../components/Modal";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { showToast } from "../../utils/toast";
import { incomeIcons } from "../../utils/data";
import { HiOutlinePlus, HiOutlineDownload } from "react-icons/hi";

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    icon: "💰",
    source: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);
      setIncomes(response.data);
    } catch (err) {
      showToast("Failed to load income data", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncome = async (e) => {
    e.preventDefault();

    if (!formData.source || !formData.amount || !formData.date) {
      showToast("Please fill all required fields", "error");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        ...formData,
        amount: parseFloat(formData.amount),
      });

      showToast("Income added successfully", "success");
      setIsModalOpen(false);
      setFormData({
        icon: "💰",
        source: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
      });
      fetchIncomes();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to add income", "error");
    }
  };

  const handleDeleteIncome = async (id) => {
    if (!window.confirm("Are you sure you want to delete this income?")) {
      return;
    }

    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
      showToast("Income deleted successfully", "success");
      fetchIncomes();
    } catch (err) {
      showToast("Failed to delete income", "error");
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD_INCOME, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

      showToast("Excel downloaded successfully", "success");
    } catch (err) {
      showToast("Failed to download Excel", "error");
    }
  };

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

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
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Income Sources</h1>
            <p className="text-sm font-medium text-gray-500 mt-1">
              Manage and track all your incoming revenue
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleDownloadExcel}
              disabled={incomes.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-sm"
            >
              <HiOutlineDownload className="text-xl" />
              <span>Export</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 border border-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-semibold shadow-md shadow-emerald-500/20"
            >
              <HiOutlinePlus className="text-xl" />
              <span>Add Income</span>
            </button>
          </div>
        </div>

        {/* Total Income Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl shadow-[0_8px_32px_rgba(16,185,129,0.2)] p-8 mb-10 text-white group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/3 group-hover:scale-110 transition-transform duration-500" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold tracking-widest uppercase opacity-90 mb-3">Total Earned</p>
              <p className="text-6xl font-extrabold tracking-tight">
                ₹{totalIncome.toLocaleString("en-IN")}
              </p>
              <div className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                {incomes.length} Active {incomes.length === 1 ? "Source" : "Sources"}
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center w-28 h-28 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20">
              <span className="text-6xl opacity-90 drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">📈</span>
            </div>
          </div>
        </div>

        {/* Income List */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-8 border border-gray-100/50">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-8">
            Income Log
          </h3>

          {incomes.length > 0 ? (
            <div className="space-y-4">
              {incomes.map((income) => (
                <TransactionCard
                  key={income._id}
                  icon={income.icon}
                  title={income.source}
                  amount={income.amount}
                  date={income.date}
                  type="income"
                  onDelete={() => handleDeleteIncome(income._id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="💰"
              title="No Income Tracked Yet"
              message="Click 'Add Income' above to log your first revenue source"
            />
          )}
        </div>

        {/* Add Income Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Log New Income"
        >
          <form onSubmit={handleAddIncome} className="mt-2">
            {/* Icon Selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Category Icon
              </label>
              <div className="grid grid-cols-5 gap-3">
                {incomeIcons.map((iconOption) => (
                  <button
                    key={iconOption.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, icon: iconOption.value })
                    }
                    className={`text-3xl p-3 rounded-2xl border-2 transition-all duration-200 transform hover:scale-105 ${formData.icon === iconOption.value
                        ? "border-emerald-500 bg-emerald-50 shadow-sm"
                        : "border-gray-100 hover:border-emerald-200 bg-gray-50 hover:bg-emerald-50/50"
                      }`}
                  >
                    {iconOption.value}
                  </button>
                ))}
              </div>
            </div>

            {/* Source */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Source Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.source}
                onChange={(e) =>
                  setFormData({ ...formData, source: e.target.value })
                }
                placeholder="e.g. Salary, Freight, Consulting"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all outline-none font-medium text-gray-900"
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
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all outline-none font-semibold text-gray-900 text-lg"
                required
              />
            </div>

            {/* Date */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Received Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all outline-none font-medium text-gray-900"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold tracking-wide hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300"
            >
              Confirm Income
            </button>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
