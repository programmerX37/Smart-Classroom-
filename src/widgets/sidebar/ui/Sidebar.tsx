import React from 'react';

const DashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const NotificationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h10.5a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0015 5.25H4.5A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" />
    </svg>
);

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center px-5 py-3 rounded-full transition-all duration-200 text-left relative ${isActive ? 'text-emerald-300' : 'hover:bg-white/5 text-zinc-300'}`}
        aria-current={isActive ? 'page' : undefined}
    >
        {isActive && <div className="absolute inset-0 bg-emerald-500/10 rounded-full ring-1 ring-inset ring-emerald-500/30"></div>}
        <span className="relative z-10">{icon}</span>
        <span className="ml-3 font-semibold relative z-10">{label}</span>
    </button>
);

interface SidebarProps {
  onNavigateToDashboard: () => void;
  onNavigateToCalendar: () => void;
  onNavigateToNotifications: () => void;
  onNavigateToCamera: () => void;
  currentView: 'dashboard' | 'calendar' | 'notifications' | 'home' | 'camera';
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigateToDashboard, onNavigateToCalendar, onNavigateToNotifications, onNavigateToCamera, currentView, isOpen, onClose }) => {
    const sidebarClasses = `
        bg-black/20 backdrop-blur-xl border border-white/10 text-zinc-300 flex flex-col flex-shrink-0
        transition-transform duration-300 ease-in-out
        fixed lg:relative
        inset-y-0 left-0 z-30
        w-64
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        rounded-2xl sm:rounded-3xl
        shadow-2xl shadow-black/20
    `;
    
    return (
        <aside className={sidebarClasses}>
             <div className="p-4 flex justify-between items-center lg:hidden">
                <h2 className="text-lg font-bold text-white">Menu</h2>
                <button onClick={onClose} className="text-zinc-400 hover:text-white" aria-label="Close sidebar">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="px-4 pt-8">
                 <div className="flex items-center justify-center text-emerald-500 gap-2">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xl font-bold text-zinc-100">Smart Scheduler</span>
                  </div>
            </div>
            <nav className="flex-1 space-y-2 mt-12 p-4">
                <NavItem icon={<DashboardIcon />} label="Dashboard" isActive={currentView === 'dashboard'} onClick={onNavigateToDashboard} />
                <NavItem icon={<CalendarIcon />} label="Calendar" isActive={currentView === 'calendar'} onClick={onNavigateToCalendar} />
                <NavItem icon={<NotificationIcon />} label="Notifications" isActive={currentView === 'notifications'} onClick={onNavigateToNotifications} />
                <NavItem icon={<CameraIcon />} label="Camera" isActive={currentView === 'camera'} onClick={onNavigateToCamera} />
            </nav>
            <div className="p-4 border-t border-white/10">
                <p className="text-xs text-zinc-500 text-center">© 25-26 Smart Scheduler Inc.</p>
            </div>
        </aside>
    );
};

export default React.memo(Sidebar);