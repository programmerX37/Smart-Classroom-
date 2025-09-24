

import React from 'react';
import { CalendarEvent } from '../../../entities/event';
import { UserRole } from '../../../entities/user';
import DashboardCard from '../../../shared/ui/card';
import { useCalendar } from '../model/useCalendar';

interface CalendarPageProps {
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  currentRole: UserRole;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ events, onAddEvent, currentRole }) => {
  const {
    currentDate,
    time,
    isModalOpen,
    selectedDate,
    eventTitle, setEventTitle,
    eventTime, setEventTime,
    eventType, setEventType,
    handlePrevMonth,
    handleNextMonth,
    handleDayClick,
    handleAddEvent,
    closeModal,
    calendarGrid,
  } = useCalendar(events, onAddEvent);
  
  const formInputStyles = "block w-full rounded-3xl bg-zinc-700/50 border border-zinc-600 text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm px-4 py-3";

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardCard title="School Calendar" className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4 -mt-4">
                <button onClick={handlePrevMonth} className="px-4 py-2 bg-zinc-700 rounded-md hover:bg-zinc-600 transition-colors text-gray-200">&lt;</button>
                <h2 className="text-lg sm:text-xl font-bold text-white text-center">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                <button onClick={handleNextMonth} className="px-4 py-2 bg-zinc-700 rounded-md hover:bg-zinc-600 transition-colors text-gray-200">&gt;</button>
            </div>
             <div className="grid grid-cols-7 text-center font-semibold text-gray-400 mb-2 text-xs sm:text-base">
                {daysOfWeek.map(day => (
                    <div key={day}>
                        <span className="hidden md:inline">{day}</span>
                        <span className="md:hidden">{day.slice(0, 3)}</span>
                    </div>
                ))}
             </div>
             <div className="grid grid-cols-7 text-gray-200">
                {calendarGrid.map(cell => {
                  if (cell.isPadding || !cell.day) {
                    return <div key={cell.key} className="border border-zinc-700 p-1 sm:p-2 bg-zinc-900/50"></div>;
                  }
                  const { day, isToday, events: dayEvents } = cell.day;
                  return (
                    <div 
                      key={cell.key} 
                      className={`border border-zinc-700 p-1 sm:p-2 h-20 sm:h-24 md:h-32 flex flex-col ${currentRole === UserRole.Admin ? 'cursor-pointer hover:bg-zinc-700/50' : ''} transition-colors ${isToday ? 'bg-emerald-500/10' : ''}`}
                      onClick={() => currentRole === UserRole.Admin && handleDayClick(day)}
                    >
                      <div className={`text-sm sm:text-base font-semibold ${isToday ? 'text-emerald-300' : ''}`}>{day}</div>
                      <div className="flex-grow overflow-y-auto mt-1 text-xs space-y-1 pr-1">
                        {dayEvents.map(event => (
                          <div key={event.id} className={`pl-1 pr-1 py-1 rounded ${event.type === 'Exam' ? 'bg-red-900/50 border-l-2 sm:border-l-4 border-red-500' : 'bg-yellow-900/50 border-l-2 sm:border-l-4 border-yellow-500'}`}>
                            <p className="font-semibold truncate text-gray-100 text-[10px] sm:text-xs">{event.title}</p>
                            <p className="text-gray-400 text-[10px] sm:text-xs">{event.time}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
             </div>
        </DashboardCard>
        <div className="space-y-6">
            <DashboardCard title="Current Time">
                <div className="text-center">
                    <p className="text-4xl font-bold text-white">{time.toLocaleTimeString()}</p>
                    <p className="text-lg text-gray-400">{time.toLocaleDateString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </DashboardCard>
             {currentRole === UserRole.Admin &&
                <DashboardCard title="Instructions">
                    <p className="text-sm text-gray-400">Click on any day in the calendar to schedule a new exam or event.</p>
                </DashboardCard>
             }
        </div>
      </div>
       {isModalOpen && selectedDate && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
                <div className="bg-zinc-800/80 backdrop-blur-md p-6 rounded-3xl shadow-xl w-full max-w-md border border-zinc-700">
                    <h3 className="text-lg font-bold text-white mb-4">Add Event for {selectedDate.toLocaleDateString()}</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                            <input type="text" value={eventTitle} onChange={e => setEventTitle(e.target.value)} className={formInputStyles} />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Time</label>
                            <input type="time" value={eventTime} onChange={e => setEventTime(e.target.value)} className={formInputStyles} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                             <select value={eventType} onChange={e => setEventType(e.target.value as any)} className={`${formInputStyles} appearance-none`}>
                                <option value="Event">Event</option>
                                <option value="Exam">Exam</option>
                             </select>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button onClick={closeModal} className="px-5 py-3 bg-zinc-600 hover:bg-zinc-500 rounded-3xl text-white font-medium">Cancel</button>
                        <button onClick={handleAddEvent} className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-3xl font-medium">Add Event</button>
                    </div>
                </div>
            </div>
       )}
    </div>
  );
};

export default React.memo(CalendarPage);