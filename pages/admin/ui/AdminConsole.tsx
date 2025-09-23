
import React, { useState } from 'react';
import TimetableView from '../../../widgets/timetable';
import { MOCK_STUDENT_GROUPS } from '../../../shared/config';
import DashboardCard from '../../../shared/ui/card';
import { ScheduleItem, Conflict } from '../../../entities/schedule';
import { Resource } from '../../../entities/resource';
import { Department } from '../../../entities/staff';
import { useAdminConsole } from '../model/useAdminConsole';
import { Notification } from '../../../entities/notification';


const GeneratorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 16v-2m8-8h2M4 12H2m15.364 6.364l1.414 1.414M4.222 4.222l1.414 1.414M18.364 4.222l-1.414 1.414M5.636 18.364l-1.414 1.414M12 16a4 4 0 110-8 4 4 0 010 8z" /></svg>;
const AttendanceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;
const ManageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 013 5.197M15 21a6 6 0 00-9-5.197" /></svg>;
const AiIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const NotificationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;


interface AdminConsoleProps {
  departments: Department[];
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>;
  schedule: ScheduleItem[];
  conflicts: Conflict[];
  updateSchedule: (newSchedule: ScheduleItem[]) => void;
  resources: Resource[];
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
  onCreateNotification: (message: string, type: Notification['type']) => void;
}

