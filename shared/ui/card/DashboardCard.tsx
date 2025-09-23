import React from 'react';

interface DashboardCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, icon, children, className = '' }) => {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-md ${className}`}>
      <div className="flex items-center mb-4">
        {icon && <div className="mr-3 text-indigo-600">{icon}</div>}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="text-gray-600">
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;