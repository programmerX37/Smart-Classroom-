

import React from 'react';
import TimetableView from '../../../widgets/timetable';
import { ScheduleItem, Conflict } from '../../../entities/schedule';
import DashboardCard from '../../../shared/ui/card';

// Icons for KPIs
const ClassesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" /></svg>;
const AssignmentsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
const ExamIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-9-8.994v4.992m18-4.992v4.992M5.571 6.345a9 9 0 0112.858 0M5.571 17.655a9 9 0 0112.858 0" /></svg>;


interface TeacherSchedulerProps {
  teacherName: string;
  schedule: ScheduleItem[];
  conflicts: Conflict[];
}

const TeacherScheduler: React.FC<TeacherSchedulerProps> = ({ teacherName, schedule, conflicts }) => {
  const teacherSchedule = schedule.filter(item => item.teacher === teacherName);
  
  const handleItemClick = (item: ScheduleItem) => {
    alert(`Editing class: ${item.subject}`);
  }

  const kpis = [
      { label: "Classes This Week", value: teacherSchedule.length, icon: <ClassesIcon /> },
      { label: "Assignments Due", value: 5, icon: <AssignmentsIcon /> }, // Mock data
      { label: "Upcoming Exams", value: 2, icon: <ExamIcon /> }, // Mock data
  ];

  return (
    <div className="space-y-6">
       <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-white">Hi, {teacherName}</h1>
            <p className="text-gray-400 mt-1">Here’s your teaching dashboard.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kpis.map(kpi => (
                <DashboardCard key={kpi.label} title={kpi.label} icon={kpi.icon} variant="light">
                    <div className="mt-2 text-3xl font-semibold text-emerald-100">{kpi.value}</div>
                </DashboardCard>
            ))}
        </div>

      <DashboardCard title="My Weekly Schedule">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 -mt-4">
            <p className="text-sm text-gray-400">Click a class to view details or request changes.</p>
            <button className="px-5 py-3 bg-emerald-600 text-white rounded-3xl hover:bg-emerald-700 transition shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-800 focus:ring-emerald-500 w-full sm:w-auto">
                Request Substitute
            </button>
        </div>
        <TimetableView 
            schedule={teacherSchedule} 
            conflicts={conflicts} 
            onItemClick={handleItemClick}
        />
      </DashboardCard>
    </div>
  );
};

export default TeacherScheduler;