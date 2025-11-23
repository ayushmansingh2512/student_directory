import React from 'react';
import { twMerge } from 'tailwind-merge';

const Badge = ({ children, variant = 'default', className }) => {
    const variants = {
        default: "bg-gray-100 text-gray-800",
        success: "bg-green-100 text-green-800",
        warning: "bg-yellow-100 text-yellow-800",
        accent: "bg-orange-50 text-orange-700 border border-orange-200",
        primary: "bg-orange-100 text-orange-900",
        blue: "bg-blue-100 text-blue-900",
    };

    return (
        <span className={twMerge(
            " ",
            variants[variant],
            className
        )}>
            {children}
        </span>
    );
};

export default Badge;