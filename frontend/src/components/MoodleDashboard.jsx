import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { BookOpen, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const MoodleDashboard = ({ rollNumber }) => {
    const [assignments, setAssignments] = useState({ pending: [], completed: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('pending');

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/api/students/${rollNumber}/moodle-assignments`);
                setAssignments(response.data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch Moodle assignments", err);
                if (err.response && err.response.status === 401) {
                    setError("Invalid Moodle Credentials. Please check your password.");
                } else {
                    setError("Failed to load assignments. Check credentials or try again later.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (rollNumber) {
            fetchAssignments();
        }
    }, [rollNumber]);

    if (loading) {
        return (
            <div className="p-8 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <div className="animate-spin w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full mx-auto mb-3"></div>
                <p className="text-sm font-bold text-gray-600 uppercase">Syncing with Moodle...</p>
                <p className="text-xs text-gray-500 mt-1">This may take a few seconds</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                <AlertCircle className="shrink-0" />
                <p className="text-sm font-bold">{error}</p>
            </div>
        );
    }

    const displayedAssignments = activeTab === 'pending' ? assignments.pending : assignments.completed;

    return (
        <div className="bg-white rounded-xl border-2 border-gray-900 overflow-hidden">
            {/* Header */}
            <div className="bg-gray-900 text-yellow-50 p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <BookOpen size={20} className="text-yellow-400" />
                    <h3 className="font-black text-lg uppercase tracking-wide">Moodle Assignments</h3>
                </div>
                <div className="flex bg-gray-800 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-all ${activeTab === 'pending' ? 'bg-yellow-400 text-gray-900' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Left ({assignments.pending.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-all ${activeTab === 'completed' ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Done ({assignments.completed.length})
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="max-h-[300px] overflow-y-auto p-2 space-y-2">
                {displayedAssignments.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <CheckCircle size={32} className="mx-auto mb-2 opacity-20" />
                        <p className="text-sm font-bold uppercase">No assignments found</p>
                    </div>
                ) : (
                    displayedAssignments.map((assignment, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            delay={idx * 0.05}
                            className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-gray-900 transition-all group"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{assignment.title}</h4>
                                    <p className="text-xs text-gray-500 font-medium uppercase mt-0.5">{assignment.course}</p>
                                </div>
                                <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${activeTab === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                    {assignment.date}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MoodleDashboard;
