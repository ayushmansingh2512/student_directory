import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, Code, Linkedin, Figma, Globe, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config';

const StudentModal = ({ student: initialStudent, onClose }) => {
    const [student, setStudent] = useState(initialStudent);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            const response = await axios.post(`${API_URL}/api/students/${student.roll_number}/refresh`);
            setStudent(response.data);
        } catch (error) {
            console.error("Failed to refresh stats:", error);
        } finally {
            setIsRefreshing(false);
        }
    };

    if (!student) return null;

    return (
        <AnimatePresence>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-md max-h-[90vh] overflow-y-auto pt-16"
                >
                    {/* Ticket Card */}
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border-4 border-gray-900 shadow-2xl relative">

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-900 hover:text-yellow-50 transition-all z-10"
                        >
                            <X size={20} className="text-gray-900" />
                        </button>

                        {/* Avatar Circle */}
                        <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-4 border-gray-900 bg-white shadow-xl overflow-hidden z-20">
                            {student.gmail_photo_url ? (
                                <img
                                    src={student.gmail_photo_url}
                                    alt={student.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-4xl font-black">
                                    {student.name.charAt(0)}
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="pt-20 pb-6 px-6">
                            {/* Name & Info */}
                            <div className="text-center mb-4">
                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-wide mb-1">
                                    {student.name}
                                </h2>
                                <p className="text-sm font-bold text-gray-600 uppercase tracking-wider">
                                    {student.roll_number} • Section {student.section}
                                </p>
                            </div>

                            {/* Color Band */}
                            <div className="h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 mb-4"></div>

                            {/* Bio */}
                            {student.bio_description && (
                                <div className="mb-4">
                                    <p className="text-sm text-gray-700 text-center leading-relaxed">
                                        {student.bio_description}
                                    </p>
                                </div>
                            )}

                            {/* Skills */}
                            {student.skills_description && (
                                <div className="mb-4">
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {student.skills_description.split(',').map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-gray-900 text-yellow-50 rounded-full text-xs font-bold uppercase"
                                            >
                                                {skill.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="text-center p-3 bg-white rounded-xl border-2 border-gray-900">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Github size={14} className="text-gray-900" />
                                        <span className="text-xs font-bold text-gray-600 uppercase">GitHub</span>
                                    </div>
                                    <div className="text-2xl font-black text-gray-900">{student.github_commits_count || 0}</div>
                                    <div className="text-xs text-gray-500 uppercase">commits</div>
                                </div>
                                <div className="text-center p-3 bg-white rounded-xl border-2 border-gray-900">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Code size={14} className="text-orange-600" />
                                        <span className="text-xs font-bold text-gray-600 uppercase">LeetCode</span>
                                    </div>
                                    <div className="text-2xl font-black text-gray-900">{student.leetcode_points || 0}</div>
                                    <div className="text-xs text-gray-500 uppercase">solved</div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                {student.github_username && (
                                    <a
                                        href={`https://github.com/${student.github_username}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-1 py-2 rounded-lg font-bold uppercase text-xs bg-white border-2 border-gray-900 hover:bg-gray-900 hover:text-yellow-50 transition-all"
                                    >
                                        <Github size={14} />
                                        GitHub
                                    </a>
                                )}
                                {student.leetcode_username && (
                                    <a
                                        href={`https://leetcode.com/${student.leetcode_username}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-1 py-2 rounded-lg font-bold uppercase text-xs bg-white border-2 border-gray-900 hover:bg-gray-900 hover:text-yellow-50 transition-all"
                                    >
                                        <Code size={14} />
                                        LeetCode
                                    </a>
                                )}
                                {student.linkedin_url && (
                                    <a
                                        href={student.linkedin_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-1 py-2 rounded-lg font-bold uppercase text-xs bg-white border-2 border-gray-900 hover:bg-gray-900 hover:text-yellow-50 transition-all"
                                    >
                                        <Linkedin size={14} />
                                        LinkedIn
                                    </a>
                                )}
                                {student.portfolio_url && (
                                    <a
                                        href={student.portfolio_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-1 py-2 rounded-lg font-bold uppercase text-xs bg-white border-2 border-gray-900 hover:bg-gray-900 hover:text-yellow-50 transition-all"
                                    >
                                        <Globe size={14} />
                                        Portfolio
                                    </a>
                                )}
                                {student.figma_url && (
                                    <a
                                        href={student.figma_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-1 py-2 rounded-lg font-bold uppercase text-xs bg-white border-2 border-gray-900 hover:bg-gray-900 hover:text-yellow-50 transition-all"
                                    >
                                        <Figma size={14} />
                                        Figma
                                    </a>
                                )}
                            </div>

                            {/* Refresh Button */}
                            <div className="border-t-2 border-gray-900 pt-4">
                                <button
                                    onClick={handleRefresh}
                                    disabled={isRefreshing}
                                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold uppercase text-sm transition-all ${isRefreshing
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-900 text-yellow-50 hover:bg-gray-800 border-2 border-gray-900'
                                        }`}
                                >
                                    <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                                    {isRefreshing ? 'Updating Stats...' : 'Refresh Stats'}
                                </button>
                            </div>
                        </div>

                        {/* Bottom Strip */}
                        <div className="bg-gray-900 px-6 py-3 border-t-4 border-gray-900">
                            <div className="text-center text-xs font-mono font-bold text-yellow-50 tracking-widest">
                                KIET DIRECTORY • 2025
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default StudentModal;