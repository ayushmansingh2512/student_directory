import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, Code, Linkedin, Figma, Globe, User, Trophy, RefreshCw } from 'lucide-react';
import axios from 'axios';

const StudentModal = ({ student: initialStudent, onClose }) => {
    const [student, setStudent] = useState(initialStudent);
    const [viewPortfolio, setViewPortfolio] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            const response = await axios.post(`http://localhost:8000/api/students/${student.roll_number}/refresh`);
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
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-2xl bg-gradient-to-br from-white via-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto border border-gray-100"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-200 transition-all duration-200 z-10 hover:scale-110"
                    >
                        <X size={24} className="text-gray-600" />
                    </button>

                    {/* Header with Gradient Background */}
                    <div className="relative h-56 bg-gradient-to-br from-orange-400 via-orange-300 to-orange-200 overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-40 -mt-40"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32"></div>

                        {/* Profile Photo */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10">
                            {student.gmail_photo_url ? (
                                <img
                                    src={student.gmail_photo_url}
                                    alt={student.name}
                                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-2xl"
                                />
                            ) : (
                                <div className="w-40 h-40 rounded-full bg-gray-300 border-4 border-white shadow-2xl flex items-center justify-center">
                                    <User size={56} className="text-gray-500" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="pt-28 px-8 pb-8">
                        {/* Name & Roll */}
                        <motion.div
                            className="text-center mb-8"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                                {student.name}
                            </h2>
                            <div className="flex items-center justify-center gap-4 text-gray-600 text-sm flex-wrap">
                                <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full font-medium">
                                    Roll: {student.roll_number}
                                </span>
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                                    Section {student.section}
                                </span>
                            </div>
                        </motion.div>

                        {/* Stats Grid */}
                        <motion.div
                            className="grid grid-cols-2 gap-4 mb-8"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                        >
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-300 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                                <div className="relative bg-white rounded-2xl p-5 text-center border border-gray-200 group-hover:border-orange-200 transition">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Github size={18} className="text-orange-600" />
                                        <span className="text-xs font-semibold text-gray-600">GitHub</span>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">{student.github_commits_count || 0}</p>
                                    <p className="text-xs text-gray-500 mt-1">Commits</p>
                                </div>
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-300 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                                <div className="relative bg-white rounded-2xl p-5 text-center border border-gray-200 group-hover:border-blue-200 transition">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Trophy size={18} className="text-blue-600" />
                                        <span className="text-xs font-semibold text-gray-600">LeetCode</span>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">{student.leetcode_points || 0}</p>
                                    <p className="text-xs text-gray-500 mt-1">Points</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Refresh Button */}
                        <div className="flex justify-center mb-8">
                            <button
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${isRefreshing
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600 hover:shadow-sm'
                                    }`}
                            >
                                <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                                {isRefreshing ? 'Updating...' : 'Refresh Stats'}
                            </button>
                        </div>

                        {/* Bio Section */}
                        {student.bio_description && (
                            <motion.div
                                className="mb-8"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3 pl-1">About</h3>
                                <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    {student.bio_description}
                                </p>
                            </motion.div>
                        )}

                        {/* Skills Section */}
                        {student.skills_description && (
                            <motion.div
                                className="mb-8"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                            >
                                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3 pl-1">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {student.skills_description.split(',').map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 rounded-full text-xs font-medium border border-orange-200"
                                        >
                                            {skill.trim()}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Connect Section */}
                        <motion.div
                            className="border-t border-gray-200 pt-6"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 pl-1">Connect</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {student.github_username && (
                                    <a
                                        href={`https://github.com/${student.github_username}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-300 transition-all hover:shadow-md group"
                                    >
                                        <Github size={18} className="text-gray-600 group-hover:text-orange-600 transition" />
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-orange-700 transition">GitHub</span>
                                    </a>
                                )}
                                {student.leetcode_username && (
                                    <a
                                        href={`https://leetcode.com/${student.leetcode_username}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition-all hover:shadow-md group"
                                    >
                                        <Code size={18} className="text-gray-600 group-hover:text-blue-600 transition" />
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition">LeetCode</span>
                                    </a>
                                )}
                                {student.linkedin_url && (
                                    <a
                                        href={student.linkedin_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-400 transition-all hover:shadow-md group"
                                    >
                                        <Linkedin size={18} className="text-gray-600 group-hover:text-blue-600 transition" />
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition">LinkedIn</span>
                                    </a>
                                )}
                                {student.figma_url && (
                                    <a
                                        href={student.figma_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-300 transition-all hover:shadow-md group"
                                    >
                                        <Figma size={18} className="text-gray-600 group-hover:text-purple-600 transition" />
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition">Figma</span>
                                    </a>
                                )}
                                {student.portfolio_url && (
                                    <button
                                        onClick={() => setViewPortfolio(true)}
                                        className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-300 transition-all hover:shadow-md group"
                                    >
                                        <Globe size={18} className="text-gray-600 group-hover:text-green-600 transition" />
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-green-700 transition">Portfolio</span>
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Portfolio Preview Modal */}
                    <AnimatePresence>
                        {viewPortfolio && student.portfolio_url && (
                            <motion.div
                                className="absolute inset-0 bg-white z-20 flex flex-col rounded-3xl"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                                    <h3 className="font-semibold text-lg text-gray-900">Portfolio Preview</h3>
                                    <button
                                        onClick={() => setViewPortfolio(false)}
                                        className="p-2 rounded-full hover:bg-gray-200 transition-all hover:scale-110"
                                    >
                                        <X size={20} className="text-gray-600" />
                                    </button>
                                </div>
                                <iframe
                                    src={student.portfolio_url}
                                    className="flex-1 w-full border-0"
                                    title="Portfolio Preview"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default StudentModal;