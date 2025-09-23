

import React from 'react';
import { Notification } from '../../../entities/notification';

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
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
}

const NotificationItem: React.FC<{ notification: Notification; onMarkAsRead: (id: string) => void }> = ({ notification, onMarkAsRead }) => {
    const typeStyles = {
        Info: {
            bg: 'bg-white',
            indicator: 'bg-indigo-500',
        },
        Warning: {
            bg: 'bg-yellow-50',
            indicator: 'bg-yellow-500',
        },
        Urgent: {
            bg: 'bg-red-50',
            indicator: 'bg-red-500',
        }
    };

    const styles = notification.read 
        ? { bg: 'bg-gray-50', indicator: 'bg-gray-300' }
        : typeStyles[notification.type];

    return (
        <div className={`p-4 rounded-lg flex items-start space-x-4 ${styles.bg} ${!notification.read ? 'shadow-sm' : ''}`}>
            <div className="flex-shrink-0 mt-1">
                <div className={`h-3 w-3 rounded-full ${styles.indicator}`}></div>
            </div>
            <div className="flex-grow">
                <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-800'}`}>{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">{timeAgo(notification.timestamp)}</p>
            </div>
            {!notification.read && (
                <button 
                    onClick={() => onMarkAsRead(notification.id)} 
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex-shrink-0"
                >
                    Mark as read
                </button>
            )}
        </div>
    );
}


const NotificationsPage: React.FC<NotificationsPageProps> = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
    const unreadNotifications = notifications.filter(n => !n.read).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    const readNotifications = notifications.filter(n => n.read).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                {unreadNotifications.length > 0 && (
                    <button 
                        onClick={onMarkAllAsRead}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-md hover:bg-indigo-700 transition"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="space-y-8">
                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">Unread</h2>
                    {unreadNotifications.length > 0 ? (
                        <div className="space-y-3">
                            {unreadNotifications.map(n => <NotificationItem key={n.id} notification={n} onMarkAsRead={onMarkAsRead} />)}
                        </div>
                    ) : (
                        // FIX: Replaced DashboardCard with a styled div as the title prop is required but not applicable for this empty state message.
                        <div className="bg-white p-4 rounded-xl shadow-md">
                            <p className="text-center text-gray-500">You're all caught up!</p>
                        </div>
                    )}
                </section>
                
                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">Read</h2>
                    {readNotifications.length > 0 ? (
                        <div className="space-y-3">
                            {readNotifications.map(n => <NotificationItem key={n.id} notification={n} onMarkAsRead={onMarkAsRead} />)}
                        </div>
                    ) : (
                         // FIX: Replaced DashboardCard with a styled div as the title prop is required but not applicable for this empty state message.
                         <div className="bg-white p-4 rounded-xl shadow-md">
                            <p className="text-center text-gray-500">No previously read notifications.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default NotificationsPage;
