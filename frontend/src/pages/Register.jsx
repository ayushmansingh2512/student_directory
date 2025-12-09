import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, User, Code, Globe, Award } from 'lucide-react';
import { API_URL } from '../config';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        roll_number: '',
        email: '',
        name: '',
        section: 'A',
        github_username: '',
        leetcode_username: '',
        linkedin_url: '',
        figma_url: '',
        portfolio_url: '',
        skills_description: '',
        bio_description: '',
        moodle_username: '',
        moodle_password: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        let finalValue = value;
        if (['github_username', 'leetcode_username', 'email', 'roll_number'].includes(name)) {
            finalValue = value.trim();
        }

        setFormData(prev => ({ ...prev, [name]: finalValue }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const sanitizedData = Object.fromEntries(
                Object.entries(formData).map(([key, value]) => [key, value === '' ? null : value])
            );

            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sanitizedData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Registration failed');
            }

            navigate('/');
        } catch (error) {
            console.error("Registration error:", error);
            setErrors({ submit: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Ticket Container */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_180px] bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border-4 border-gray-900 overflow-hidden shadow-2xl">

                    {/* Main Ticket */}
                    <div className="p-8">
                        {/* Header */}
                        <div className="bg-gray-900 text-yellow-50 px-6 py-4 -mx-8 -mt-8 mb-8">
                            <div className="flex items-center gap-3">
                                <Ticket className="w-10 h-10" />
                                <div>
                                    <h1 className="text-3xl font-black tracking-wider">KIET STUDENT PASS</h1>
                                    <p className="text-sm text-yellow-200">Directory Registration</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Personal Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Passenger Info */}
                                <div className="md:col-span-2 border-4 border-gray-900 border-l-0 border-t-0 p-4">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Student Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full text-xl font-bold text-gray-900 bg-transparent border-none outline-none mt-1"
                                        placeholder="Enter full name "
                                    />
                                </div>

                                {/* Roll Number */}
                                <div className="border-4 border-gray-900 border-l-0 border-t-0 p-4">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Roll Number</label>
                                    <input
                                        type="text"
                                        name="roll_number"
                                        value={formData.roll_number}
                                        onChange={handleChange}
                                        required
                                        className="w-full text-lg font-bold text-gray-900 bg-transparent border-none outline-none mt-1"
                                        placeholder="202510116100063"
                                    />
                                </div>

                                {/* Email */}
                                <div className="border-4 border-gray-900 border-t-0 border-r-0 p-4">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full text-lg font-bold text-gray-900 bg-transparent border-none outline-none mt-1"
                                        placeholder="student@gmail.com"
                                    />
                                </div>

                                {/* GitHub */}
                                <div className="border-4 border-gray-900 border-l-0 border-t-0 p-4">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                                        <Code className="w-3 h-3" /> GitHub
                                    </label>
                                    <input
                                        type="text"
                                        name="github_username"
                                        value={formData.github_username}
                                        onChange={handleChange}
                                        className="w-full text-lg font-bold text-gray-900 bg-transparent border-none outline-none mt-1"
                                        placeholder="username (ayushmansingh2512) notlink"
                                    />
                                </div>

                                {/* LeetCode */}
                                <div className="border-4 border-gray-900 border-t-0 border-r-0 p-4">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                                        <Award className="w-3 h-3" /> LeetCode
                                    </label>
                                    <input
                                        type="text"
                                        name="leetcode_username"
                                        value={formData.leetcode_username}
                                        onChange={handleChange}
                                        className="w-full text-lg font-bold text-gray-900 bg-transparent border-none outline-none mt-1"
                                        placeholder="username (ayushmansingh2512) notlink"
                                    />
                                </div>

                                {/* LinkedIn */}
                                <div className="border-4 border-gray-900 border-l-0 border-t-0 p-4">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">LinkedIn</label>
                                    <input
                                        type="url"
                                        name="linkedin_url"
                                        value={formData.linkedin_url}
                                        onChange={handleChange}
                                        className="w-full text-sm font-semibold text-gray-900 bg-transparent border-none outline-none mt-1"
                                        placeholder="linkedin.com/in/..."
                                    />
                                </div>

                                {/* Portfolio */}
                                <div className="border-4 border-gray-900 border-t-0 border-r-0 p-4">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                                        <Globe className="w-3 h-3" /> Portfolio
                                    </label>
                                    <input
                                        type="url"
                                        name="portfolio_url"
                                        value={formData.portfolio_url}
                                        onChange={handleChange}
                                        className="w-full text-sm font-semibold text-gray-900 bg-transparent border-none outline-none mt-1"
                                        placeholder="yoursite.com"
                                    />
                                </div>

                                {/* Skills */}
                                <div className="md:col-span-2 border-4 border-gray-900 border-l-0 border-t-0 border-r-0 p-4">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Skills & Expertise</label>
                                    <textarea
                                        name="skills_description"
                                        value={formData.skills_description}
                                        onChange={handleChange}
                                        rows={2}
                                        className="w-full text-sm font-medium text-gray-900 bg-transparent border-none outline-none mt-1 resize-none"
                                        placeholder="React, Python, UI/UX Design..."
                                    />
                                </div>
                            </div>

                            {/* Moodle Credentials */}
                            <div className="md:col-span-2 border-4 border-gray-900 border-l-0 border-t-0 border-r-0 p-4 bg-yellow-100/50">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">Moodle Credentials (Optional)</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            type="text"
                                            name="moodle_username"
                                            value={formData.moodle_username}
                                            onChange={handleChange}
                                            className="w-full text-sm font-bold text-gray-900 bg-transparent border-b-2 border-gray-400 focus:border-gray-900 outline-none py-2"
                                            placeholder="Moodle Username"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            name="moodle_password"
                                            value={formData.moodle_password}
                                            onChange={handleChange}
                                            className="w-full text-sm font-bold text-gray-900 bg-transparent border-b-2 border-gray-400 focus:border-gray-900 outline-none py-2"
                                            placeholder="Moodle Password"
                                            type="password"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Fine Print */}
                            <div className="text-xs font-mono leading-relaxed text-gray-600 pt-4 border-t-2 border-dotted border-gray-400">
                                <p>Registration grants you access to the KIET Student Directory. Your profile will be visible to all students and faculty.</p>
                                <p className="mt-2 pt-2 border-t border-dotted border-gray-400">
                                    This registration is Non-refundable • Noodle Lab
                                </p>                <p className="mt-2 pt-2 border-t border-dotted border-gray-400">
                                    Also please insert you name usename and not link on leetcode & github textbox
                                </p>
                            </div>

                            {errors.submit && (
                                <div className="p-4 bg-red-100 border-2 border-red-600 text-red-800 rounded-lg text-sm font-semibold">
                                    {errors.submit}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gray-900 text-yellow-50 py-4 rounded-lg font-black text-lg tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'PROCESSING...' : 'COMPLETE REGISTRATION'}
                            </button>
                        </form>
                    </div>

                    {/* Side Stub */}
                    <div className="hidden lg:block bg-gradient-to-b from-red-500 to-red-600 border-l-4 border-dashed border-gray-900 p-4 relative">
                        <div className="h-full gap-7 flex flex-col items-center justify-between py-6">
                            <div className="bg-gray-900  text-yellow-50 px-3 py-8 font-black text-lg tracking-widest text-center">
                                KIET PASS
                            </div>

                            <div className="border-4 border-gray-900 p-3 bg-yellow-50 w-full text-center">
                                <div className="text-xs font-bold text-red-600">SECTION</div>
                                <select
                                    name="section"
                                    value={formData.section}
                                    onChange={handleChange}
                                    className="w-full text-2xl font-black text-gray-900 bg-transparent border-none outline-none mt-1 text-center"
                                >
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                </select>
                            </div>

                            <div className="border-4 border-gray-900 border-t-0 p-3 bg-yellow-50 w-full text-center">
                                <div className="text-xs font-bold text-red-600">YEAR</div>
                                <div className="text-lg font-black text-gray-900">2025</div>
                            </div>

                            {/* Barcode */}
                            <div className="mt-auto w-full">
                                <div className="h-20 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-[length:4px_100%] bg-repeat-x"></div>
                                <div className="text-center text-xs font-mono font-bold text-yellow-50 mt-2 tracking-widest">
                                    {formData.roll_number || '000000000'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Section Selector */}
                <div className="lg:hidden mt-6 bg-red-500 rounded-xl border-4 border-gray-900 p-6">
                    <label className="text-sm font-bold text-yellow-50 uppercase tracking-wider block mb-2">Select Section</label>
                    <select
                        name="section"
                        value={formData.section}
                        onChange={handleChange}
                        className="w-full text-3xl font-black text-gray-900 bg-yellow-50 border-4 border-gray-900 rounded-lg p-4"
                    >
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                        <option value="C">Section C</option>
                        <option value="D">Section D</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Register;
