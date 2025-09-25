import React from 'react';
import { ScheduleItem, Conflict, DayOfWeek } from '../../../entities/schedule';
import { TIME_SLOTS, DAYS_OF_WEEK } from '../../../shared/config';


interface TimetableViewProps {
  schedule: ScheduleItem[];
  conflicts: Conflict[];
  onCellClick?: (day: DayOfWeek, time: string) => void;
  onItemClick?: (item: ScheduleItem) => void;
  viewMode?: 'grid' | 'list';
}

// Deterministic color generation for subjects
const stringToHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

const PALETTE = [
  { bg: 'bg-emerald-950/70', border: 'border-emerald-500', text: 'text-emerald-200' },
  { bg: 'bg-sky-950/70', border: 'border-sky-500', text: 'text-sky-200' },
  { bg: 'bg-violet-950/70', border: 'border-violet-500', text: 'text-violet-200' },
  { bg: 'bg-amber-950/70', border: 'border-amber-500', text: 'text-amber-200' },
  { bg: 'bg-rose-950/70', border: 'border-rose-500', text: 'text-rose-200' },
  { bg: 'bg-cyan-950/70', border: 'border-cyan-500', text: 'text-cyan-200' },
  { bg: 'bg-fuchsia-950/70', border: 'border-fuchsia-500', text: 'text-fuchsia-200' },
];

const getSubjectColor = (subject: string) => {
  const hash = stringToHash(subject);
  const index = Math.abs(hash) % PALETTE.length;
  return PALETTE[index];
};


const ScheduleItemCard: React.FC<{ item: ScheduleItem; conflicts: Conflict[]; onClick?: (item: ScheduleItem) => void }> = ({ item, conflicts, onClick }) => {
    const itemConflicts = conflicts.filter(c => c.itemId === item.id);
    const hasConflict = itemConflicts.length > 0;
    const color = getSubjectColor(item.subject);

    const tooltipText = [
        `Subject: ${item.subject}`,
        `Teacher: ${item.teacher}`,
        `Room ID: ${item.roomId}`,
        ...(hasConflict ? ['', '--- CONFLICTS ---', ...itemConflicts.map(c => c.message)] : [])
    ].join('\n');
    
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (onClick && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault(); // Prevent space from scrolling the page
            onClick(item);
        }
    };

    return (
        <div 
            onClick={() => onClick && onClick(item)}
            onKeyDown={handleKeyDown}
            tabIndex={onClick ? 0 : -1}
            role={onClick ? 'button' : undefined}
            className={`rounded-lg p-2.5 text-xs shadow-md hover:shadow-lg backdrop-blur-sm hover:-translate-y-0.5 transition-all cursor-pointer relative border-l-4 ${color.bg} ${color.border} ${hasConflict ? 'ring-2 ring-red-500/80' : ''} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-emerald-500`}
            title={tooltipText}
        >
            <p className="font-semibold text-zinc-100 text-sm">{item.subject}</p>
            <p className="text-zinc-300 mt-0.5">{item.teacher}</p>
            {hasConflict && (
                 <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-200"></div>
                </div>
            )}
        </div>
    );
};

