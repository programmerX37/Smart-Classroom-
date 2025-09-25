import React from 'react';

interface DashboardCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  variant?: 'dark' | 'light';
  actions?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, icon, children, className = '', variant = 'dark', actions }) => {
  const baseStyles = `p-4 sm:p-6 rounded-3xl transition-all duration-300 flex flex-col group relative overflow-hidden ${className}`;

  const variantStyles = {
    dark: {
      bg: 'bg-zinc-900/40 backdrop-blur-lg',
      title: 'text-zinc-100',
      icon: 'text-emerald-400',
      text: 'text-zinc-300',
      border: 'border border-white/10',
      glow: 'group-hover:border-emerald-400/50',
    },
    light: {
      bg: 'bg-emerald-950/20 backdrop-blur-lg',
      title: 'text-emerald-100',
      icon: 'text-emerald-300',
      text: 'text-emerald-200',
      border: 'border border-emerald-400/20',
      glow: 'group-hover:border-emerald-400/50',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={`${baseStyles} ${styles.bg} ${styles.border} ${styles.glow}`}>
       <div className="absolute inset-0 border-2 border-transparent group-hover:border-emerald-400/50 rounded-3xl transition-all duration-300 pointer-events-none"></div>
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center min-w-0">
          {icon && <div className={`mr-3 flex-shrink-0 ${styles.icon}`}>{icon}</div>}
          <h3 className={`text-lg font-semibold truncate ${styles.title}`}>{title}</h3>
        </div>
        {actions && <div className="ml-4 flex-shrink-0">{actions}</div>}
      </div>
      <div className={`${styles.text} flex-grow min-h-0 flex flex-col`}>
        {children}
      </div>
    </div>
  );
};

export default React.memo(DashboardCard);