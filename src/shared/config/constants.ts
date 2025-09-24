import { ScheduleItem, DayOfWeek } from '../../entities/schedule';
import { Resource } from '../../entities/resource';
import { AppEntry } from '../../entities/app-entry';


export const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

export const DAYS_OF_WEEK: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const MOCK_SCHEDULE: ScheduleItem[] = [];

export const MOCK_RESOURCES: Resource[] = [];

export const MOCK_TEACHERS: string[] = [];
export const MOCK_SUBJECTS = ['Algebra II', 'World History', 'Chemistry', 'Physical Ed.', 'English Lit.', 'Physics', 'Calculus', 'Art History'];


export const MOCK_APP_ENTRIES: AppEntry[] = [
    { id: 'n1', type: 'alert', message: 'Room change for Algebra II to Room 105.', read: false, createdAt: new Date(), },
    { id: 'n2', type: 'alert', message: 'Chemistry class on Monday is cancelled.', read: false, createdAt: new Date(Date.now() - 3600 * 1000), },
    { id: 'n3', type: 'alert', message: 'Parent-teacher meetings scheduled for next Friday.', read: true, createdAt: new Date(Date.now() - 86400 * 1000 * 2), },
    { id: 't1', type: 'task', message: 'New Task Assigned: "Grade Mid-term Exams". Description: Complete grading for Section A and B.', createdAt: new Date('2024-09-01'), read: false },
    { id: 't2', type: 'task', message: 'New Task Assigned: "Prepare Unit 5 Lesson Plan". Description: Create lesson plan for the upcoming unit on Thermodynamics.', createdAt: new Date('2024-08-28'), read: true },
    { id: 'n4', type: 'news', message: '[VTU News] Re-evaluation results for 1st sem announced.', read: false, createdAt: new Date(Date.now() - 3600 * 1000 * 5) }
];