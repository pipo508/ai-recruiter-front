import React from 'react';
import { TrendingUp, Calendar, Search } from 'lucide-react';

const SearchStats = ({ stats }) => {
  const statItems = [
    {
      icon: Search,
      label: 'Total de búsquedas',
      value: stats.total,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
    {
      icon: Calendar,
      label: 'Hoy',
      value: stats.today,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
    },
    {
      icon: TrendingUp,
      label: 'Esta semana',
      value: stats.thisWeek,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {statItems.map((stat, index) => (
        <div
          key={stat.label}
          className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 text-center hover:border-gray-600/50 transition-all duration-300 animate-fadeInUp"
          style={{ animationDelay: `${600 + index * 100}ms` }}
        >
          <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
          <p className="text-gray-400 text-sm">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default SearchStats;