
import { useState, useMemo } from 'react';
import { MOCK_STUDENT_GROUPS } from '../../../shared/config';
import { ScheduleItem } from '../../../entities/schedule';

export const useStudentDashboard = (schedule: ScheduleItem[]) => {
    const [selectedGroup, setSelectedGroup] = useState<string>(MOCK_STUDENT_GROUPS[0] || '');

    const today = useMemo(() => new Date().toLocaleDateString('en-US', { weekday: 'long' }), []);

    const todaysClasses = useMemo(() => schedule
        .filter(item => item.day === today && item.studentGroup === selectedGroup)
        .sort((a,b) => a.startTime.localeCompare(b.startTime)), [schedule, today, selectedGroup]);
        
    const groupSchedule = useMemo(() => schedule.filter(i => i.studentGroup === selectedGroup), [schedule, selectedGroup]);

    return {
        selectedGroup,
        setSelectedGroup,
        todaysClasses,
        groupSchedule,
    };
};
