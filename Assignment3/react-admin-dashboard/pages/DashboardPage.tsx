
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import ChartComponent from '../components/ChartComponent';
import { mockLineChartData, mockBarChartData, mockPieChartData, mockDashboardStats, mockRecentActivities } from '../services/mockData';
import { generateDashboardTip } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { InfoIcon, HomeIcon, TrashIcon, EditIcon, CheckIcon, MenuIcon } from '../components/Icons'; // Added MenuIcon, CheckIcon
import { User } from '../types';
import { MOCK_USER } from '../constants';

// Simplified icons for stats for now, can be replaced with more specific ones
const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
);
const TrendingUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>
);
const DollarSignIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const PackageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10.5 8.25h3M12 3v5.25" /></svg>
);


const StatCard: React.FC<{ title: string; value: string; change: string; changeType: 'positive' | 'negative'; iconType: "users" | "revenue" | "orders" | "growth" }> = ({ title, value, change, changeType, iconType }) => {
  const iconMap = {
    users: <UsersIcon className="w-8 h-8 text-blue-500" />,
    revenue: <DollarSignIcon className="w-8 h-8 text-green-500" />,
    orders: <PackageIcon className="w-8 h-8 text-yellow-500" />,
    growth: <TrendingUpIcon className="w-8 h-8 text-purple-500" />,
  };
  const icon = iconMap[iconType];

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400">{title}</p>
          <p className="text-2xl font-semibold text-secondary-800 dark:text-secondary-100">{value}</p>
        </div>
        <div className="p-3 bg-primary-100 dark:bg-primary-500/20 rounded-full">
            {icon}
        </div>
      </div>
      <p className={`text-xs mt-2 ${changeType === 'positive' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
        {change} vs last month
      </p>
    </Card>
  );
};


const DashboardPage: React.FC = () => {
  const [dashboardTip, setDashboardTip] = useState<string>('');
  const [isLoadingTip, setIsLoadingTip] = useState<boolean>(true);
  const user: User = MOCK_USER; // Or fetch from context/API

  useEffect(() => {
    const fetchTip = async () => {
      setIsLoadingTip(true);
      try {
        const tip = await generateDashboardTip();
        setDashboardTip(tip);
      } catch (error) {
        console.error("Failed to load dashboard tip:", error);
        setDashboardTip("💡 Tip: Stay hydrated and take regular breaks!");
      } finally {
        setIsLoadingTip(false);
      }
    };
    fetchTip();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white dark:from-primary-600 dark:to-primary-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, {user.name}!</h1>
                <p className="mt-1 text-primary-100 dark:text-primary-200">Here's what's happening with your projects today.</p>
            </div>
            <button className="mt-4 sm:mt-0 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
                View Reports
            </button>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockDashboardStats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            iconType={stat.iconType}
          />
        ))}
      </div>

      {/* Gemini Tip */}
      <Card>
        {isLoadingTip ? (
          <div className="flex items-center justify-center h-12">
            <LoadingSpinner size="sm" text="Fetching tip..." />
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <InfoIcon className="w-6 h-6 text-primary-500 dark:text-primary-400 flex-shrink-0" />
            <p className="text-sm text-secondary-700 dark:text-secondary-300">{dashboardTip}</p>
          </div>
        )}
      </Card>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Sales Over Time (UV vs PV)">
          <ChartComponent data={mockLineChartData} type="line" dataKeys={['uv', 'pv']} />
        </Card>
        <Card title="Product Performance (Sales & Profit)">
          <ChartComponent data={mockBarChartData} type="bar" dataKeys={['sales', 'profit']} />
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card title="Category Distribution" className="md:col-span-1">
            <ChartComponent data={mockPieChartData} type="pie" dataKeys={{ nameKey: 'name', valueKey: 'value' }} />
        </Card>

        {/* Recent Activities */}
        <Card title="Recent Activities" className="md:col-span-2">
          <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {mockRecentActivities.map((activity) => (
              <li key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors">
                <img src={activity.avatar} alt={activity.user} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-secondary-800 dark:text-secondary-200">
                    <span className="font-semibold">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">{activity.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Quick Actions Example (optional) */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button className="flex flex-col items-center justify-center p-4 bg-primary-500/10 hover:bg-primary-500/20 dark:bg-primary-500/20 dark:hover:bg-primary-500/30 rounded-lg transition-colors">
                <HomeIcon className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-1" />
                <span className="text-sm font-medium text-primary-700 dark:text-primary-300">New Task</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 bg-green-500/10 hover:bg-green-500/20 dark:bg-green-500/20 dark:hover:bg-green-500/30 rounded-lg transition-colors">
                <CheckIcon className="w-8 h-8 text-green-600 dark:text-green-400 mb-1" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">Add Event</span>
            </button>
             <button className="flex flex-col items-center justify-center p-4 bg-yellow-500/10 hover:bg-yellow-500/20 dark:bg-yellow-500/20 dark:hover:bg-yellow-500/30 rounded-lg transition-colors">
                <EditIcon className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mb-1" />
                <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Create Report</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 bg-purple-500/10 hover:bg-purple-500/20 dark:bg-purple-500/20 dark:hover:bg-purple-500/30 rounded-lg transition-colors">
                <MenuIcon className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-1" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Manage Users</span>
            </button>
        </div>
      </Card>

    </div>
  );
};

export default DashboardPage;
