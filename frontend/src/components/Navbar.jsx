import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className=" w-[90vw] flex items-center justify-between align-middle">
            <div className="flex w-[60vw] justify-between ">
                {/* Logo */}
                <Link
                    to="/"
                    className=""
                >
                    KIETMap
                </Link>

                {/* Desktop Navigation */}
                <div className=" ">
                    
                    <Link
                        to="/rankings"
                        className=" "
                    >
                        Rankings
                        <span className=" "></span>
                    </Link>
                </div>

                {/* Right Section - Desktop Button & Mobile Menu Button */}
                <div className="">
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