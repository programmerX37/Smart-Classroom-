
import React from 'react';
import DashboardCard from '../../../shared/ui/card';
import TimetableView from '../../../widgets/timetable';
import { MOCK_STUDENT_GROUPS } from '../../../shared/config';
import { ScheduleItem, Conflict } from '../../../entities/schedule';
import { useStudentDashboard } from '../model/useStudentDashboard';
import { Notification } from '../../../entities/notification';


const TodayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const AlertIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

interface StudentDashboardProps {
  schedule: ScheduleItem[];
  conflicts: Conflict[];
  notifications: Notification[];
}

const TodaysClasses: React.FC<{ classes: ScheduleItem[] }> = ({ classes }) => {
    if (classes.length === 0) {
        return <p>No classes scheduled for today.</p>;
    }
    return (
        <ul className="space-y-3">
            {classes.map(item => (
                <li key={item.id} className={`p-3 rounded-lg flex justify-between items-center ${item.color} bg-opacity-80`}>
                    <div>
                        <p className="font-semibold">{item.subject}</p>
                        <p className="text-sm text-gray-700">{item.teacher} - {item.roomId}</p>
                    </div>
                    <div className="font-medium text-sm">{item.startTime}</div>
                </li>
            ))}
        </ul>
    );
};

const getNotificationStyle = (type: Notification['type']): string => {
    switch (type) {
        case 'Urgent':
            return 'bg-red-100 border-l-4 border-red-500';
        case 'Warning':
            return 'bg-yellow-100 border-l-4 border-yellow-500';
        case 'Info':
        default:
            return 'bg-indigo-100 border-l-4 border-indigo-500';
    }
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ schedule, conflicts, notifications }) => {
  const {
    selectedGroup,
    setSelectedGroup,
    todaysClasses,
    groupSchedule,
  } = useStudentDashboard(schedule);
  
  const unreadNotifications = notifications
    .filter(n => !n.read)
    .sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <DashboardCard title={`Today's Classes for ${selectedGroup}`} icon={<TodayIcon />}>
                <TodaysClasses classes={todaysClasses} />
            </DashboardCard>
        </div>
        <DashboardCard title="Alerts & Notifications" icon={<AlertIcon />}>
            {unreadNotifications.length > 0 ? (
                <ul className="space-y-2">
                    {unreadNotifications.slice(0, 3).map(n => (
                        <li key={n.id} className={`text-sm p-2 rounded ${getNotificationStyle(n.type)}`}>
                            {n.message}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-500">No new notifications.</p>
            )}
        </DashboardCard>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Weekly Timetable for <span className="text-indigo-600">{selectedGroup}</span></h2>
            <div>
                <label htmlFor="group-select" className="sr-only">Select Class</label>
                <select
                    id="group-select"
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm leading-5 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                >
                    {MOCK_STUDENT_GROUPS.map(group => (
                        <option key={group} value={group}>{group}</option>
                    ))}
                </select>
            </div>
        </div>
        <TimetableView schedule={groupSchedule} conflicts={conflicts} />
      </div>
    </div>
  );
};

export default StudentDashboard;
