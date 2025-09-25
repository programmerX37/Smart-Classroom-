import React, { useState } from 'react';
import { AppEntry } from '../../../entities/app-entry';
import DashboardCard from '../../../shared/ui/card';

// This will be available globally from the script tag in index.html
declare var XLSX: any;

const timeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    if (seconds < 5) return "just now";
    return Math.floor(seconds) + " seconds ago";
};

const DownloadModal: React.FC<{ onConfirm: () => void; onCancel: () => void }> = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
        <div className="bg-zinc-800/80 backdrop-blur-md p-6 rounded-3xl shadow-xl w-full max-w-md border border-zinc-700">
            <h3 className="text-lg font-bold text-white mb-4">Confirm Download</h3>
            <p className="text-gray-300 mb-6">You are about to download the list of created entries as an Excel file. Do you want to proceed?</p>
            <div className="flex justify-end space-x-3">
                <button onClick={onCancel} className="px-5 py-3 bg-zinc-600 hover:bg-zinc-500 rounded-3xl text-white font-medium">Cancel</button>
                <button onClick={onConfirm} className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-3xl font-medium">Confirm Download</button>
            </div>
        </div>
    </div>
);

const CreatedEntriesView: React.FC<{ entries: AppEntry[] }> = ({ entries }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const relevantEntries = entries
        .filter(e => ['task', 'payment', 'alert'].includes(e.type))
        .sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());

    const handleDownload = () => {
        try {
            const dataToExport = relevantEntries.map(entry => ({
                Type: entry.type.charAt(0).toUpperCase() + entry.type.slice(1),
                Details: entry.message,
                'Created At': entry.createdAt.toLocaleString(),
            }));

            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Created Entries");
            XLSX.writeFile(workbook, "teacher_created_entries.xlsx");
        } catch (error) {
            console.error("Failed to generate Excel file:", error);
            // In a real app, you might want to show an error toast to the user
        } finally {
            setIsModalOpen(false);
        }
    };

    const getEntryStyle = (type: AppEntry['type']) => {
        switch (type) {
            case 'task': return 'border-yellow-500/80';
            case 'payment': return 'border-green-500/80';
            case 'alert': return 'border-red-500/80';
            default: return 'border-gray-500/80';
        }
    };

    return (
        <DashboardCard title="My Created Entries">
            <div className="flex flex-col h-full">
                <div className="flex-grow h-48 overflow-y-auto pr-2">
                    {relevantEntries.length > 0 ? (
                        <ul className="space-y-3">
                            {relevantEntries.map(entry => (
                                <li key={entry.id} className={`flex justify-between items-start text-sm bg-zinc-700/50 p-3 rounded-lg border-l-4 ${getEntryStyle(entry.type)}`}>
                                    <div className="flex-grow">
                                        <p className="font-medium text-gray-200 capitalize"><span className="font-bold">{entry.type}:</span> {entry.message}</p>
                                    </div>
                                    <p className="text-xs text-gray-400 flex-shrink-0 ml-4">{timeAgo(entry.createdAt)}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <p className="text-sm text-gray-400">No entries created yet. Use the '+' button to add one.</p>
                        </div>
                    )}
                </div>
                <div className="flex-shrink-0 mt-4">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        disabled={relevantEntries.length === 0}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-3xl shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800/50 disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-800 focus:ring-emerald-500 transition-colors"
                    >
                        Download in Excel
                    </button>
                </div>
            </div>
            {isModalOpen && <DownloadModal onConfirm={handleDownload} onCancel={() => setIsModalOpen(false)} />}
        </DashboardCard>
    );
};

export default React.memo(CreatedEntriesView);