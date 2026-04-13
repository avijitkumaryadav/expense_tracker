import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
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
      <div className="max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Overview of your financial activity
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatsCard
            icon="💰"
            title="Total Balance"
            amount={dashboardData?.totalBalance}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
          <StatsCard
            icon="📈"
            title="Total Income"
            amount={dashboardData?.totalIncome}
            bgColor="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <StatsCard
            icon="📉"
            title="Total Expenses"
            amount={dashboardData?.totalExpenses}
            bgColor="bg-rose-50"
            iconColor="text-rose-600"
          />
        </div>

        {/* Period Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Last 60 Days Income */}
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl p-8 shadow-[0_8px_32px_rgba(16,185,129,0.2)] text-white group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-500" />
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h3 className="text-lg font-semibold tracking-wide text-emerald-50 opacity-90">
                Last 60 Days Income
              </h3>
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <span className="text-2xl">📊</span>
              </div>
            </div>
            <p className="text-5xl font-extrabold mb-3 tracking-tight relative z-10">
              ₹{dashboardData?.last60DaysIncome?.total?.toLocaleString("en-IN") || 0}
            </p>
            <p className="text-sm font-medium opacity-80 relative z-10">
              {dashboardData?.last60DaysIncome?.transactions?.length || 0} transactions detected
            </p>
          </div>

          {/* Last 30 Days Expenses */}
          <div className="relative overflow-hidden bg-gradient-to-br from-rose-500 to-rose-700 rounded-3xl p-8 shadow-[0_8px_32px_rgba(244,63,94,0.2)] text-white group">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3 group-hover:scale-110 transition-transform duration-500" />
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h3 className="text-lg font-semibold tracking-wide text-rose-50 opacity-90">
                Last 30 Days Expenses
              </h3>
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <span className="text-2xl">📉</span>
              </div>
            </div>
            <p className="text-5xl font-extrabold mb-3 tracking-tight relative z-10">
              ₹{dashboardData?.last30DaysExpenses?.total?.toLocaleString("en-IN") || 0}
            </p>
            <p className="text-sm font-medium opacity-80 relative z-10">
              {dashboardData?.last30DaysExpenses?.transactions?.length || 0} transactions detected
            </p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-8 border border-gray-100/50">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">
              Recent Transactions
            </h3>
            <button className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors">
              View All
            </button>
          </div>

          {dashboardData?.recentTransactions?.length > 0 ? (
            <div className="space-y-4">
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