const GridView: React.FC<Omit<TimetableViewProps, 'viewMode'>> = ({ schedule, conflicts, onCellClick, onItemClick }) => {
    if (schedule.length === 0) {
        return (
            <div className="flex-grow flex flex-col items-center justify-center text-center text-zinc-500 p-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-xl font-semibold text-zinc-300">No Timetable Generated</h3>
                <p className="mt-2 max-w-md">The schedule is currently empty. An administrator can generate a new timetable draft from the Admin Console.</p>
            </div>
        );
    }

    return (
    <div className="bg-transparent rounded-lg overflow-auto flex-grow">
        <div className="grid grid-cols-6 min-w-[50rem]">
            {/* Header: Time */}
            <div className="text-center font-semibold p-3 border-b border-r border-white/10 text-zinc-400 sticky top-0 bg-zinc-900/50 backdrop-blur-sm z-10">Time</div>
            {/* Header: Days */}
            {DAYS_OF_WEEK.map(day => (
                <div key={day} className="text-center font-semibold p-3 border-b border-white/10 text-zinc-400 sticky top-0 bg-zinc-900/50 backdrop-blur-sm z-10">
                    <span className="hidden sm:inline">{day}</span>
                    <span className="sm:hidden">{day.slice(0,3)}</span>
                </div>
            ))}

            {/* Timetable Body */}
            {TIME_SLOTS.slice(0, -1).map((time, timeIndex) => (
                <React.Fragment key={time}>
                    {/* Time Column */}
                    <div className="text-center font-medium p-2 border-r border-white/10 text-sm text-zinc-500">{`${time} - ${TIME_SLOTS[timeIndex+1]}`}</div>
                    {/* Schedule Cells */}
                    {DAYS_OF_WEEK.map(day => {
                        const itemsInSlot = schedule.filter(item => item.day === day && item.startTime === time);
                        return (
                            <div
                                key={`${day}-${time}`}
                                className="border-b border-white/10 p-2 h-24 sm:h-28"
                                onClick={() => onCellClick && onCellClick(day, time)}
                            >
                                <div className="space-y-2">
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


const ListView: React.FC<Omit<TimetableViewProps, 'viewMode'>> = ({ schedule, onItemClick, conflicts }) => {
    const scheduleByDay = DAYS_OF_WEEK.map(day => ({
        day,
        items: schedule.filter(item => item.day === day).sort((a,b) => a.startTime.localeCompare(b.startTime)),
    }));

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 flex-grow">
            {scheduleByDay.map(({ day, items }) => (
                <div key={day} className="bg-zinc-900/40 backdrop-blur-lg border border-white/10 text-white rounded-2xl p-4 flex flex-col">
                    <div className="flex items-center justify-between flex-shrink-0">
                        <p className="font-semibold text-zinc-200">{day}</p>
                        <span className="text-xs text-zinc-400">{items.length} classes</span>
                    </div>
                    <div className="mt-3 space-y-2 flex-grow min-h-0 overflow-y-auto pr-1">
                         {items.length === 0 && <p className="text-zinc-500 text-sm py-4 text-center">No classes scheduled.</p>}
                        {items.map(item => {
                            const color = getSubjectColor(item.subject);
                            const itemConflicts = conflicts.filter(c => c.itemId === item.id);
                            const hasConflict = itemConflicts.length > 0;
                            
                            const tooltipText = [
                                `Subject: ${item.subject}`,
                                `Teacher: ${item.teacher}`,
                                `Room ID: ${item.roomId}`,
                                `Time: ${item.startTime}`,
                                ...(hasConflict ? ['', '--- CONFLICTS ---', ...itemConflicts.map(c => c.message)] : [])
                            ].join('\n');
                            
                            const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
                                if (onItemClick && (event.key === 'Enter' || event.key === ' ')) {
                                    event.preventDefault(); // Prevent space from scrolling the page
                                    onItemClick(item);
                                }
                            };

                            return (
                                <div 
                                    key={item.id} 
                                    onClick={() => onItemClick && onItemClick(item)}
                                    onKeyDown={handleKeyDown}
                                    tabIndex={onItemClick ? 0 : -1}
                                    role={onItemClick ? 'button' : undefined}
                                    className={`rounded-xl px-3 py-2 text-sm cursor-pointer hover:bg-zinc-700/50 transition-colors border-l-4 relative ${color.border} ${color.bg} ${hasConflict ? 'ring-2 ring-red-500/80' : ''} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-emerald-500`}
                                    title={tooltipText}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-zinc-200">{item.subject}</span>
                                        <span className="text-zinc-400">{item.startTime}</span>
                                    </div>
                                    <div className="text-zinc-300 text-xs mt-1">
                                        {item.teacher}
                                    </div>
                                     {hasConflict && (
                                         <div className="absolute top-1.5 right-1.5 h-3 w-3 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
                                            <div className="h-1.5 w-1.5 rounded-full bg-red-200"></div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};


const TimetableView: React.FC<TimetableViewProps> = ({ viewMode = 'grid', ...props }) => {
    // If a specific viewMode is forced to 'list', respect it. The list view is already responsive.
    if (viewMode === 'list') {
        return <ListView {...props} />;
    }

    // For the default 'grid' mode, make it responsive by showing ListView on smaller screens.
    return (
        <>
            {/* GridView for large screens (lg and up) - requires horizontal scrolling */}
            <div className="hidden lg:flex flex-grow min-h-0">
                <GridView {...props} />
            </div>

            {/* ListView for small and medium screens (up to lg) - fully responsive */}
            <div className="lg:hidden flex-grow min-h-0">
                <ListView {...props} />
            </div>
        </>
    );
};

export default React.memo(TimetableView);
