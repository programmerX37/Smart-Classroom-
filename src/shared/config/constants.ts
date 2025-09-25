import { ScheduleItem, DayOfWeek } from '../../entities/schedule';
import { Resource } from '../../entities/resource';
import { AppEntry } from '../../entities/app-entry';
import { Department } from '../../entities/staff';

export const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

export const DAYS_OF_WEEK: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// --- MOCK DEPARTMENTS & STAFF ---
export const MOCK_DEPARTMENTS: Department[] = [
    {
        id: 'dept_sci',
        name: 'Science',
        teachingStaff: [
            { id: 't_reed', name: 'Dr. Evelyn Reed' },
            { id: 't_chen', name: 'Mr. David Chen' },
        ],
        nonTeachingStaff: [{ id: 'nt_adams', name: 'Ms. Ada Adams' }],
    },
    {
        id: 'dept_hum',
        name: 'Humanities',
        teachingStaff: [
            { id: 't_carter', name: 'Mr. Samuel Carter' },
            { id: 't_vega', name: 'Ms. Maria Vega' },
        ],
        nonTeachingStaff: [],
    },
];

// --- MOCK RESOURCES ---
export const MOCK_RESOURCES: Resource[] = [
    // Rooms
    { id: 'room_101', name: 'Room 101', type: 'Room', capacity: 30 },
    { id: 'room_102', name: 'Room 102', type: 'Room', capacity: 30 },
    { id: 'sci_lab', name: 'Science Lab', type: 'Room', capacity: 25 },
    { id: 'art_studio', name: 'Art Studio', type: 'Room', capacity: 20 },
    // Student Groups
    { id: 'grp_9a', name: 'Grade 9A', type: 'StudentGroup' },
    { id: 'grp_10b', name: 'Grade 10B', type: 'StudentGroup' },
];

// --- MOCK SCHEDULE (WITH INTENTIONAL CONFLICTS) ---
export const MOCK_SCHEDULE: ScheduleItem[] = [
    // Monday
    { id: 'm1', subject: 'Chemistry', teacher: 'Dr. Evelyn Reed', studentGroup: 'Grade 9A', roomId: 'sci_lab', day: 'Monday', startTime: '09:00', endTime: '10:00', color: '' },
    { id: 'm2', subject: 'World History', teacher: 'Mr. Samuel Carter', studentGroup: 'Grade 10B', roomId: 'room_101', day: 'Monday', startTime: '09:00', endTime: '10:00', color: '' },
    // CONFLICT: Teacher (Reed) and Group (9A) double-booked at 10:00
    { id: 'm3', subject: 'Physics', teacher: 'Dr. Evelyn Reed', studentGroup: 'Grade 9A', roomId: 'sci_lab', day: 'Monday', startTime: '10:00', endTime: '11:00', color: '' },
    { id: 'm4', subject: 'English Lit.', teacher: 'Ms. Maria Vega', studentGroup: 'Grade 9A', roomId: 'room_102', day: 'Monday', startTime: '10:00', endTime: '11:00', color: '' },
    // CONFLICT: Room (101) double-booked at 11:00
    { id: 'm5', subject: 'Calculus', teacher: 'Mr. David Chen', studentGroup: 'Grade 10B', roomId: 'room_101', day: 'Monday', startTime: '11:00', endTime: '12:00', color: '' },
    { id: 'm6', subject: 'Art History', teacher: 'Ms. Maria Vega', studentGroup: 'Grade 9A', roomId: 'room_101', day: 'Monday', startTime: '11:00', endTime: '12:00', color: '' },

    // Tuesday
    { id: 't1', subject: 'World History', teacher: 'Mr. Samuel Carter', studentGroup: 'Grade 9A', roomId: 'room_101', day: 'Tuesday', startTime: '10:00', endTime: '11:00', color: '' },
    { id: 't2', subject: 'Physics', teacher: 'Dr. Evelyn Reed', studentGroup: 'Grade 10B', roomId: 'sci_lab', day: 'Tuesday', startTime: '11:00', endTime: '12:00', color: '' },
    
    // Wednesday
    { id: 'w1', subject: 'Chemistry', teacher: 'Dr. Evelyn Reed', studentGroup: 'Grade 10B', roomId: 'sci_lab', day: 'Wednesday', startTime: '09:00', endTime: '10:00', color: '' },
    { id: 'w2', subject: 'English Lit.', teacher: 'Ms. Maria Vega', studentGroup: 'Grade 9A', roomId: 'room_102', day: 'Wednesday', startTime: '14:00', endTime: '15:00', color: '' },

    // Thursday
    { id: 'th1', subject: 'Calculus', teacher: 'Mr. David Chen', studentGroup: 'Grade 9A', roomId: 'room_102', day: 'Thursday', startTime: '13:00', endTime: '14:00', color: '' },
    
    // Friday
    { id: 'f1', subject: 'Art History', teacher: 'Ms. Maria Vega', studentGroup: 'Grade 10B', roomId: 'art_studio', day: 'Friday', startTime: '10:00', endTime: '11:00', color: '' },
];


export const MOCK_SUBJECTS = ['Algebra II', 'World History', 'Chemistry', 'Physical Ed.', 'English Lit.', 'Physics', 'Calculus', 'Art History'];


export const MOCK_APP_ENTRIES: AppEntry[] = [
    { id: 'n1', type: 'alert', message: 'Room change for Algebra II to Room 105.', read: false, createdAt: new Date(), },
    { id: 'n2', type: 'alert', message: 'Chemistry class on Monday is cancelled.', read: false, createdAt: new Date(Date.now() - 3600 * 1000), },
    { id: 'n3', type: 'alert', message: 'Parent-teacher meetings scheduled for next Friday.', read: true, createdAt: new Date(Date.now() - 86400 * 1000 * 2), },
    { id: 't1', type: 'task', message: 'New Task Assigned: "Grade Mid-term Exams". Description: Complete grading for Section A and B.', createdAt: new Date('2024-09-01'), read: false },
    { id: 't2', type: 'task', message: 'New Task Assigned: "Prepare Unit 5 Lesson Plan". Description: Create lesson plan for the upcoming unit on Thermodynamics.', createdAt: new Date('2024-08-28'), read: true },
    { id: 'n4', type: 'news', message: '[VTU News] Re-evaluation results for 1st sem announced.', read: false, createdAt: new Date(Date.now() - 3600 * 1000 * 5) }
];