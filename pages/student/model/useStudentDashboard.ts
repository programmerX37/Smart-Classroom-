

import { useMemo } from 'react';
import { ScheduleItem } from '../../../entities/schedule';

export const useStudentDashboard = (schedule: ScheduleItem[], studentGroup: string) => {

    const today = useMemo(() => new Date().toLocaleDateString('en-US', { weekday: 'long' }), []);

    const todaysClasses = useMemo(() => schedule
        .filter(item => item.day === today && item.studentGroup === studentGroup)
        .sort((a,b) => a.startTime.localeCompare(b.startTime)), [schedule, today, studentGroup]);
        
    const groupSchedule = useMemo(() => schedule.filter(i => i.studentGroup === studentGroup), [schedule, studentGroup]);

    return {
        todaysClasses,
        groupSchedule,
    };
};
