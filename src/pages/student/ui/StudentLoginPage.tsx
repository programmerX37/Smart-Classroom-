import React, { useState } from 'react';
import DashboardCard from '../../../shared/ui/card';

interface StudentLoginPageProps {
  studentGroups: string[];
  onLogin: (groupName: string) => void;
}

const StudentLoginPage: React.FC<StudentLoginPageProps> = ({ studentGroups, onLogin }) => {
    const [selectedGroup, setSelectedGroup] = useState('');

    const handleLogin = () => {
        if (selectedGroup) {
            onLogin(selectedGroup);
        }
    };
    
    const formInputStyles = "block w-full rounded-full bg-zinc-900/50 border border-white/10 text-white shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 sm:text-sm px-4 py-3";

    return (
        <div className="flex justify-center items-center h-full">
            <div className="w-full max-w-md">
                 <div className="text-center mb-8">
                     <h1 className="text-4xl font-bold text-white">Student Portal</h1>
                     <p className="text-zinc-400 mt-2">Select your group to view your dashboard.</p>
                </div>
                <DashboardCard title="Select Your Group">
                    <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-6 mt-4">
                        <div>
                            <label htmlFor="group-select" className="sr-only">
                                Select Your Class/Group
                            </label>
                            <div className="relative">
                                <select
                                    id="group-select"
                                    value={selectedGroup}
                                    onChange={(e) => setSelectedGroup(e.target.value)}
                                    className={`${formInputStyles} appearance-none pr-10 cursor-pointer`}
                                >
                                    <option value="" disabled>-- Please choose your group --</option>
                                    {studentGroups.map(group => (
                                        <option key={group} value={group}>{group}</option>
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
                         {studentGroups.length === 0 && <p className="text-center text-sm text-zinc-400">No schedules are available yet. Please check back later.</p>}
                        <button
                            type="submit"
                            disabled={!selectedGroup}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-lg shadow-emerald-600/20 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800/50 disabled:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-800 focus:ring-emerald-500 transition-colors"
                        >
                            View My Dashboard
                        </button>
                    </form>
                </DashboardCard>
            </div>
        </div>
    );
};

export default React.memo(StudentLoginPage);