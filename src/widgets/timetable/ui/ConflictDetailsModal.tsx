

import React from 'react';
import { ScheduleItem, Conflict } from '../../../entities/schedule';

interface ConflictDetailsModalProps {
    item: ScheduleItem;
    conflicts: Conflict[];
    onClose: () => void;
}

const ConflictDetailsModal: React.FC<ConflictDetailsModalProps> = ({ item, conflicts, onClose }) => {
    const itemConflicts = conflicts.filter(c => c.itemId === item.id);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="conflict-modal-title">
            <div className="bg-zinc-800/80 backdrop-blur-md p-6 rounded-3xl shadow-xl w-full max-w-lg transform transition-all border border-zinc-700" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 border-b border-zinc-700 pb-3">
                    <h3 id="conflict-modal-title" className="text-xl font-bold text-red-400">Conflict Details</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white text-2xl font-bold" aria-label="Close">&times;</button>
                </div>
                
                <div className="mb-6 text-gray-300">
                    <p><span className="font-semibold text-gray-100">Class:</span> {item.subject}</p>
                    <p><span className="font-semibold text-gray-100">Teacher:</span> {item.teacher}</p>
                    <p><span className="font-semibold text-gray-100">Group:</span> {item.studentGroup}</p>
                    <p><span className="font-semibold text-gray-100">Time:</span> {item.day}, {item.startTime} - {item.endTime}</p>
                    <p><span className="font-semibold text-gray-100">Room:</span> {item.roomId}</p>
                </div>

                <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                    {itemConflicts.map((conflict, index) => (
                        <div key={index} className="bg-red-500/15 p-4 rounded-2xl border border-red-500/30">
                            <p className="font-semibold text-red-300 text-sm">{conflict.message}</p>
                            {conflict.suggestions && conflict.suggestions.length > 0 && (
                                <div className="mt-3">
                                    <p className="text-xs font-medium text-gray-200">AI Suggestions:</p>
                                    <ul className="list-disc pl-5 text-xs text-gray-300 mt-1 space-y-1">
                                        {conflict.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex justify-end">
                    <button onClick={onClose} className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-3xl hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-800 focus:ring-emerald-500 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ConflictDetailsModal);