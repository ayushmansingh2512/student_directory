import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const SectionTabs = ({ activeSection, onSectionChange }) => {
    const sections = ['A', 'B', 'C', 'D'];

    return (
        <div className="flex justify-center border-b border-gray-200 mb-8">
            <div className="flex items-center gap-4">
                {sections.map((section) => (
                    <div key={section} className="relative">
                        <motion.button
                            onClick={() => onSectionChange(section)}
                            whileTap={{ scale: 0.95 }}
                            className={clsx(
                                'px-6 py-3 font-semibold text-lg transition-colors duration-300 whitespace-nowrap',
                                {
                                    'text-accent': activeSection === section,
                                    'text-text-light hover:text-text-main': activeSection !== section,
                                }
                            )}
                        >
                            Section {section}
                        </motion.button>
                        {activeSection === section && (
                            <motion.div
                                layoutId="active-tab-indicator"
                                className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-t-full"
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SectionTabs;