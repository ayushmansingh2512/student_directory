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

            if (githubRes.ok) setGithubRankings(await githubRes.json());
            if (leetcodeRes.ok) setLeetcodeRankings(await leetcodeRes.json());

        } catch (error) {
            console.error('Error fetching rankings:', error);
        } finally {
            setLoading(false);
        }
    };

    const RankingCard = ({ student, rank, type }) => {
        const value = type === 'github'
            ? student.github_commits_count
            : student.leetcode_points;

        const username = type === 'github'
            ? student.github_username
            : student.leetcode_username;

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
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
            >
                {/* Rank Badge */}
                <div
                    className={clsx(
                        "flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full font-extrabold text-lg",
                        rankColors[rank] || "bg-gray-100 text-gray-600"
                    )}
                >
                    {rank}
                </div>

                {/* Student Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-lg truncate">{student.name}</h3>
                    <p className="text-xs sm:text-sm text-text-light truncate">
                        {username ? `@${username}` : "No username"} • {student.section}
                    </p>
                </div>

                {/* Score */}
                <div className="text-right">
                    <div className="text-xl sm:text-3xl font-bold text-accent">{value || 0}</div>
                    <div className="text-[10px] sm:text-xs text-text-light">
                        {type === "github" ? "commits" : "points"}
                    </div>
                </div>
            </motion.div>
        );
    };

    const currentRankings = activeTab === "github"
        ? githubRankings
        : leetcodeRankings;

    return (
        <div className="bg-bg-light min-h-screen">
            <main className="container mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 sm:mb-12 text-center"
                >
                    <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 p-2 sm:p-3 bg-accent/10 rounded-full">
                        <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
                        <h1 className="text-xl sm:text-4xl font-extrabold">Rankings Dashboard</h1>
                    </div>

                    <p className="text-xs sm:text-lg text-text-light max-w-sm sm:max-w-2xl mx-auto">
                        Track and celebrate coding achievements of top students.
                    </p>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center mb-6 sm:mb-10"
                >
                    <div className="relative flex items-center p-1 bg-gray-100 rounded-full w-full max-w-xs sm:max-w-md shadow-inner">
                        {["github", "leetcode"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={clsx(
                                    "relative z-10 w-1/2 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 rounded-full font-semibold text-xs sm:text-lg transition-all duration-300",
                                    activeTab === tab
                                        ? "text-green-600"
                                        : "text-text-light hover:text-text-main"
                                )}
                            >
                                {tab === "github" ? (
                                    <GitBranch className="w-4 h-4 sm:w-5 sm:h-5" />
                                ) : (
                                    <Code2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                )}
                                {tab === "github" ? "GitHub Ranking" : "LeetCode Ranking"}
                            </button>
                        ))}

                        {/* Sliding Indicator */}
                        <motion.div
                            layout
                            className={clsx(
                                "absolute h-full w-1/2 rounded-full bg-accent-dark shadow-md",
                                activeTab === "github" ? "left-0" : "right-0"
                            )}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    </div>
                </motion.div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-10 w-10 sm:h-14 sm:w-14 border-b-4 border-accent"></div>
                    </div>
                ) : (
                    <div>
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center gap-3 mb-5 p-3 sm:p-4 bg-white rounded-xl shadow-sm border border-gray-100"
                        >
                            <div
                                className={clsx(
                                    "p-2 sm:p-3 rounded-lg",
                                    activeTab === "github"
                                        ? "bg-purple-500"
                                        : "bg-orange-500"
                                )}
                            >
                                {activeTab === "github" ? (
                                    <GitBranch className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                ) : (
                                    <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                )}
                            </div>

                            <div>
                                <h2 className="text-lg sm:text-3xl font-bold">
                                    {activeTab === "github"
                                        ? "GitHub Rankings"
                                        : "LeetCode Rankings"}
                                </h2>
                                <p className="text-[10px] sm:text-base text-text-light">
                                    {activeTab === "github"
                                        ? "Top contributors by commits"
                                        : "Top solvers by points"}
                                </p>
                            </div>
                        </motion.div>

                        {/* Ranking List */}
                        <div className="space-y-3 sm:space-y-4">
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
                                <div className="text-center py-10 bg-white rounded-xl border shadow-sm">
                                    <p className="text-sm sm:text-lg text-text-light">
                                        No data available yet.
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
