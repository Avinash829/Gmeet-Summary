'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';

interface DownloadButtonProps {
    transcript: string;
    summary: string;
    meetingId: string;
}


const DownloadButton: React.FC<DownloadButtonProps> = ({ transcript, summary, meetingId }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    

    const handleDownload = async () => {
        if (!transcript || !summary) return;
        try {
            setLoading(true);
            setError('');
            const response = await api.get(`/download/${meetingId}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'meeting-summary.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError('Failed to download PDF.');
        } finally {
            setLoading(false);
        }
    };

    if (!transcript || !summary) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex justify-end">
            <button
                onClick={handleDownload}
                disabled={loading}
                className="bg-emerald-500 text-white px-6 py-2 rounded-sm hover:bg-emerald-600 disabled:opacity-60 transition-colors hover:shadow-lg hover:rounded-4xl"
            >
                {loading ? 'Preparing PDF...' : 'Download PDF'}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </motion.div>
    );
};

export default DownloadButton;
