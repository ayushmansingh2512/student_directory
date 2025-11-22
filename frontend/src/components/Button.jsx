import React from 'react';
import { twMerge } from 'tailwind-merge';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className,
    ...props
}) => {
    const baseStyles = "font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-lg font-sans";

    const variants = {
        primary: "bg-orange-600 text-white hover:bg-orange-700 shadow-lg hover:shadow-xl",
        secondary: "bg-white text-gray-900 border-2 border-gray-300 hover:border-gray-400",
        ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
        outline: "border-2 border-orange-600 text-orange-600 hover:bg-orange-50",
        danger: "bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl",
    };

    const sizes = {
        sm: "px-4 py-1.5 text-sm",
        md: "px-6 py-2.5 text-base",
        lg: "px-8 py-3 text-lg",
    };

    return (
        <button
            className={twMerge(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;