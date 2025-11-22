import React from 'react';
import { motion } from 'framer-motion';
import { Github, Code, User } from 'lucide-react';

const StatPill = ({ icon: Icon, value, label, color }) => (
    <div className="flex items-center gap-2">
        <Icon size={18} className={color} />
        <div>
            <p className="font-bold text-sm text-text-main">{value}</p>
            <p className="text-xs text-text-light">{label}</p>
        </div>
    </div>
);

const StudentCard = ({ student, onClick }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            onClick={() => onClick(student)}
            className="group cursor-pointer"
        >
            <div className="relative w-full h-[420px] rounded-2xl overflow-hidden p-1 bg-white shadow-medium transition-all duration-300 hover:shadow-lg hover:border-accent border-2 border-transparent">
                <div className="relative w-full h-2/5 rounded-xl overflow-hidden bg-gray-100">
                    {student.gmail_photo_url ? (
                        <img
                            src={student.gmail_photo_url}
                            alt={student.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                            <User size={48} />
                        </div>
                    )}
                </div>

                <div className="absolute top-[35%] left-1/2 -translate-x-1/2">
                    <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                        <img
                            src={student.gmail_photo_url || 'https://via.placeholder.com/150'}
                            alt={student.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="absolute top-[calc(35%+48px)] left-0 right-0 p-4 text-center">
                    <h3 className="text-xl font-bold text-text-main group-hover:text-accent transition-colors duration-300">
                        {student.name}
                    </h3>
                    <p className="text-sm text-text-light">
                        {student.roll_number}
                    </p>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/50 backdrop-blur-sm rounded-b-xl">
                    <div className="flex justify-around items-center">
                        {student.github_username && (
                            <StatPill
                                icon={Github}
                                value={student.github_commits_count || 0}
                                label="Commits"
                                color="text-green-500"
                            />
                        )}
                        {student.leetcode_username && (
                            <StatPill
                                icon={Code}
                                value={student.leetcode_points || 0}
                                label="Points"
                                color="text-orange-500"
                            />
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default StudentCard;
