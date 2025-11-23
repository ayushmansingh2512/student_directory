import React from 'react';
import { twMerge } from 'tailwind-merge';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className,
    ...props
}) => {
    const baseStyles = " ";

    const variants = {
        primary: " ",
        secondary: " ",
        ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
        outline: " ",
        danger: " ",
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