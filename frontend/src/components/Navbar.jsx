import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="  h-20 bg-white/95 backdrop-blur-xl border-b border-gray-200 z-50 transition-all duration-300 shadow-sm">
            <div className="flex">
                {/* Logo */}
                <Link
                    to="/"
                    className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent tracking-tight hover:opacity-80 transition-opacity"
                >
                    KIETMap
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    
                    <Link
                        to="/rankings"
                        className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors relative group"
                    >
                        Rankings
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                </div>

                {/* Right Section - Desktop Button & Mobile Menu Button */}
                <div className="flex items-center gap-4">
                    <Link to="/register" className="hidden md:block">
                        <Button variant="primary" size="md">
                            Register Student
                        </Button>
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Toggle mobile menu"
                    >
                        {mobileMenuOpen ? (
                            <X size={24} className="text-gray-700" />
                        ) : (
                            <Menu size={24} className="text-gray-700" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={clsx(
                    "md:hidden bg-white border-b border-gray-200 transition-all ease-out duration-300 overflow-hidden",
                    mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                )}
            >
                <div className="px-6 py-4 space-y-4">
                    <Link
                        to="/"
                        className="block text-base font-medium text-gray-700 hover:text-orange-600 transition-colors py-2"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Students
                    </Link>
                    <Link
                        to="/rankings"
                        className="block text-base font-medium text-gray-700 hover:text-orange-600 transition-colors py-2"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Rankings
                    </Link>
                    <Link
                        to="/register"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <Button variant="primary" size="md" className="w-full mt-2">
                            Register Student
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;