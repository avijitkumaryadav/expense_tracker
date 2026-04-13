import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import StatsCard from "../../components/StatsCard";
import TransactionCard from "../../components/TransactionCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const Home = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            Overview of your financial activity
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            icon="💰"
            title="Total Balance"
            amount={dashboardData?.totalBalance}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatsCard
            icon="📈"
            title="Total Income"
            amount={dashboardData?.totalIncome}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />
          <StatsCard
            icon="📉"
            title="Total Expenses"
            amount={dashboardData?.totalExpenses}
            bgColor="bg-red-50"
            iconColor="text-red-600"
          />
        </div>

        {/* Period Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Last 60 Days Income */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Last 60 Days Income
              </h3>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-3xl font-bold text-green-600 mb-2">
              ₹{dashboardData?.last60DaysIncome?.total?.toLocaleString("en-IN") || 0}
            </p>
            <p className="text-sm text-gray-600">
              {dashboardData?.last60DaysIncome?.transactions?.length || 0} transactions
            </p>
          </div>

          {/* Last 30 Days Expenses */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Last 30 Days Expenses
              </h3>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-3xl font-bold text-red-600 mb-2">
              ₹{dashboardData?.last30DaysExpenses?.total?.toLocaleString("en-IN") || 0}
            </p>
            <p className="text-sm text-gray-600">
              {dashboardData?.last30DaysExpenses?.transactions?.length || 0} transactions
            </p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Transactions
          </h3>

          {dashboardData?.recentTransactions?.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.recentTransactions.slice(0, 10).map((transaction) => (
                <TransactionCard
                  key={transaction._id}
                  icon={transaction.icon}
                  title={transaction.source || transaction.category}
                  amount={transaction.amount}
                  date={transaction.date}
                  type={transaction.type}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="📭"
              title="No Transactions Yet"
              message="Start adding income or expenses to see them here"
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
