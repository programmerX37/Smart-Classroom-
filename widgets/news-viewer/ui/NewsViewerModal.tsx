

import React from 'react';

interface NewsViewerModalProps {
    title: string;
    content: string;
    onClose: () => void;
}

const NewsViewerModal: React.FC<NewsViewerModalProps> = ({ title, content, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="news-modal-title">
            <div className="bg-zinc-800/80 backdrop-blur-md p-6 rounded-3xl shadow-xl w-full max-w-2xl transform transition-all border border-zinc-700" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 border-b border-zinc-700 pb-3">
                    <h3 id="news-modal-title" className="text-xl font-bold text-emerald-400">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white text-2xl font-bold" aria-label="Close">&times;</button>
                </div>
                
                <div className="text-gray-300 max-h-[60vh] overflow-y-auto pr-2 space-y-4">
                    {content.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
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

export default React.memo(NewsViewerModal);