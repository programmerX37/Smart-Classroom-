import React, { useState, useMemo } from 'react';
import DashboardCard from '../../../shared/ui/card';
import TimetableView from '../../../widgets/timetable';
import { ScheduleItem, Conflict } from '../../../entities/schedule';
import { useStudentDashboard } from '../model/useStudentDashboard';
import { ConflictDetailsModal } from '../../../widgets/timetable';
import { AppEntry } from '../../../entities/app-entry';


const TodayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const AlertIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const AttendanceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;
const TaskIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;

interface StudentDashboardProps {
  studentGroup: string;
  schedule: ScheduleItem[];
  conflicts: Conflict[];
  appEntries: AppEntry[];
}

const TodaysClasses: React.FC<{ classes: ScheduleItem[] }> = ({ classes }) => {
    if (classes.length === 0) {
        return <p className="text-emerald-200/60">No classes scheduled for today.</p>;
    }
    return (
        <ul className="space-y-3">
            {classes.map(item => (
                <li key={item.id} className={`p-3 rounded-lg flex justify-between items-center bg-emerald-500/10`}>
                    <div>
                        <p className="font-semibold text-emerald-100">{item.subject}</p>
                        <p className="text-sm text-emerald-200/80">{item.teacher} - {item.roomId}</p>
                    </div>
                    <div className="font-medium text-sm text-emerald-200">{item.startTime}</div>
                </li>
            ))}
        </ul>
    );
};

const StudentTasks: React.FC<{ tasks: AppEntry[] }> = ({ tasks }) => {
    if (tasks.length === 0) {
        return <div className="h-full flex items-center justify-center"><p className="text-sm text-gray-400">No pending tasks. Great job!</p></div>;
    }

    return (
        <ul className="space-y-3 h-32 overflow-y-auto pr-2">
            {tasks.map(task => (
                <li key={task.id} className="bg-zinc-700/50 p-3 rounded-lg">
                    <p className="font-semibold text-gray-200 text-sm">{task.message}</p>
                    <p className="text-xs text-gray-400 mt-1">Assigned: {task.createdAt.toLocaleDateString()}</p>
                </li>
            ))}
        </ul>
    );
};


const getEntryStyle = (type: AppEntry['type']): string => {
    switch (type) {
        case 'news': return 'bg-gray-500/15 text-gray-100';
        case 'alert': return 'bg-red-500/15 text-red-100';
        case 'payment': return 'bg-blue-500/15 text-blue-100';
        case 'task': return 'bg-yellow-500/15 text-yellow-100';
        default: return 'bg-blue-500/15 text-blue-100';
    }
}

const AttendanceChart: React.FC = () => {
    const attendanceData = [
        { day: 'Mon', present: 95 },
        { day: 'Tue', present: 100 },
        { day: 'Wed', present: 90 },
        { day: 'Thu', present: 100 },
        { day: 'Fri', present: 85 },
    ];
    return (
        <div className="flex justify-around items-end h-32 pt-4">
            {attendanceData.map(item => (
                <div key={item.day} className="text-center w-8 flex flex-col items-center justify-end">
                    <div className="text-xs text-emerald-100 mb-1">{item.present}%</div>
                    <div className="bg-emerald-400/80 rounded-t-md w-full" style={{ height: `${item.present * 0.8}%` }}></div>
                    <span className="text-xs font-medium text-emerald-200/80 mt-1">{item.day}</span>
                </div>
            ))}
        </div>
    );
};

const StudentDashboard: React.FC<StudentDashboardProps> = ({ studentGroup, schedule, conflicts, appEntries }) => {
  const {
    todaysClasses,
    groupSchedule,
  } = useStudentDashboard(schedule, studentGroup);
  
  const [selectedItem, setSelectedItem] = useState<ScheduleItem | null>(null);

  const { unreadEntries, tasks } = useMemo(() => {
    const unread = appEntries
        .filter(n => !n.read)
        .sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    const taskEntries = appEntries.filter(e => e.type === 'task');
    
    return { unreadEntries: unread, tasks: taskEntries };
  }, [appEntries]);


  const handleItemClick = (item: ScheduleItem) => {
    const itemConflicts = conflicts.filter(c => c.itemId === item.id);
    if (itemConflicts.length > 0) {
        setSelectedItem(item);
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex-shrink-0">
            <h1 className="text-3xl md:text-4xl font-semibold text-white">Welcome, {studentGroup}</h1>
            <p className="text-gray-400 mt-1">Here’s your dashboard overview.</p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 flex-shrink-0">
        <DashboardCard title={`${todaysClasses.length} Classes Today`} icon={<TodayIcon />} variant="light">
            <TodaysClasses classes={todaysClasses} />
        </DashboardCard>

        <DashboardCard title="Alerts & Notifications" icon={<AlertIcon />}>
            {unreadEntries.length > 0 ? (
                <ul className="space-y-3">
                    {unreadEntries.slice(0, 3).map(n => (
                        <li key={n.id} className={`text-sm p-3 rounded-3xl ${getEntryStyle(n.type)}`}>
                            <p className="font-semibold">{n.message}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-400">No new notifications.</p>
            )}
        </DashboardCard>

        <DashboardCard title="Attendance This Week" icon={<AttendanceIcon />} variant="light">
            <AttendanceChart />
        </DashboardCard>

        <DashboardCard title="My Tasks" icon={<TaskIcon />}>
             <StudentTasks tasks={tasks} />
        </DashboardCard>
      </div>

      <DashboardCard title={`Weekly Timetable for ${studentGroup}`}>
        <TimetableView
          schedule={groupSchedule}
          conflicts={conflicts}
          viewMode="list"
          onItemClick={handleItemClick}
        />
      </DashboardCard>
      {selectedItem && (
        <ConflictDetailsModal
            item={selectedItem}
            conflicts={conflicts}
            onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default React.memo(StudentDashboard);