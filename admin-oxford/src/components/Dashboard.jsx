// components/Dashboard.jsx
import React from 'react';
import { Image, BookOpen, GalleryHorizontal, CalendarDays, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: 'Hero Items', value: '3', icon: Image, color: 'from-blue-500 to-blue-600' },
    { label: 'Courses', value: '12', icon: BookOpen, color: 'from-green-500 to-green-600' },
    { label: 'Gallery Images', value: '24', icon: GalleryHorizontal, color: 'from-purple-500 to-purple-600' },
    { label: 'Events', value: '8', icon: CalendarDays, color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2 text-gray-800">{stat.value}</p>
                </div>
                <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
        </div>
        <div className="space-y-3">
          {['Added new course "React Mastery"', 'Updated hero banner', 'Added 3 new gallery images', 'Created event "Tech Conference 2026"'].map((activity, i) => (
            <div key={i} className="flex items-center space-x-3 text-gray-600 py-2 border-b last:border-0">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>{activity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;