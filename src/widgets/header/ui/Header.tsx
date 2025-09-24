import React, { useState, useRef, useEffect } from 'react';
import { UserRole } from '../../../entities/user';
import { AppEntry } from '../../../entities/app-entry';


interface HeaderProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  notifications: AppEntry[];
  onNavigateToNotifications: () => void;
  onToggleSidebar: () => void;
}

const RoleSwitcher: React.FC<Pick<HeaderProps, 'currentRole' | 'setCurrentRole'>> = ({ currentRole, setCurrentRole }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleRoleSelect = (role: UserRole) => {
        setCurrentRole(role);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);
    
    return (
        <div className="relative" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white/5 border border-white/10 text-zinc-200 rounded-full py-2 px-4 sm:px-5 w-32 sm:w-36 flex items-center justify-between cursor-pointer hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-emerald-500 transition-all font-semibold text-sm sm:text-base"
            >
                <span>{currentRole}</span>
                <svg
                  className={`h-4 w-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            {isOpen && (
                <div className="absolute top-full mt-2 w-36 bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-lg z-10 overflow-hidden border border-white/10">
                    <ul className="text-zinc-200">
                        {Object.values(UserRole).map((role) => (
                            <li 
                                key={role} 
                                onClick={() => handleRoleSelect(role)}
                                className={`px-4 py-2 cursor-pointer transition-colors text-sm sm:text-base ${role === currentRole ? 'bg-emerald-500/20 font-semibold text-emerald-300' : 'hover:bg-zinc-700/50'}`}
                            >
                                {role}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

const NotificationBell: React.FC<{ notifications: AppEntry[]; onClick: () => void }> = ({ notifications, onClick }) => {
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <button onClick={onClick} className="relative text-zinc-400 hover:text-white transition-colors h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/10" aria-label="Open notifications">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-zinc-800">{unreadCount}</span>
            )}
        </button>
    );
};

const Header: React.FC<HeaderProps> = ({ currentRole, setCurrentRole, notifications, onNavigateToNotifications, onToggleSidebar }) => {
  return (
     <header className="flex items-center justify-between flex-shrink-0 px-3 sm:px-4 py-2">
        {/* Left: Hamburger, Logo and App Name */}
        <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={onToggleSidebar} className="lg:hidden text-zinc-400 hover:text-white h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors" aria-label="Open sidebar">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
          <div className="flex items-center justify-center text-emerald-500">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-zinc-100 text-base sm:text-lg font-bold tracking-wide hidden sm:block">Smart Scheduler</h1>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-lg mx-6 relative hidden lg:block">
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full bg-white/5 border border-white/10 text-zinc-200 placeholder-zinc-500 rounded-full py-2.5 pl-10 pr-4 outline-none focus:bg-white/10 focus:ring-2 focus:ring-emerald-500 transition-all"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>

        {/* Right: User Role, Notifications, Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          <RoleSwitcher currentRole={currentRole} setCurrentRole={setCurrentRole} />
          <NotificationBell notifications={notifications} onClick={onNavigateToNotifications} />
          <div className="rounded-full w-9 h-9 sm:w-10 sm:h-10 overflow-hidden bg-zinc-600 flex items-center justify-center ring-2 ring-zinc-700">
            <img src="https://picsum.photos/100" alt="User Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>
  );
};

export default React.memo(Header);