const ConflictResolutionModal: React.FC<{item: ScheduleItem, conflicts: Conflict[], onClose: () => void}> = ({ item, conflicts, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg transform transition-all">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h3 className="text-xl font-bold text-red-700">Resolve Conflict</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-800 text-2xl font-bold">&times;</button>
                </div>
                <div className="mb-4">
                    <p className="font-semibold text-gray-800">Class: <span className="font-normal">{item.subject} for {item.studentGroup}</span></p>
                    <p className="font-semibold text-gray-800">Time: <span className="font-normal">{item.day} at {item.startTime}</span></p>
                </div>
                <div className="space-y-3">
                    {conflicts.map((conflict, index) => (
                        <div key={index} className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <p className="font-semibold text-red-800">{conflict.message}</p>
                            {conflict.suggestions && conflict.suggestions.length > 0 && (
                                <div className="mt-2">
                                    <p className="text-sm font-medium text-gray-700">Suggestions:</p>
                                    <ul className="list-disc pl-5 text-sm text-gray-600 mt-1 space-y-1">
                                        {conflict.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="mt-6 flex justify-end">
                    <button onClick={onClose} className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">Close</button>
                </div>
            </div>
        </div>
    );
};


const AdminConsole: React.FC<AdminConsoleProps> = ({ departments, setDepartments, schedule, conflicts, updateSchedule, resources, setResources, onCreateNotification }) => {
    const {
        constraints, setConstraints,
        isLoading,
        error,
        isListening,
        selectedGroup, setSelectedGroup,
        adminCommand, setAdminCommand,
        isAiProcessing,
        aiError, setAiError,
        handleGenerate,
        handleAdminCommand,
        toggleListening,
    } = useAdminConsole({
        initialDepartments: departments,
        onDepartmentsChange: setDepartments,
        onScheduleUpdate: updateSchedule,
        resources: resources,
        onResourcesChange: setResources,
    });
    
    const [conflictingItem, setConflictingItem] = useState<ScheduleItem | null>(null);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState<Notification['type']>('Info');

    const handleItemClick = (item: ScheduleItem) => {
        const itemConflicts = conflicts.filter(c => c.itemId === item.id);
        if (itemConflicts.length > 0) {
            setConflictingItem(item);
        }
    };
    
    const handleSendNotification = () => {
        if (!notificationMessage.trim()) return;
        onCreateNotification(notificationMessage, notificationType);
        setNotificationMessage('');
        setNotificationType('Info');
    };

    const filteredSchedule = selectedGroup === 'All Groups'
        ? schedule
        : schedule.filter(item => item.studentGroup === selectedGroup);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <DashboardCard title="Attendance Status" icon={<AttendanceIcon />}>
                    <div className="space-y-4">
                        <div>
                            <p className="font-semibold text-gray-700">Students</p>
                            <div className="flex justify-between items-center text-sm"><span>Present: <span className="font-bold text-green-600">480</span></span><span>Absent: <span className="font-bold text-red-600">15</span></span></div>
                        </div>
                        <hr/>
                        <div>
                            <p className="font-semibold text-gray-700">Teachers</p>
                            <div className="flex justify-between items-center text-sm"><span>Present: <span className="font-bold text-green-600">35</span></span><span>Absent: <span className="font-bold text-red-600">2</span></span></div>
                        </div>
                        <hr/>
                        <div>
                           <p className="font-semibold text-gray-700">Non-Teaching Staff</p>
                            <div className="flex justify-between items-center text-sm"><span>Present: <span className="font-bold text-green-600">22</span></span><span>Absent: <span className="font-bold text-red-600">1</span></span></div>
                        </div>
                    </div>
                </DashboardCard>
                <DashboardCard title="AI Command Center" icon={<AiIcon />} className="lg:col-span-2">
                    <div className="space-y-3">
                        <p className="text-sm text-gray-600">
                            Use natural language to manage the school. The AI will parse your command and perform the required actions, including updating timetable constraints.
                        </p>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={adminCommand}
                                onChange={e => setAdminCommand(e.target.value)}
                                placeholder="e.g., Create 'AIML' dept with teacher 'Prinkya'..."
                                className="flex-grow p-2 border rounded-md"
                                disabled={isAiProcessing}
                                onKeyDown={(e) => e.key === 'Enter' && handleAdminCommand()}
                            />
                            <button 
                                onClick={handleAdminCommand} 
                                disabled={isAiProcessing || !adminCommand.trim()} 
                                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition"
                            >
                                {isAiProcessing ? 'Processing...' : 'Execute'}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">
                            <b>Examples:</b> "Add room 607.", "Create Science department.", "Add Prakash to AIML as teaching staff.", "Set class duration to 50 minutes."
                        </p>
                    </div>
                </DashboardCard>
            </div>

            <DashboardCard title="Create Notification" icon={<NotificationIcon />}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="notification-message" className="block text-sm font-medium text-gray-700">
                            Notification Message
                        </label>
                        <textarea
                            id="notification-message"
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="e.g., The school will be closed on Monday for a public holiday."
                            value={notificationMessage}
                            onChange={(e) => setNotificationMessage(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex-grow">
                             <label htmlFor="notification-type" className="block text-sm font-medium text-gray-700">
                                Alert Level
                            </label>
                            <select
                                id="notification-type"
                                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                value={notificationType}
                                onChange={(e) => setNotificationType(e.target.value as Notification['type'])}
                            >
                                <option>Info</option>
                                <option>Warning</option>
                                <option>Urgent</option>
                            </select>
                        </div>
                        <div className="self-end">
                            <button
                                onClick={handleSendNotification}
                                disabled={!notificationMessage.trim()}
                                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300 transition-colors"
                            >
                                Send Notification
                            </button>
                        </div>
                    </div>
                </div>
            </DashboardCard>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <DashboardCard title="Timetable Generator" icon={<GeneratorIcon />}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Constraints & Preferences</label>
                            <p className="text-xs text-gray-500 mb-1">Use the AI Command Center to add rules here.</p>
                            <textarea
                                value={constraints}
                                onChange={(e) => setConstraints(e.target.value)}
                                rows={8}
                                className="w-full p-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="e.g., Physics requires Lab A."
                            />
                        </div>
                        {error && <p className="text-sm text-red-600 bg-red-100 p-2 rounded-md">{error}</p>}
                        <div className="flex space-x-2">
                            <button
                                onClick={handleGenerate}
                                disabled={isLoading}
                                className="w-full flex-grow justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {isLoading ? 'Generating...' : 'Generate Draft'}
                            </button>
                             <button
                                onClick={toggleListening}
                                className={`p-2 rounded-md ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-700'}`}
                                aria-label="Toggle voice input"
                            >
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-14 0m7 10v-2m0 0a3 3 0 00-3-3H9m6 0a3 3 0 00-3 3h0" /></svg>
                             </button>
                        </div>
                    </div>
                </DashboardCard>

                <DashboardCard title="School Resources" icon={<ManageIcon />} className="lg:col-span-2">
                    <div className="space-y-4 max-h-[26rem] overflow-y-auto pr-2">
                        <div>
                            <h4 className="font-bold text-lg mb-2">Departments & Staff</h4>
                            {departments.length === 0 && <p className="text-sm text-gray-500">No departments created yet.</p>}
                            {departments.map(dept => (
                                <details key={dept.id} className="p-3 bg-gray-100 rounded-lg mb-2" open>
                                    <summary className="font-semibold cursor-pointer list-none flex justify-between">
                                        <span>{dept.name}</span>
                                        <span className="text-gray-500 text-sm">
                                            {dept.teachingStaff.length} T, {dept.nonTeachingStaff.length} NT
                                        </span>
                                    </summary>
                                    <div className="mt-2 pl-4 text-sm">
                                        <p className="font-semibold">Teaching:</p>
                                        <ul className="list-disc pl-5">
                                            {dept.teachingStaff.map(s => <li key={s.id}>{s.name}</li>)}
                                            {dept.teachingStaff.length === 0 && <li className="text-gray-400 italic">None</li>}
                                        </ul>
                                        <p className="font-semibold mt-1">Non-Teaching:</p>
                                        <ul className="list-disc pl-5">
                                            {dept.nonTeachingStaff.map(s => <li key={s.id}>{s.name}</li>)}
                                            {dept.nonTeachingStaff.length === 0 && <li className="text-gray-400 italic">None</li>}
                                        </ul>
                                    </div>
                                </details>
                            ))}
                        </div>
                        <div className="border-t pt-4">
                            <h4 className="font-bold text-lg mb-2">Rooms</h4>
                            {resources.filter(r => r.type === 'Room').length === 0 && <p className="text-sm text-gray-500">No rooms created yet.</p>}
                            <ul className="list-disc pl-5 text-sm columns-2">
                                {resources.filter(r => r.type === 'Room').map(res => <li key={res.id}>{res.name}</li>)}
                            </ul>
                        </div>
                    </div>
                </DashboardCard>
            </div>
            
            {(aiError) && 
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">AI Assistant Error: </strong>
                    <span className="block sm:inline">{aiError}</span>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setAiError(null)}>
                        <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                    </span>
                </div>
            }

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">
                        Generated Timetable Draft {selectedGroup !== 'All Groups' && `for ${selectedGroup}`}
                    </h2>
                     <div>
                        <label htmlFor="admin-group-select" className="sr-only">Select Class</label>
                        <select
                            id="admin-group-select"
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm leading-5 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                        >
                            <option value="All Groups">All Groups</option>
                            {MOCK_STUDENT_GROUPS.map(group => (
                                <option key={group} value={group}>{group}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <TimetableView 
                    schedule={filteredSchedule} 
                    conflicts={conflicts}
                    onItemClick={handleItemClick} 
                />
            </div>
            {conflictingItem && (
                <ConflictResolutionModal
                    item={conflictingItem}
                    conflicts={conflicts.filter(c => c.itemId === conflictingItem.id)}
                    onClose={() => setConflictingItem(null)}
                />
            )}
        </div>
    );
};

export default AdminConsole;
