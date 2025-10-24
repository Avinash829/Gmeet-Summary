'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';

interface UploadBoxProps {
    setTranscript: (text: string) => void;
    setMeetingId: (id: string) => void;
}


const UploadBox: React.FC<UploadBoxProps> = ({ setTranscript, setMeetingId }) => {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileUpload = async (file: File) => {
        try {
            setLoading(true);
            setError('');
            setProgress(0);

            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (event) => {
                    const percent = Math.round((event.loaded * 100) / (event.total || 1));
                    setProgress(percent);
                },
            });

        setTranscript(response.data.transcript);
        setMeetingId(response.data.meetingId);
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.response?.data?.error || 'Upload failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleFileUpload(file);
    };

    const handleClick = () => fileInputRef.current?.click();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/100 backdrop-blur-md rounded-2xl border border-slate-300/30 p-8 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 transition-colors"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={handleClick}
        >
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".mp3,.wav,.mp4"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
            />
            {loading ? (
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p>Uploading... {progress}%</p>
                </div>
            ) : (
                <>
                    <p className="text-slate-700 text-lg font-medium mb-2">
                        Drag & Drop your audio/video here
                    </p>
                    <p className="text-slate-500 text-sm">or click to select a file</p>
                </>
            )}
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </motion.div>
    );
};

export default UploadBox;
