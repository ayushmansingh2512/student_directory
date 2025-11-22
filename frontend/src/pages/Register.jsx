import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import Button from '../components/Button';
import { Upload } from 'lucide-react';

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
        // Auto-trim whitespace for username fields to prevent copy-paste errors
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
            // Convert empty strings to null for Pydantic validation
            const sanitizedData = Object.fromEntries(
                Object.entries(formData).map(([key, value]) => [key, value === '' ? null : value])
            );

            const response = await fetch('http://localhost:8000/api/auth/register', {
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

            // Success
            navigate('/');
        } catch (error) {
            console.error("Registration error:", error);
            setErrors({ submit: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-light">
            <Navbar />

            <main className="pt-24 pb-12 max-w-3xl mx-auto px-4 sm:px-6">
                <div className="bg-white rounded-2xl shadow-sm border border-border-light p-6 sm:p-10">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-text-main">Student Registration</h1>
                        <p className="text-gray-500 mt-1">Join the directory to connect with peers.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Personal Info */}
                        <section className="space-y-4">
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-border-light pb-2">
                                Personal Information
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Input
                                    label="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Roll Number"
                                    name="roll_number"
                                    value={formData.roll_number}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Email Address"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-text-main">Section</label>
                                    <select
                                        name="section"
                                        value={formData.section}
                                        onChange={handleChange}
                                        className="px-4 py-2.5 rounded-lg border border-border-light bg-white text-text-main focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                                    >
                                        <option value="A">Section A</option>
                                        <option value="B">Section B</option>
                                        <option value="C">Section C</option>
                                        <option value="D">Section D</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Profiles */}
                        <section className="space-y-4">
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-border-light pb-2">
                                Coding Profiles
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Input
                                    label="GitHub Username"
                                    name="github_username"
                                    value={formData.github_username}
                                    onChange={handleChange}
                                    placeholder="e.g. octocat"
                                />
                                <Input
                                    label="LeetCode Username"
                                    name="leetcode_username"
                                    value={formData.leetcode_username}
                                    onChange={handleChange}
                                    placeholder="e.g. leetcode_user"
                                />
                            </div>
                        </section>

                        {/* Social & Portfolio */}
                        <section className="space-y-4">
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-border-light pb-2">
                                Social & Portfolio
                            </h2>
                            <div className="space-y-4">
                                <Input
                                    label="LinkedIn Profile URL"
                                    name="linkedin_url"
                                    value={formData.linkedin_url}
                                    onChange={handleChange}
                                    placeholder="https://linkedin.com/in/..."
                                />
                                <Input
                                    label="Figma Profile URL"
                                    name="figma_url"
                                    value={formData.figma_url}
                                    onChange={handleChange}
                                    placeholder="https://figma.com/@..."
                                />
                                <Input
                                    label="Portfolio Website URL"
                                    name="portfolio_url"
                                    value={formData.portfolio_url}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                />
                            </div>
                        </section>

                        {/* Bio */}
                        <section className="space-y-4">
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-border-light pb-2">
                                About You
                            </h2>
                            <div className="space-y-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-text-main">Skills & Expertise</label>
                                    <textarea
                                        name="skills_description"
                                        value={formData.skills_description}
                                        onChange={handleChange}
                                        rows={3}
                                        className="px-4 py-2.5 rounded-lg border border-border-light bg-white text-text-main placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none"
                                        placeholder="React, Python, UI Design..."
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-text-main">Bio</label>
                                    <textarea
                                        name="bio_description"
                                        value={formData.bio_description}
                                        onChange={handleChange}
                                        rows={4}
                                        className="px-4 py-2.5 rounded-lg border border-border-light bg-white text-text-main placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none"
                                        placeholder="Tell us a bit about yourself..."
                                    />
                                </div>
                            </div>
                        </section>

                        {errors.submit && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                                {errors.submit}
                            </div>
                        )}

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                                {loading ? 'Registering...' : 'Complete Registration'}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Register;
