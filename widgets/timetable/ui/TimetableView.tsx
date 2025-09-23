import React from 'react';
import { ScheduleItem, Conflict, DayOfWeek } from '../../../entities/schedule';
import { TIME_SLOTS, DAYS_OF_WEEK } from '../../../shared/config';


interface TimetableViewProps {
  schedule: ScheduleItem[];
  conflicts: Conflict[];
  onCellClick?: (day: DayOfWeek, time: string) => void;
  onItemClick?: (item: ScheduleItem) => void;
}

const ScheduleItemCard: React.FC<{ item: ScheduleItem; conflicts: Conflict[]; onClick?: (item: ScheduleItem) => void }> = ({ item, conflicts, onClick }) => {
    const itemConflicts = conflicts.filter(c => c.itemId === item.id);
    const hasConflict = itemConflicts.length > 0;

    return (
        <div 
            onClick={() => onClick && onClick(item)}
            className={`rounded-lg p-2 text-xs text-gray-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative ${item.color} ${hasConflict ? 'ring-2 ring-red-500 ring-offset-1' : ''}`}
            title={itemConflicts.map(c => c.message).join('\n')}
        >
            <p className="font-semibold">{item.subject}</p>
            <p className="text-gray-600">{item.teacher}</p>
            <p className="text-gray-500">{item.roomId}</p>
            {hasConflict && (
                <div className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full" />
            )}
        </div>
    );
};


const TimetableView: React.FC<TimetableViewProps> = ({ schedule, conflicts, onCellClick, onItemClick }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
        <div className="grid grid-cols-6 min-w-max">
            {/* Header: Time */}
            <div className="text-center font-semibold p-2 border-b border-r">Time</div>
            {/* Header: Days */}
            {DAYS_OF_WEEK.map(day => (
                <div key={day} className="text-center font-semibold p-2 border-b">{day}</div>
            ))}

            {/* Timetable Body */}
            {TIME_SLOTS.slice(0, -1).map((time, timeIndex) => (
                <React.Fragment key={time}>
                    {/* Time Column */}
                    <div className="text-center font-medium p-2 border-r text-sm text-gray-600">{`${time} - ${TIME_SLOTS[timeIndex+1]}`}</div>
                    {/* Schedule Cells */}
                    {DAYS_OF_WEEK.map(day => {
                        const itemsInSlot = schedule.filter(item => item.day === day && item.startTime === time);
                        return (
                            <div
                                key={`${day}-${time}`}
                                className="border-b p-1 h-24"
                                onClick={() => onCellClick && onCellClick(day, time)}
                            >
                                <div className="space-y-1">
                                    {itemsInSlot.map(item => (
                                        <ScheduleItemCard 
                                            key={item.id} 
                                            item={item} 
                                            conflicts={conflicts} 
                                            onClick={onItemClick}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </React.Fragment>
            ))}
        </div>
    </div>
  );
};

export default TimetableView;