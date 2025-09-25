import { useState, useEffect, useCallback } from 'react';
import { UserRole } from '../entities/user';
import { MOCK_SCHEDULE, MOCK_RESOURCES, MOCK_APP_ENTRIES, MOCK_DEPARTMENTS } from '../shared/config';
import { Department } from '../entities/staff';
import { Resource } from '../entities/resource';
import { CalendarEvent } from '../entities/event';
import { useTimetable } from '../features/schedule-management';
import { AppEntry } from '../entities/app-entry';

export type View = 'home' | 'dashboard' | 'calendar' | 'notifications' | 'camera';

// Helper to load state from localStorage, with a default value
const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
    try {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            return JSON.parse(storedValue) as T;
        }
    } catch (error) {
        console.error(`Error loading ${key} from localStorage, using default.`, error);
    }
    return defaultValue;
};

// Specific loader for app entries to handle Date objects
const loadAppEntriesFromLocalStorage = (): AppEntry[] => {
    try {
        const storedValue = localStorage.getItem('smartScheduler_appEntries');
        if (storedValue) {
            const parsed = JSON.parse(storedValue) as any[];
            return parsed.map(n => ({ ...n, createdAt: new Date(n.createdAt) }));
        }
    } catch (error) {
        console.error(`Error loading appEntries from localStorage, using default.`, error);
    }
    return MOCK_APP_ENTRIES;
};


export const useApp = () => {
    const [currentRole, setCurrentRole] = useState<UserRole>(() => 
        loadFromLocalStorage('smartScheduler_currentRole', UserRole.Student)
    );
    const [appEntries, setAppEntries] = useState<AppEntry[]>(loadAppEntriesFromLocalStorage);
    const [currentView, setCurrentView] = useState<View>('home');
    const [currentTeacher, setCurrentTeacher] = useState<string | null>(() => 
        loadFromLocalStorage('smartScheduler_currentTeacher', null)
    );
    const [currentStudent, setCurrentStudent] = useState<string | null>(() =>
        loadFromLocalStorage('smartScheduler_currentStudent', null)
    );
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => loadFromLocalStorage('smartScheduler_isAdminLoggedIn', false));
    
    const [departments, setDepartments] = useState<Department[]>(() =>
        loadFromLocalStorage('smartScheduler_departments', MOCK_DEPARTMENTS)
    );
    const [events, setEvents] = useState<CalendarEvent[]>(() =>
        loadFromLocalStorage('smartScheduler_events', [])
    );
    const [resources, setResources] = useState<Resource[]>(() =>
        loadFromLocalStorage('smartScheduler_resources', MOCK_RESOURCES)
    );
    
    const initialSchedule = loadFromLocalStorage('smartScheduler_schedule', MOCK_SCHEDULE);
    const { schedule, conflicts, updateSchedule } = useTimetable(initialSchedule, resources);

    // --- PERSISTENCE ---
    useEffect(() => {
        localStorage.setItem('smartScheduler_currentRole', JSON.stringify(currentRole));
    }, [currentRole]);
    
    useEffect(() => {
        localStorage.setItem('smartScheduler_currentTeacher', JSON.stringify(currentTeacher));
    }, [currentTeacher]);
    
    useEffect(() => {
        localStorage.setItem('smartScheduler_currentStudent', JSON.stringify(currentStudent));
    }, [currentStudent]);

    useEffect(() => {
        localStorage.setItem('smartScheduler_isAdminLoggedIn', JSON.stringify(isAdminLoggedIn));
    }, [isAdminLoggedIn]);

    useEffect(() => {
        localStorage.setItem('smartScheduler_departments', JSON.stringify(departments));
    }, [departments]);
    
    useEffect(() => {
        localStorage.setItem('smartScheduler_events', JSON.stringify(events));
    }, [events]);

    useEffect(() => {
        localStorage.setItem('smartScheduler_resources', JSON.stringify(resources));
    }, [resources]);

    useEffect(() => {
        localStorage.setItem('smartScheduler_schedule', JSON.stringify(schedule));
    }, [schedule]);

    useEffect(() => {
        // Store timestamps as ISO strings for reliable parsing
        localStorage.setItem('smartScheduler_appEntries', JSON.stringify(appEntries.map(n => ({...n, createdAt: n.createdAt.toISOString()}))));
    }, [appEntries]);


    const handleAddEvent = useCallback((newEvent: Omit<CalendarEvent, 'id'>) => {
        setEvents(prev => [...prev, { ...newEvent, id: new Date().toISOString() }]);
    }, []);
    
    const handleCreateEntry = useCallback((entry: Omit<AppEntry, 'id' | 'createdAt'>) => {
        const newEntry: AppEntry = {
            ...entry,
            id: crypto.randomUUID(),
            createdAt: new Date(),
        };
        setAppEntries(prev => [newEntry, ...prev]);
    }, []);

    const handleAdminLoginSuccess = useCallback(() => {
        setIsAdminLoggedIn(true);
    }, []);

    const handleNavigateToCalendar = useCallback(() => {
        setCurrentView('calendar');
    }, []);
    
    const handleNavigateToDashboard = useCallback(() => {
        setCurrentView('dashboard');
    }, []);
    
    const handleNavigateToNotifications = useCallback(() => {
        setCurrentView('notifications');
    }, []);

    const handleNavigateToCamera = useCallback(() => {
        setCurrentView('camera');
    }, []);

    const handleMarkEntryAsRead = useCallback((id: string) => {
        setAppEntries(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }, []);

    const handleMarkAllEntriesAsRead = useCallback(() => {
        setAppEntries(prev => prev.map(n => n.read ? n : { ...n, read: true }));
    }, []);

    const handleSetCurrentRole = useCallback((role: UserRole) => {
        if (role !== UserRole.Teacher) setCurrentTeacher(null);
        if (role !== UserRole.Student) setCurrentStudent(null);

        if (currentView === 'calendar' || currentView === 'notifications' || currentView === 'camera') {
            setCurrentView('dashboard');
        }
        setCurrentRole(role);
    }, [currentView]);

    const handleRoleSelect = useCallback((role: UserRole) => {
        setCurrentRole(role);
        setCurrentView('dashboard');
        if (role !== UserRole.Teacher) setCurrentTeacher(null);
        if (role !== UserRole.Student) setCurrentStudent(null);
    }, []);

    return {
        currentRole,
        appEntries,
        currentView,
        currentTeacher,
        currentStudent,
        departments,
        events,
        schedule,
        conflicts,
        resources,
        isAdminLoggedIn,
        setResources,
        setCurrentTeacher,
        setCurrentStudent,
        setDepartments,
        updateSchedule,
        handleAddEvent,
        handleAdminLoginSuccess,
        handleNavigateToCalendar,
        handleNavigateToDashboard,
        handleNavigateToNotifications,
        handleNavigateToCamera,
        handleSetCurrentRole,
        handleRoleSelect,
        handleMarkEntryAsRead,
        handleMarkAllEntriesAsRead,
        handleCreateEntry,
    };
};