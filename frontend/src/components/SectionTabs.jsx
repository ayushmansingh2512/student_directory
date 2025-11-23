import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const SectionTabs = ({ activeSection, onSectionChange }) => {
    const sections = ['A', 'B', 'C', 'D'];

    return (
        <div className="flex justify-center mb-8">
            <div className="relative inline-flex bg-gray-900 rounded-xl border-4 border-gray-900 p-1">
                {sections.map((section) => (
                    <button
                        key={section}
                        onClick={() => onSectionChange(section)}
                        className={clsx(
                            'relative z-10 px-8 py-3 rounded-lg font-black text-lg uppercase tracking-wider transition-all duration-300',
                            activeSection === section
                                ? 'text-gray-900'
                                : 'text-yellow-50 hover:text-yellow-300'
                        )}
                    >
                        Sec {section}
                    </button>
                ))}
                <motion.div
                    layout
                    className="absolute h-[calc(100%-8px)] w-[calc(25%-4px)] rounded-lg bg-yellow-400 border-2 border-gray-900 shadow-lg"
                    style={{
                        left: `${sections.indexOf(activeSection) * 25 + 1}%`
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
            </div>
        </div>
    );
};

export default SectionTabs;