import React, { useMemo } from 'react';
import { AppEntry } from '../../../entities/app-entry';

// Helper to format time difference
const timeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    if (seconds < 5) return "just now";
    return Math.floor(seconds) + " seconds ago";
};


interface NotificationsPageProps {
    notifications: AppEntry[];
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
}

const getEntryStyle = (type: AppEntry['type']): { bg: string; indicator: string; textColor: string; } => {
    switch (type) {
        case 'alert':
            return { bg: 'bg-red-500/15', indicator: 'bg-red-400', textColor: 'text-red-100' };
        case 'payment':
            return { bg: 'bg-blue-500/15', indicator: 'bg-blue-400', textColor: 'text-blue-100' };
        case 'task':
            return { bg: 'bg-yellow-500/15', indicator: 'bg-yellow-400', textColor: 'text-yellow-100' };
        case 'news':
        default:
            return { bg: 'bg-gray-500/15', indicator: 'bg-gray-500', textColor: 'text-gray-100' };
    }
};

const NotificationItem: React.FC<{ notification: AppEntry; onMarkAsRead: (id: string) => void }> = ({ notification, onMarkAsRead }) => {
    const baseStyles = getEntryStyle(notification.type);

    const styles = notification.read 
        ? { bg: 'bg-zinc-800/50', indicator: 'bg-zinc-600', textColor: 'text-gray-400' }
        : baseStyles;

    return (
        <div className={`p-4 rounded-3xl flex items-start space-x-4 ${styles.bg}`}>
            <div className="flex-shrink-0 mt-1.5">
                <div className={`h-2.5 w-2.5 rounded-full ${styles.indicator}`}></div>
            </div>
            <div className="flex-grow">
                <p className={`text-sm font-medium ${styles.textColor}`}>{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{timeAgo(notification.createdAt)}</p>
            </div>
            {!notification.read && (
                <button 
                    onClick={() => onMarkAsRead(notification.id)} 
                    className="text-sm text-emerald-400 hover:text-emerald-300 font-medium flex-shrink-0"
                >
                    Mark as read
                </button>
            )}
        </div>
    );
}


const NotificationsPage: React.FC<NotificationsPageProps> = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
    const { unreadNotifications, readNotifications } = useMemo(() => {
        const unread = notifications.filter(n => !n.read);
        const read = notifications.filter(n => n.read);
        
        unread.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        read.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        return { unreadNotifications: unread, readNotifications: read };
    }, [notifications]);


    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Notifications</h1>
                {unreadNotifications.length > 0 && (
                    <button 
                        onClick={onMarkAllAsRead}
                        className="px-5 py-3 bg-emerald-600 text-white text-sm font-semibold rounded-3xl hover:bg-emerald-700 transition"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="space-y-8">
                <section>
                    <h2 className="text-lg font-semibold text-gray-300 mb-3">Unread</h2>
                    {unreadNotifications.length > 0 ? (
                        <div className="space-y-3">
                            {unreadNotifications.map(n => <NotificationItem key={n.id} notification={n} onMarkAsRead={onMarkAsRead} />)}
                        </div>
                    ) : (
                        <div className="bg-zinc-800/50 p-6 rounded-3xl shadow-md border border-zinc-700/80">
                            <p className="text-center text-gray-400">You're all caught up!</p>
                        </div>
                    )}
                </section>
                
                <section>
                    <h2 className="text-lg font-semibold text-gray-300 mb-3">Read</h2>
                    {readNotifications.length > 0 ? (
                        <div className="space-y-3">
                            {readNotifications.slice(0, 10).map(n => <NotificationItem key={n.id} notification={n} onMarkAsRead={onMarkAsRead} />)}
                        </div>
                    ) : (
                         <div className="bg-zinc-800/50 p-6 rounded-3xl shadow-md border border-zinc-700/80">
                            <p className="text-center text-gray-400">No previously read notifications.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default React.memo(NotificationsPage);