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
        bio_description: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        let finalValue = value;

        if (['github_username', 'leetcode_username', 'email', 'roll_number'].includes(name)) {
            finalValue = value.trim();
        }

        setFormData((prev) => ({ ...prev, [name]: finalValue }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sanitizedData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Registration failed');
            }

            navigate('/');
        } catch (error) {
            setErrors({ submit: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-4 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">

                {/* Mobile Section Selector */}
                <div className="lg:hidden my-6 bg-red-500 rounded-xl border-4 border-gray-900 p-4">
                    <label className="text-sm font-bold text-yellow-50">Select Section</label>
                    <select
                        name="section"
                        value={formData.section}
                        onChange={handleChange}
                        className="w-full text-2xl font-black mt-2 bg-yellow-50 border-4 border-gray-900 rounded-lg p-3"
                    >
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                        <option value="C">Section C</option>
                        <option value="D">Section D</option>
                    </select>
                     <div className="border-4 border-gray-900 p-3 bg-yellow-50 text-center rounded-lg my-4">
                            <div className="text-xs font-bold text-red-600">YEAR</div>
                            <div className="text-xl font-black">2025</div>
                        </div>
                </div>
                
                {/* Ticket Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_160px] bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border-4 border-gray-900 overflow-hidden shadow-xl">

                    {/* MAIN SECTION */}
                    <div className="p-5 sm:p-8">
                        <div className="bg-gray-900 text-yellow-50 px-4 py-4 sm:px-6 -mx-5 sm:-mx-8 -mt-5 sm:-mt-8 mb-6 sm:mb-8">
                            <div className="flex items-center gap-3">
                                <Ticket className="w-8 h-8 sm:w-10 sm:h-10" />
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-black tracking-wider">KIET STUDENT PASS</h1>
                                    <p className="text-xs sm:text-sm text-yellow-200">Directory Registration</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* GRID INPUTS */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* Name */}
                                <div className="md:col-span-2 border-4 border-gray-900 border-l-0 border-t-0 p-3 sm:p-4">
                                    <label className="text-xs font-bold text-gray-700 uppercase">Student Name</label>
                                    <input type="text" name="name" required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full text-lg sm:text-xl font-bold bg-transparent outline-none mt-1"
                                        placeholder="Enter full name"
                                    />
                                </div>

                                {/* Roll Number */}
                                <div className="border-4 border-gray-900 border-r-0 border-t-0 p-3 sm:p-4">
                                    <label className="text-xs font-bold text-gray-700 uppercase">Roll Number</label>
                                    <input type="text" name="roll_number" required
                                        value={formData.roll_number}
                                        onChange={handleChange}
                                        className="w-full text-lg font-bold bg-transparent outline-none mt-1"
                                        placeholder="202510116100063"
                                    />
                                </div>

                                {/* Email */}
                                <div className="border-4 border-gray-900 border-t-0 border-l-0 p-3 sm:p-4">
                                    <label className="text-xs font-bold text-gray-700 uppercase">Email</label>
                                    <input type="email" name="email" required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full text-lg font-bold bg-transparent outline-none mt-1"
                                        placeholder="student@gmail.com"
                                    />
                                </div>

                                {/* GitHub */}
                                <div className="border-4 border-gray-900 border-r-0 border-t-0 p-3 sm:p-4">
                                    <label className="text-xs font-bold uppercase flex items-center gap-1">
                                        <Code className="w-3 h-3" /> GitHub
                                    </label>
                                    <input type="text" name="github_username"
                                        value={formData.github_username}
                                        onChange={handleChange}
                                        className="w-full text-lg font-bold bg-transparent outline-none mt-1"
                                        placeholder="username only"
                                    />
                                </div>

                                {/* LeetCode */}
                                <div className="border-4 border-gray-900 border-t-0 border-l-0 p-3 sm:p-4">
                                    <label className="text-xs font-bold uppercase flex items-center gap-1">
                                        <Award className="w-3 h-3" /> LeetCode
                                    </label>
                                    <input type="text" name="leetcode_username"
                                        value={formData.leetcode_username}
                                        onChange={handleChange}
                                        className="w-full text-lg font-bold bg-transparent outline-none mt-1"
                                        placeholder="username only"
                                    />
                                </div>

                                {/* LinkedIn */}
                                <div className="border-4 border-gray-900 border-r-0 border-t-0 p-3 sm:p-4">
                                    <label className="text-xs font-bold uppercase">LinkedIn</label>
                                    <input type="url" name="linkedin_url"
                                        value={formData.linkedin_url}
                                        onChange={handleChange}
                                        className="w-full text-sm font-semibold bg-transparent outline-none mt-1"
                                        placeholder="linkedin.com/in/..."
                                    />
                                </div>

                                {/* Portfolio */}
                                <div className="border-4 border-gray-900 border-t-0 border-l-0 p-3 sm:p-4">
                                    <label className="text-xs font-bold uppercase flex items-center gap-1">
                                        <Globe className="w-3 h-3" /> Portfolio
                                    </label>
                                    <input type="url" name="portfolio_url"
                                        value={formData.portfolio_url}
                                        onChange={handleChange}
                                        className="w-full text-sm font-semibold bg-transparent outline-none mt-1"
                                        placeholder="yoursite.com"
                                    />
                                </div>

                                {/* Skills */}
                                <div className="md:col-span-2 border-4 border-gray-900 border-t-0 border-r-0 p-3 sm:p-4">
                                    <label className="text-xs font-bold uppercase">Skills & Expertise</label>
                                    <textarea
                                        name="skills_description"
                                        rows={2}
                                        value={formData.skills_description}
                                        onChange={handleChange}
                                        className="w-full text-sm font-medium bg-transparent outline-none mt-1 resize-none"
                                        placeholder="React, Python, UI/UX..."
                                    />
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


                            {/* Errors */}
                            {errors.submit && (
                                <div className="p-4 bg-red-100 border-2 border-red-600 text-red-800 rounded-lg text-sm font-semibold">
                                    {errors.submit}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gray-900 text-yellow-50 py-3 sm:py-4 rounded-lg font-black text-lg tracking-wider hover:bg-gray-800 disabled:opacity-50"
                            >
                                {loading ? 'PROCESSING...' : 'COMPLETE REGISTRATION'}
                            </button>
                        </form>
                    </div>

                    {/* SIDE STUB - Hidden on mobile */}
                    <div className="hidden lg:flex flex-col justify-between bg-red-500 border-l-4 border-dashed border-gray-900 p-4 gap-4">
                        <div className="bg-gray-900 text-yellow-50 px-3 py-6 font-black text-lg text-center">
                            KIET PASS
                        </div>

                        <div className="border-4 border-gray-900 p-3 bg-yellow-50 text-center">
                            <div className="text-xs font-bold text-red-600">SECTION</div>
                            <select
                                name="section"
                                value={formData.section}
                                onChange={handleChange}
                                className="w-full text-2xl font-black bg-transparent outline-none text-center"
                            >
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                            </select>
                        </div>

                        <div className="border-4 border-gray-900 border p-3 bg-yellow-50 text-center">
                            <div className="text-xs font-bold text-red-600">YEAR</div>
                            <div className="text-xl font-black">2025</div>
                        </div>

                        {/* Barcode */}
                        <div className="mt-auto w-full">
                            <div className="h-16 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-[length:4px_100%] bg-repeat-x"></div>
                            <div className="text-center text-xs font-mono font-bold text-yellow-50 mt-2 tracking-widest">
                                {formData.roll_number || '000000000'}
                            </div>
                        </div>
                    </div>
                </div>

                

            </div>
        </div>
    );
};

export default Register;
