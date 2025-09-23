import React, { useState } from 'react';

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

    return (
        <div className="flex justify-center items-start pt-16 h-[calc(100vh-10rem)]">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Select Your Profile</h2>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="teacher-select" className="block text-sm font-medium text-gray-700">
                            Teacher Name
                        </label>
                        <select
                            id="teacher-select"
                            value={selectedTeacher}
                            onChange={(e) => setSelectedTeacher(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            <option value="" disabled>-- Please choose a teacher --</option>
                            {teachers.map(teacher => (
                                <option key={teacher} value={teacher}>{teacher}</option>
                            ))}
                        </select>
                    </div>
                     {teachers.length === 0 && <p className="text-center text-sm text-gray-500">No teachers found. Please have an administrator add teachers in the Admin Console.</p>}
                    <button
                        onClick={handleLogin}
                        disabled={!selectedTeacher}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        View My Schedule
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeacherLoginPage;
