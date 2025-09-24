import React, { useState, useMemo } from 'react';
import TimetableView from '../../../widgets/timetable';
import { ScheduleItem, Conflict } from '../../../entities/schedule';
import DashboardCard from '../../../shared/ui/card';
import ConflictDetailsModal from '../../../widgets/timetable/ui/ConflictDetailsModal';
import { Resource } from '../../../entities/resource';
import NewsViewerModal from '../../../widgets/news-viewer';
import TeacherActionsModal from '../../../widgets/teacher-actions';
import { AppEntry } from '../../../entities/app-entry';
import CreatedEntriesView from '../../../widgets/created-entries';

// Icons for KPIs
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>;
const ChartBarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;


interface TeacherSchedulerProps {
  teacherName: string;
  schedule: ScheduleItem[];
  conflicts: Conflict[];
  appEntries: AppEntry[];
  resources: Resource[];
  onCreateEntry: (entry: Omit<AppEntry, 'id' | 'createdAt'>) => void;
}

interface AttendanceMonitorChartProps {
  studentGroups: Resource[];
}

const AttendanceMonitorChart: React.FC<AttendanceMonitorChartProps> = ({ studentGroups }) => {
    if (studentGroups.length === 0) {
        return <p className="text-sm text-emerald-200/60 h-48 flex items-center justify-center">No student groups created yet.</p>;
    }

    // Generate mock attendance data for dynamic groups
    const data = studentGroups.map(group => ({
        name: group.name,
        attendance: Math.floor(Math.random() * (100 - 85 + 1)) + 85, // Random attendance between 85% and 100%
    }));

    return (
        <div className="space-y-3 h-48 overflow-y-auto pr-2">
            {data.map(item => (
                <div key={item.name}>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-emerald-100">{item.name}</span>
                        <span className="text-emerald-200/80">{item.attendance}%</span>
                    </div>
                    <div className="w-full bg-emerald-900/50 rounded-full h-2.5">
                        <div className="bg-emerald-400 h-2.5 rounded-full" style={{ width: `${item.attendance}%` }}></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const MenteeList: React.FC = () => {
    const mentees = Array.from({ length: 30 }, (_, i) => `Student Name ${i + 1}`);
    return (
        <div className="h-48 overflow-y-auto pr-2">
            <ul className="space-y-2">
                {mentees.map(mentee => (
                    <li key={mentee} className="text-emerald-200/90 text-sm bg-emerald-500/10 p-2 rounded-lg">{mentee}</li>
                ))}
            </ul>
        </div>
    );
};

const getEntryStyle = (type: AppEntry['type']): string => {
    switch (type) {
        case 'news': return 'bg-gray-500/15 text-gray-100 border-gray-500/30';
        case 'alert': return 'bg-red-500/15 text-red-100 border-red-500/30';
        case 'payment': return 'bg-blue-500/15 text-blue-100 border-blue-500/30';
        case 'task': return 'bg-yellow-500/15 text-yellow-100 border-yellow-500/30';
        default: return 'bg-blue-500/15 text-blue-100 border-blue-500/30';
    }
}

const vtuNewsContent = {
    title: "VTU News: Re-evaluation results for 1st sem announced",
    content: "The Visvesvaraya Technological University (VTU) has officially announced the re-evaluation results for the 1st semester examinations conducted earlier this year.\n\nStudents can access their results through the official VTU portal using their registration number. The university has also released the schedule for supplementary examinations, which will commence next month. Further details regarding fees and application procedures are available on the VTU website.\n\nWe advise all concerned students to check the portal for their individual results and important updates."
};


const AlertsList: React.FC<{ entries: AppEntry[]; onNewsClick: (news: { title: string; content: string }) => void; }> = ({ entries, onNewsClick }) => {
    const unread = entries.filter(n => !n.read).slice(0, 5);
    
    return (
        <div className="h-48 overflow-y-auto pr-2">
            {unread.length > 0 ? (
                <ul className="space-y-2">
                    {unread.map(n => (
                         <li 
                            key={n.id} 
                            className={`text-xs p-2 rounded-lg border ${getEntryStyle(n.type)} ${n.type === 'news' ? 'cursor-pointer hover:bg-zinc-700/60' : ''} transition-colors`} 
                            title={n.type === 'news' ? "Click to read more" : "This is an alert"}
                            onClick={() => n.type === 'news' && onNewsClick(vtuNewsContent)}
                         >
                            <p className="font-semibold">{n.message}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="h-full flex items-center justify-center">
                    <p className="text-sm text-gray-400">No new alerts or news.</p>
                </div>
            )}
        </div>
    );
};

const TeacherScheduler: React.FC<TeacherSchedulerProps> = ({ teacherName, schedule, conflicts, appEntries, resources, onCreateEntry }) => {
  const teacherSchedule = useMemo(() => schedule.filter(item => item.teacher === teacherName), [schedule, teacherName]);
  const [selectedItem, setSelectedItem] = useState<ScheduleItem | null>(null);
  const studentGroups = resources.filter(r => r.type === 'StudentGroup');
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<{ title: string, content: string } | null>(null);
  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);

  const handleItemClick = (item: ScheduleItem) => {
    const itemConflicts = conflicts.filter(c => c.itemId === item.id);
    if (itemConflicts.length > 0) {
        setSelectedItem(item);
    }
  }
  
  const handleNewsClick = (news: { title: string, content: string }) => {
      setSelectedNews(news);
      setIsNewsModalOpen(true);
  };
  
  const handleCloseNewsModal = () => {
      setIsNewsModalOpen(false);
      setSelectedNews(null);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
       <div className="flex-shrink-0">
            <div className="flex items-center gap-4">
                <h1 className="text-3xl md:text-4xl font-semibold text-white">Hi, {teacherName}</h1>
                <button 
                    onClick={() => setIsActionsModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full h-9 w-9 flex items-center justify-center transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-emerald-500" 
                    title="Add Task, Payment, or Alert"
                    aria-label="Add Task, Payment, or Alert"
                >
                    <PlusIcon />
                </button>
            </div>
            <p className="text-gray-400 mt-1">Here’s your teaching dashboard.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-shrink-0">
            <DashboardCard title="Attendance Monitoring" icon={<ChartBarIcon />} variant="light">
                <AttendanceMonitorChart studentGroups={studentGroups} />
            </DashboardCard>
            <DashboardCard title="My Mentees (30)" icon={<UsersIcon />} variant="light">
                <MenteeList />
            </DashboardCard>
            <DashboardCard title="Alerts & News" icon={<BellIcon />} variant="light">
                <AlertsList entries={appEntries} onNewsClick={handleNewsClick} />
            </DashboardCard>
            
            <CreatedEntriesView entries={appEntries} />

        </div>

      <DashboardCard title="My Weekly Schedule" className="flex-grow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <p className="text-sm text-gray-400">Click a class with a conflict to view details.</p>
        </div>
        <TimetableView 
            schedule={teacherSchedule} 
            conflicts={conflicts} 
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
      {isNewsModalOpen && selectedNews && (
          <NewsViewerModal
              title={selectedNews.title}
              content={selectedNews.content}
              onClose={handleCloseNewsModal}
          />
      )}
      {isActionsModalOpen && (
          <TeacherActionsModal 
            onClose={() => setIsActionsModalOpen(false)}
            onCreateEntry={onCreateEntry}
          />
      )}
    </div>
  );
};

export default React.memo(TeacherScheduler);