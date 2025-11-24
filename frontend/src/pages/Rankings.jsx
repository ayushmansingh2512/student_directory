import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, GitBranch, Code2 } from 'lucide-react';
import clsx from 'clsx';
import { API_URL } from '../config';

const Rankings = () => {
    const [activeTab, setActiveTab] = useState('github');
    const [githubRankings, setGithubRankings] = useState([]);
    const [leetcodeRankings, setLeetcodeRankings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRankings();
    }, []);

    const fetchRankings = async () => {
        setLoading(true);
        try {
            const [githubRes, leetcodeRes] = await Promise.all([
                fetch(`${API_URL}/api/rankings/github`),
                fetch(`${API_URL}/api/rankings/leetcode`)
            ]);

            if (githubRes.ok) {
                const githubData = await githubRes.json();
                setGithubRankings(githubData);
            }

            if (leetcodeRes.ok) {
                const leetcodeData = await leetcodeRes.json();
                setLeetcodeRankings(leetcodeData);
            }
        } catch (error) {
            console.error('Error fetching rankings:', error);
        } finally {
            setLoading(false);
        }
    };

    const RankingCard = ({ student, rank, type }) => {
        const value = type === 'github' ? student.github_commits_count : student.leetcode_points;
        const username = type === 'github' ? student.github_username : student.leetcode_username;

        const rankColors = {
            1: 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white',
            2: 'bg-gradient-to-br from-gray-300 to-gray-400 text-white',
            3: 'bg-gradient-to-br from-orange-400 to-orange-500 text-white',
        };

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: rank * 0.05 }}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
            >
                <div className={clsx(
                    "flex items-center justify-center w-10 h-10 rounded-full font-extrabold text-lg",
                    rankColors[rank] || 'bg-gray-100 text-gray-600'
                )}>
                    {rank}
                </div>

                <div className="flex-1">
                    <h3 className="font-semibold text-lg text-text-main">{student.name}</h3>
                    <p className="text-sm text-text-light">
                        {username ? `@${username}` : 'No username'} • {student.section}
                    </p>
                </div>

                <div className="text-right">
                    <div className="text-3xl font-bold text-accent">{value || 0}</div>
                    <div className="text-xs text-text-light">
                        {type === 'github' ? 'commits' : 'points'}
                    </div>
                </div>
            </motion.div>
        );
    };

    const currentRankings = activeTab === 'github' ? githubRankings : leetcodeRankings;

    return (
        <div className="bg-bg-light">
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 text-center"
                >
                    <div className="inline-flex items-center gap-3 mb-4 p-3 bg-accent/10 rounded-full">
                        <Trophy className="w-8 h-8 text-accent" />
                        <h1 className="text-4xl font-extrabold text-text-main">Rankings Dashboard</h1>
                    </div>
                    <p className="text-lg text-text-light max-w-2xl mx-auto">
                        Track and celebrate the achievements of our top students in competitive programming and development.
                    </p>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex justify-center mb-8"
                >
                    <div className="relative flex items-center p-1 bg-gray-100 rounded-full shadow-inner">
                        {['github', 'leetcode'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={clsx(
                                    "relative z-10 flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-lg transition-all duration-300",
                                    activeTab === tab ? "text-green-600" : "text-text-light hover:text-text-main"
                                )}
                            >
                                {tab === 'github' ? <GitBranch className="w-5 h-5" /> : <Code2 className="w-5 h-5" />}
                                {tab === 'github' ? 'GitHub Rankings' : 'LeetCode Rankings'}
                            </button>
                        ))}
                        <motion.div
                            layout
                            className={clsx(
                                "absolute h-full w-1/2 rounded-full bg-gradient-to-br from-accent-dark to-accent shadow-md",
                                activeTab === 'github' ? "left-0" : "right-0"
                            )}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    </div>
                </motion.div>

                {/* Rankings Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-accent"></div>
                    </div>
                ) : (
                    <div>
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex items-center gap-4 mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
                        >
                            <div className={clsx(
                                "p-3 rounded-lg",
                                activeTab === 'github' ? 'bg-purple-500' : 'bg-orange-500'
                            )}>
                                {activeTab === 'github' ? (
                                    <GitBranch className="w-6 h-6 text-white" />
                                ) : (
                                    <Code2 className="w-6 h-6 text-white" />
                                )}
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-text-main">
                                    {activeTab === 'github' ? 'GitHub Rankings' : 'LeetCode Rankings'}
                                </h2>
                                <p className="text-base text-text-light" style={{ color: activeTab === 'github' ? 'green' : 'orange' }}>
                                    {activeTab === 'github'
                                        ? 'Top contributors by commits'
                                        : 'Top problem solvers by points'}
                                </p>
                            </div>
                        </motion.div>

                        {/* Rankings List */}
                        <div className="space-y-4">
                            {currentRankings.length > 0 ? (
                                currentRankings.map((student, index) => (
                                    <RankingCard
                                        key={student.id}
                                        student={student}
                                        rank={index + 1}
                                        type={activeTab}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
                                    <p className="text-xl text-text-light ">
                                        No {activeTab === 'github' ? 'GitHub' : 'LeetCode'} rankings available yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Rankings;
