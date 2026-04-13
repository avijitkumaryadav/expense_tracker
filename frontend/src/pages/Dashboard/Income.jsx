import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Income</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your income sources
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDownloadExcel}
              disabled={incomes.length === 0}
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
              <span className="text-sm font-medium">Add Income</span>
            </button>
          </div>
        </div>

        {/* Total Income Card */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Total Income</p>
              <p className="text-4xl font-bold">
                ₹{totalIncome.toLocaleString("en-IN")}
              </p>
              <p className="text-sm opacity-90 mt-2">
                {incomes.length} {incomes.length === 1 ? "source" : "sources"}
              </p>
            </div>
            <div className="text-6xl opacity-20">📈</div>
          </div>
        </div>

        {/* Income List */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            All Income Sources
          </h3>

          {incomes.length > 0 ? (
            <div className="space-y-3">
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
              title="No Income Sources Yet"
              message="Click 'Add Income' to start tracking your income"
            />
          )}
        </div>

        {/* Add Income Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add Income"
        >
          <form onSubmit={handleAddIncome}>
            {/* Icon Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon
              </label>
              <div className="grid grid-cols-5 gap-2">
                {incomeIcons.map((iconOption) => (
                  <button
                    key={iconOption.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, icon: iconOption.value })
                    }
                    className={`text-3xl p-2 rounded-lg border-2 transition-all ${formData.icon === iconOption.value
                        ? "border-primary bg-violet-50"
                        : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    {iconOption.value}
                  </button>
                ))}
              </div>
            </div>

            {/* Source */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.source}
                onChange={(e) =>
                  setFormData({ ...formData, source: e.target.value })
                }
                placeholder="e.g., Salary, Freelance"
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
              Add Income
            </button>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
