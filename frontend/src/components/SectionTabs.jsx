import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const SectionTabs = ({ activeSection, onSectionChange }) => {
    const sections = ["A", "B", "C", "D"];

    return (
        <div className="flex justify-center mb-6 sm:mb-8 w-full px-2">
            <div className="relative flex w-full max-w-md bg-gray-900 rounded-xl border-4 border-gray-900 p-1">
                
                {sections.map((section, index) => (
                    <button
                        key={section}
                        onClick={() => onSectionChange(section)}
                        className={clsx(
                            "relative z-10 flex-1 py-2 sm:py-3 rounded-lg font-extrabold uppercase tracking-wide transition-all duration-300",
                            "text-sm sm:text-base md:text-lg",
                            activeSection === section
                                ? "text-gray-900"
                                : "text-yellow-50 hover:text-yellow-300"
                        )}
                    >
                        Sec {section}
                    </button>
                ))}

                <motion.div
                    layout
                    className="absolute top-1 bottom-1 rounded-lg bg-yellow-400 border-2 border-gray-900 shadow-lg"
                    style={{
                        width: `calc(${100 / sections.length}% - 4px)`,
                        left: `calc(${(100 / sections.length) * sections.indexOf(activeSection)}% + 2px)`
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
            </div>
        </div>
    );
};

export default SectionTabs;