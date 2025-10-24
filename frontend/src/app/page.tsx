'use client';

import React, { useState } from 'react';
import UploadBox from '../components/UploadBox';
import SummaryBox from '../components/SummaryBox';
import DownloadButton from '../components/DownloadButton';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
    const [transcript, setTranscript] = useState('');
    const [summary, setSummary] = useState('');
    const [meetingId, setMeetingId] = useState('');


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gradient-to-b from-indigo-100 via-indigo-300 to-indigo-900 flex flex-col items-center p-8"
        >
            <h1 className="text-3xl font-bold text-white-700 mb-8 text-center">
                AI Meeting Summarizer
            </h1>

            {/* Upload Box */}
            <div className="w-full max-w-2xl mb-6">
                <UploadBox setTranscript={setTranscript} setMeetingId={setMeetingId} />
            </div>

            {/* Summary Box */}
            <div className="w-full max-w-2xl mb-4">
                <SummaryBox transcript={transcript} setSummary={setSummary} />
            </div>

            {/* Download Button */}
            <div className="w-full max-w-2xl">
                <DownloadButton meetingId={meetingId} transcript={transcript} summary={summary} />
            </div>
        </motion.div>
    );
};

export default HomePage;
