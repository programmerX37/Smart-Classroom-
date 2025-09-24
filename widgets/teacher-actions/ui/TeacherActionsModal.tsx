import React, { useState } from 'react';
import DashboardCard from '../../../shared/ui/card';
import { AppEntry } from '../../../entities/app-entry';

interface TeacherActionsModalProps {
    onClose: () => void;
    onCreateEntry: (entry: Omit<AppEntry, 'id' | 'createdAt'>) => void;
}

const formInputStyles = "block w-full rounded-full bg-zinc-900/50 border border-white/10 text-white shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 sm:text-sm px-4 py-3 transition-colors";
const buttonStyles = "w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-lg shadow-emerald-600/20 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800/50 disabled:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-800 focus:ring-emerald-500 transition-colors";

const PaymentForm: React.FC<{ onCreateEntry: TeacherActionsModalProps['onCreateEntry'], onClose: () => void }> = ({ onCreateEntry, onClose }) => {
    const [upiLink, setUpiLink] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!upiLink.trim() || !message.trim()) return;
        const fullMessage = `Payment Request: ${message}. Please use the following UPI link: ${upiLink}`;
        onCreateEntry({ type: 'payment', message: fullMessage, read: false });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" value={upiLink} onChange={e => setUpiLink(e.target.value)} placeholder="UPI Link" className={formInputStyles} required />
            <input type="text" value={message} onChange={e => setMessage(e.target.value)} placeholder="Message (e.g., For science fair)" className={formInputStyles} required />
            <button type="submit" className={buttonStyles} disabled={!upiLink.trim() || !message.trim()}>Send Payment Request</button>
        </form>
    );
};

const TaskForm: React.FC<{ onCreateEntry: TeacherActionsModalProps['onCreateEntry'], onClose: () => void }> = ({ onCreateEntry, onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) return;
        const fullMessage = `New Task Assigned: "${title}". Description: ${description}`;
        onCreateEntry({ type: 'task', message: fullMessage, read: false });
        onClose();
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Task Title" className={formInputStyles} required />
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Task Description" className={`${formInputStyles} rounded-3xl`} required rows={3}></textarea>
            <button type="submit" className={buttonStyles} disabled={!title.trim() || !description.trim()}>Assign Task</button>
        </form>
    );
};

const AlertForm: React.FC<{ onCreateEntry: TeacherActionsModalProps['onCreateEntry'], onClose: () => void }> = ({ onCreateEntry, onClose }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        onCreateEntry({ type: 'alert', message, read: false });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Alert Message (e.g., Exam on Monday)" className={`${formInputStyles} rounded-3xl`} required rows={4}></textarea>
            <button type="submit" className={buttonStyles} disabled={!message.trim()}>Send Alert</button>
        </form>
    );
};


const TeacherActionsModal: React.FC<TeacherActionsModalProps> = ({ onClose, onCreateEntry }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity p-4" onClick={onClose} role="dialog" aria-modal="true">
            <div className="bg-zinc-900/50 backdrop-blur-2xl p-4 sm:p-6 rounded-3xl shadow-2xl w-full max-w-4xl transform transition-all border border-white/10 overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
                    <h3 className="text-xl font-bold text-emerald-400">Teacher Actions</h3>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white text-2xl font-bold" aria-label="Close">&times;</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <DashboardCard title="Request Payment" variant="light">
                        <PaymentForm onCreateEntry={onCreateEntry} onClose={onClose} />
                    </DashboardCard>
                    <DashboardCard title="Assign Task" variant="dark">
                        <TaskForm onCreateEntry={onCreateEntry} onClose={onClose} />
                    </DashboardCard>
                    <DashboardCard title="Send Alert" variant="light">
                        <AlertForm onCreateEntry={onCreateEntry} onClose={onClose} />
                    </DashboardCard>
                </div>
            </div>
        </div>
    );
};

export default React.memo(TeacherActionsModal);