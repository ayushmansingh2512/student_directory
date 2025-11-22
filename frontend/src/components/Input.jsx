import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = React.forwardRef(({ label, error, className, ...props }, ref) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label className="text-sm font-medium text-text-main">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                className={twMerge(
                    "px-4 py-2.5 rounded-lg border border-border-light bg-white text-text-main placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors",
                    error && "border-red-500 focus:border-red-500 focus:ring-red-500",
                    className
                )}
                {...props}
            />
            {error && (
                <span className="text-xs text-red-500">{error}</span>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
