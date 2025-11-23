import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import { Menu, X, Ticket } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="w-full bg-gray-900 border-b-4 border-yellow-400 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2 text-yellow-50 hover:text-yellow-300 transition-colors"
                >
                    <Ticket className="w-8 h-8" />
                    <span className="text-2xl font-black tracking-wider">KIETrain</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    <Link
                        to="/"
                        className="text-base font-bold text-yellow-50 hover:text-yellow-300 transition-colors uppercase tracking-wide"
                    >
                        Students
                    </Link>
                    <Link
                        to="/rankings"
                        className="text-base font-bold text-yellow-50 hover:text-yellow-300 transition-colors uppercase tracking-wide"
                    >
                        Rankings
                    </Link>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    <Link to="/register" className="hidden md:block">
                        <button className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-black uppercase tracking-wide hover:bg-yellow-300 transition-colors border-2 border-gray-900">
                            Register
                        </button>
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
                        aria-label="Toggle mobile menu"
                    >
                        {mobileMenuOpen ? (
                            <X size={24} className="text-yellow-50" />
                        ) : (
                            <Menu size={24} className="text-yellow-50" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={clsx(
                    "absolute top-full left-0 right-0 md:hidden bg-gray-900 border-b-4 border-yellow-400 transition-all ease-out duration-300 overflow-hidden",
                    mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                )}
            >
                <div className="px-6 py-4 space-y-4">
                    <Link
                        to="/"
                        className="block text-base font-bold text-yellow-50 hover:text-yellow-300 transition-colors py-2 uppercase tracking-wide"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Students
                    </Link>
                    <Link
                        to="/rankings"
                        className="block text-base font-bold text-yellow-50 hover:text-yellow-300 transition-colors py-2 uppercase tracking-wide"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Rankings
                    </Link>
                    <Link
                        to="/register"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <button className="w-full bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-black uppercase tracking-wide hover:bg-yellow-300 transition-colors border-2 border-gray-900">
                            Register
                        </button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;