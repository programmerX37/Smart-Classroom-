
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardCard title="School Calendar" className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrevMonth} className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">&lt;</button>
                <h2 className="text-xl font-bold">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                <button onClick={handleNextMonth} className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">&gt;</button>
            </div>
             <div className="grid grid-cols-7 text-center font-semibold mb-2">
                <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
             </div>
             <div className="grid grid-cols-7">
                {calendarGrid.map(cell => {
                  if (cell.isPadding || !cell.day) {
                    return <div key={cell.key} className="border p-2 bg-gray-50"></div>;
                  }
                  const { day, isToday, events: dayEvents } = cell.day;
                  return (
                    <div 
                      key={cell.key} 
                      className={`border p-2 h-32 flex flex-col ${currentRole === UserRole.Admin ? 'cursor-pointer hover:bg-indigo-50' : ''} transition-colors ${isToday ? 'bg-indigo-100' : ''}`}
                      onClick={() => currentRole === UserRole.Admin && handleDayClick(day)}
                    >
                      <div className={`font-semibold ${isToday ? 'text-indigo-600' : ''}`}>{day}</div>
                      <div className="flex-grow overflow-y-auto mt-1 text-xs space-y-1 pr-1">
                        {dayEvents.map(event => (
                          <div key={event.id} className={`pl-2 pr-1 py-1 rounded ${event.type === 'Exam' ? 'bg-red-100 border-l-4 border-red-500' : 'bg-yellow-100 border-l-4 border-yellow-500'}`}>
                            <p className="font-semibold truncate text-gray-800">{event.title}</p>
                            <p className="text-gray-600">{event.time}</p>
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
                    <p className="text-4xl font-bold">{time.toLocaleTimeString()}</p>
                    <p className="text-lg text-gray-600">{time.toLocaleDateString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </DashboardCard>
             {currentRole === UserRole.Admin &&
                <DashboardCard title="Instructions">
                    <p className="text-sm">Click on any day in the calendar to schedule a new exam or event.</p>
                </DashboardCard>
             }
        </div>
      </div>
       {isModalOpen && selectedDate && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                    <h3 className="text-lg font-bold mb-4">Add Event for {selectedDate.toLocaleDateString()}</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Title</label>
                            <input type="text" value={eventTitle} onChange={e => setEventTitle(e.target.value)} className="w-full p-2 border rounded-md" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium">Time</label>
                            <input type="time" value={eventTime} onChange={e => setEventTime(e.target.value)} className="w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Type</label>
                             <select value={eventType} onChange={e => setEventType(e.target.value as any)} className="w-full p-2 border rounded-md">
                                <option value="Event">Event</option>
                                <option value="Exam">Exam</option>
                             </select>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
                        <button onClick={handleAddEvent} className="px-4 py-2 bg-indigo-600 text-white rounded-md">Add Event</button>
                    </div>
                </div>
            </div>
       )}
    </div>
  );
};

export default CalendarPage;
