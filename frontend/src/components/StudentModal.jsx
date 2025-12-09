import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, Code, Linkedin, Figma, Globe, RefreshCw, Edit2, Save, Check } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config';
import Input from './Input';
import MoodleDashboard from './MoodleDashboard';

const StudentModal = ({ student: initialStudent, onClose }) => {
    const [student, setStudent] = useState(initialStudent);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: initialStudent.name,
        section: initialStudent.section,
        github_username: initialStudent.github_username || '',
        leetcode_username: initialStudent.leetcode_username || '',
        linkedin_url: initialStudent.linkedin_url || '',
        portfolio_url: initialStudent.portfolio_url || '',
        figma_url: initialStudent.figma_url || '',
        bio_description: initialStudent.bio_description || '',
        bio_description: initialStudent.bio_description || '',
        skills_description: initialStudent.skills_description || '',
        moodle_username: initialStudent.moodle_username || '',
        moodle_password: initialStudent.moodle_password || ''
    });

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(`${API_URL}/api/students/${student.roll_number}`, formData);
            setStudent(response.data);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update student:", error);
            alert("Failed to update profile. Please try again.");
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

                        {/* Actions Buttons */}
                        <div className="absolute top-4 right-4 flex gap-2 z-10">
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="p-2 rounded-full bg-white border-2 border-gray-900 hover:bg-gray-900 hover:text-yellow-50 transition-all"
                                title={isEditing ? "Cancel Editing" : "Edit Profile"}
                            >
                                {isEditing ? <X size={20} /> : <Edit2 size={20} />}
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full bg-white border-2 border-gray-900 hover:bg-gray-900 hover:text-yellow-50 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

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
                            {isEditing ? (
                                /* Edit Mode */
                                <div className="space-y-4">
                                    <div className="text-center mb-4">
                                        <h2 className="text-xl font-black text-gray-900 uppercase">Edit Profile</h2>
                                    </div>

                                    <Input
                                        label="Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Section"
                                            name="section"
                                            value={formData.section}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-900">Bio</label>
                                        <textarea
                                            name="bio_description"
                                            value={formData.bio_description}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 min-h-[80px]"
                                            placeholder="Tell us about yourself..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-900">Skills (comma separated)</label>
                                        <textarea
                                            name="skills_description"
                                            value={formData.skills_description}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 min-h-[60px]"
                                            placeholder="React, Python, Design..."
                                        />
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <h3 className="text-sm font-bold text-gray-900 uppercase border-b border-gray-200 pb-1">Social Links</h3>
                                        <Input
                                            label="GitHub Username"
                                            name="github_username"
                                            value={formData.github_username}
                                            onChange={handleInputChange}
                                            placeholder="username"
                                        />
                                        <Input
                                            label="LeetCode Username"
                                            name="leetcode_username"
                                            value={formData.leetcode_username}
                                            onChange={handleInputChange}
                                            placeholder="username"
                                        />
                                        <Input
                                            label="LinkedIn URL"
                                            name="linkedin_url"
                                            value={formData.linkedin_url}
                                            onChange={handleInputChange}
                                            placeholder="https://linkedin.com/in/..."
                                        />
                                        <Input
                                            label="Portfolio URL"
                                            name="portfolio_url"
                                            value={formData.portfolio_url}
                                            onChange={handleInputChange}
                                            placeholder="https://..."
                                        />
                                        <Input
                                            label="Figma URL"
                                            name="figma_url"
                                            value={formData.figma_url}
                                            onChange={handleInputChange}
                                            placeholder="https://figma.com/..."
                                        />
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <h3 className="text-sm font-bold text-gray-900 uppercase border-b border-gray-200 pb-1">Moodle Credentials</h3>
                                        <Input
                                            label="Moodle Username"
                                            name="moodle_username"
                                            value={formData.moodle_username}
                                            onChange={handleInputChange}
                                            placeholder="username"
                                        />
                                        <Input
                                            label="Moodle Password"
                                            name="moodle_password"
                                            value={formData.moodle_password}
                                            onChange={handleInputChange}
                                            placeholder="password"
                                            type="password"
                                        />
                                    </div>

                                    <button
                                        onClick={handleSave}
                                        className="w-full flex items-center justify-center gap-2 py-3 mt-4 rounded-xl font-bold uppercase text-sm bg-green-600 text-white hover:bg-green-700 border-2 border-gray-900 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                    >
                                        <Save size={18} />
                                        Save Changes
                                    </button>
                                </div>
                            ) : (
                                /* View Mode */
                                <>
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

                                    {/* Moodle Dashboard */}
                                    {(student.moodle_username && student.moodle_password) && (
                                        <div className="mb-6">
                                            <MoodleDashboard rollNumber={student.roll_number} />
                                        </div>
                                    )}

                                    {/* Moodle Info (Private) */}
                                    {(student.moodle_username || student.moodle_password) && (
                                        <div className="mb-4 text-center p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                                            <h4 className="text-xs font-bold text-yellow-800 uppercase mb-1">Moodle Credentials</h4>
                                            <p className="text-xs text-gray-700">User: {student.moodle_username}</p>
                                            <p className="text-xs text-gray-700">Pass: ••••••••</p>
                                        </div>
                                    )}

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
                                </>
                            )}
                        </div>

                        {/* Bottom Strip */}
                        <div className="bg-gray-900 px-6 py-3 border-t-4 border-gray-900">
                            <div className="text-center text-xs font-mono font-bold text-yellow-50 tracking-widest">
                                KIET DIRECTORY • 2024
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default StudentModal;