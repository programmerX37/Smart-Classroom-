import React, { useState } from 'react';
import DashboardCard from '../../../shared/ui/card';

interface TeacherLoginPageProps {
  teachers: string[];
  onLogin: (teacherName: string) => void;
}

const TeacherLoginPage: React.FC<TeacherLoginPageProps> = ({ teachers, onLogin }) => {
    const [selectedTeacher, setSelectedTeacher] = useState('');

    const handleLogin = () => {
        if (selectedTeacher) {
            onLogin(selectedTeacher);
        }
    };
    
    const formInputStyles = "block w-full rounded-full bg-zinc-900/50 border border-white/10 text-white shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 sm:text-sm px-4 py-3";

    return (
        <div className="flex justify-center items-center h-full">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                     <h1 className="text-4xl font-bold text-white">Teacher Portal</h1>
                     <p className="text-zinc-400 mt-2">Please select your profile to continue.</p>
                </div>
                <DashboardCard title="Select Profile">
                    <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-6 mt-4">
                        <div>
                            <label htmlFor="teacher-select" className="sr-only">
                                Select Your Profile
                            </label>
                            <div className="relative">
                                <select
                                    id="teacher-select"
                                    value={selectedTeacher}
                                    onChange={(e) => setSelectedTeacher(e.target.value)}
                                    className={`${formInputStyles} appearance-none pr-10 cursor-pointer`}
                                >
                                    <option value="" disabled>-- Please choose a teacher --</option>
                                    {teachers.map(teacher => (
                                        <option key={teacher} value={teacher}>{teacher}</option>
                                    ))}
                                </select>
                                 <svg
                                  className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 pointer-events-none"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
                         {teachers.length === 0 && <p className="text-center text-sm text-zinc-400">No teachers found. Please have an administrator add teachers in the Admin Console.</p>}
                        <button
                            type="submit"
                            disabled={!selectedTeacher}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-lg shadow-emerald-600/20 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800/50 disabled:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-800 focus:ring-emerald-500 transition-colors"
                        >
                            View My Schedule
                        </button>
                    </form>
                </DashboardCard>
            </div>
        </div>
    );
};

export default React.memo(TeacherLoginPage);