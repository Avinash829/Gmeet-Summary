'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import ReactMarkdown from 'react-markdown';

interface SummaryBoxProps {
    transcript: string;
    setSummary: (summary: string) => void;
}

const SummaryBox: React.FC<SummaryBoxProps> = ({ transcript, setSummary }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [localSummary, setLocalSummary] = useState('');

    const handleSummarize = async () => {
        if (!transcript) return;
        try {
            setLoading(true);
            setError('');
            const response = await api.post('/api/summary', { text: transcript });
            setSummary(response.data.summary);
            setLocalSummary(response.data.summary);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to generate summary.');
        } finally {
            setLoading(false);
        }
    };

    if (!transcript) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/100 backdrop-white-md rounded-2xl border border-slate-300/30 p-6 text-center text-slate-500"
            >
                Transcript will appear here after uploading a file.
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-50 rounded-2xl border border-slate-300/30 p-6 flex flex-col"
        >
            <h2 className="text-lg font-semibold text-slate-700 mb-2">Transcript</h2>
            <div className="h-64 overflow-y-auto bg-indigo-200 rounded p-4  text-slate-700 mb-4 whitespace-pre-wrap">
                {transcript}
            </div>

            <button
                onClick={handleSummarize}
                disabled={loading}
                className="self-end bg-indigo-500 text-white px-6 py-2 rounded-sm hover:bg-indigo-600 disabled:opacity-60 transition-colors hover:shadow-lg hover:rounded-4xl"
            >
                {loading ? 'Generating summary...' : 'Summarize Meeting'}
            </button>

            {error && <p className="text-red-500 mt-2">{error}</p>}

            {loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-900 text-sm mt-3"
                >
                    Summarizing your meeting, please wait...
                </motion.div>
            )}

            {localSummary && !loading && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-6 bg-indigo-200 rounded-xl p-4 shadow-inner"
                >
                    <h2 className="text-lg font-semibold text-slate-700 mb-2">Meeting Summary</h2>
                    <div className="prose prose-slate text-sm">
                        <ReactMarkdown>
                            {localSummary}
                        </ReactMarkdown>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default SummaryBox;
