import React from 'react';
import { motion } from 'framer-motion';
import { Github, Code, User } from 'lucide-react';

const StudentCard = ({ student, onClick }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => onClick(student)}
            className="group cursor-pointer"
        >
            {/* Ticket-Style Card */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border-4 border-gray-900 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">

                {/* Header Strip */}
                <div className="bg-gray-900 text-yellow-50 px-4 py-2 border-b-4 border-gray-900">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold tracking-wider">STUDENT ID</span>
                        <span className="text-xs font-mono">{student.roll_number}</span>
                    </div>
                </div>

                {/* Image Container */}
                <div className="relative w-full aspect-square overflow-hidden bg-gray-100 border-b-4 border-gray-900">
                    {student.gmail_photo_url ? (
                        <img
                            src={student.gmail_photo_url}
                            alt={student.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100">
                            <User size={64} />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4">
                    {/* Name Section */}
                    <div className="border-4 border-gray-900 border-l-0 border-r-0 border-t-0 pb-3 mb-3">
                        {/* <div className="text-xs font-bold text-gray-600 uppercase tracking-wider">Name</div> */}
                        <h3 className="text-lg font-black text-gray-900 truncate uppercase tracking-wide">
                            {student.name}
                        </h3>
                    </div>

                    {/* Stats Grid */}
                    {(student.github_username || student.leetcode_username) && (
                        <div className="grid grid-cols-2 gap-2">
                            {student.github_username && (
                                <div className="border-4 border-gray-900 border-r-2 border-b-0 p-2 bg-white">
                                    <div className="flex items-center gap-1 mb-1">
                                        <Github size={12} className="text-gray-900" />
                                        <span className="text-xs font-bold text-gray-600">GitHub</span>
                                    </div>
                                    <p className="text-xl font-black text-gray-900">{student.github_commits_count || 0}</p>
                                    <p className="text-xs text-gray-500 uppercase">commits</p>
                                </div>
                            )}
                            {student.leetcode_username && (
                                <div className="border-4 border-gray-900 border-l-2 border-b-0 p-2 bg-white">
                                    <div className="flex items-center gap-1 mb-1">
                                        <Code size={12} className="text-orange-600" />
                                        <span className="text-xs font-bold text-gray-600">LeetCode</span>
                                    </div>
                                    <p className="text-xl font-black text-gray-900">{student.leetcode_points || 0}</p>
                                    <p className="text-xs text-gray-500 uppercase">solved</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Bottom Barcode Strip */}
                <div className="bg-gray-900 px-4 py-2 border-t-4 border-gray-900">
                    <div className="h-8 bg-gradient-to-r from-yellow-50 via-gray-700 to-yellow-50 bg-[length:3px_100%] bg-repeat-x opacity-50"></div>
                </div>
            </div>
        </motion.div>
    );
};

export default StudentCard;
