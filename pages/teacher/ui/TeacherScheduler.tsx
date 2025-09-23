import React from 'react';
import TimetableView from '../../../widgets/timetable';
import { ScheduleItem, Conflict } from '../../../entities/schedule';
import { DayOfWeek } from '../../../entities/schedule';

interface TeacherSchedulerProps {
  teacherName: string;
  schedule: ScheduleItem[];
  conflicts: Conflict[];
}

const TeacherScheduler: React.FC<TeacherSchedulerProps> = ({ teacherName, schedule, conflicts }) => {

  const handleCellClick = (day: DayOfWeek, time: string) => {
    // In a real app, this would open a modal to create a new class.
    alert(`Create a new class for ${teacherName} on ${day} at ${time}?`);
  };

  const handleItemClick = (item: ScheduleItem) => {
    alert(`Editing class: ${item.subject}`);
  }

  const teacherSchedule = schedule.filter(item => item.teacher === teacherName);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>
                <p className="text-gray-600">Viewing schedule for <span className="font-semibold">{teacherName}</span>. Click an empty slot to create a new lesson.</p>
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition shadow-sm">
                Request Substitute
            </button>
        </div>
        <TimetableView 
            schedule={teacherSchedule} 
            conflicts={conflicts} 
            onCellClick={handleCellClick}
            onItemClick={handleItemClick}
        />
      </div>
    </div>
  );
};

export default TeacherScheduler;