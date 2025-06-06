import React, { useState, useRef } from 'react'
import { useAppContext } from '../context/AppContext';
import { NavLink } from 'react-router-dom';
import { IoPersonSharp } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropup } from "react-icons/io";

function Navbar() {

    const { user, navigate, logout, astrologer } = useAppContext();
    const [open, setOpen] = useState(false);
    const [drop, setDrop] = useState(false);

    return (
        <nav className="top-0 z-50 backdrop-blur-md bg-gray-900 border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <NavLink to="/" className="flex items-center space-x-2">
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                AstroUniverse
                            </span>
                        </NavLink>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <NavLink to="/" className={({ isActive }) =>
                            `text-sm font-medium transition-colors duration-200 ${isActive
                                ? "text-purple-400"
                                : "text-gray-300 hover:text-purple-400"
                            }`
                        }>Home</NavLink>
                        {!astrologer && (
                            <div className='space-x-8'>
                                <NavLink to="/home-astrologer" className={({ isActive }) =>
                                    `text-sm font-medium transition-colors duration-200 ${isActive
                                        ? "text-purple-400"
                                        : "text-gray-300 hover:text-purple-400"
                                    }`
                                }>All Astrologers</NavLink>
                                <NavLink to="/chat-with-astrologer" className={({ isActive }) =>
                                    `text-sm font-medium transition-colors duration-200 ${isActive
                                        ? "text-purple-400"
                                        : "text-gray-300 hover:text-purple-400"
                                    }`
                                }>Chat With Astrologer</NavLink>
                            </div>
                        )}
                        {astrologer && (
                            <div>
                                <NavLink to="/chat-with-client" className={({ isActive }) =>
                                    `text-sm font-medium transition-colors duration-200 ${isActive
                                        ? "text-purple-400"
                                        : "text-gray-300 hover:text-purple-400"
                                    }`
                                }>Chat With Client</NavLink>
                            </div>
                        )}

                        {(!user && !astrologer) ? (
                            <button
                                onClick={() => navigate("/user-login")}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                            >
                                Login
                            </button>
                        ) : (
                            <div className="relative group">
                                <button onClick={() => setDrop(prev => !prev)} className="flex items-center text-2xl font-medium text-gray-300 hover:text-purple-400">
                                    <IoPersonSharp />
                                    {drop ? (
                                        <IoMdArrowDropup />
                                    ) : (
                                        <IoMdArrowDropdown />
                                    )}
                                </button>
                                {drop && (<div className="absolute right-0 w-32 mt-2 origin-top-right bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transform opacity-100 scale-100 transition-all duration-200">
                                    <div className="py-1">
                                        {user && (
                                            <button
                                                onClick={() => navigate("/profile")}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                                            >
                                                My Profile
                                            </button>
                                        )}
                                        {astrologer && (
                                            <button
                                                onClick={() => navigate("/astrologer-profile")}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                                            >
                                                My Profile
                                            </button>
                                        )}
                                        <button
                                            onClick={() => {
                                                logout();
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>)}
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setOpen(!open)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-purple-400 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {open ? (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`${open ? 'block' : 'hidden'} md:hidden`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800 border-t border-gray-700">
                    <NavLink to="/" onClick={() => setOpen(false)} className={({ isActive }) =>
                        `block px-3 py-2 rounded-md text-base font-medium ${isActive
                            ? "text-purple-400 bg-purple-900/50"
                            : "text-gray-300 hover:text-purple-400 hover:bg-gray-700/50"
                        }`
                    }>Home</NavLink>
                    {!astrologer && (
                        <div>
                            <NavLink to="/home-astrologer" onClick={() => setOpen(false)} className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                    ? "text-purple-400 bg-purple-900/50"
                                    : "text-gray-300 hover:text-purple-400 hover:bg-gray-700/50"
                                }`
                            }>All Astrologers</NavLink>
                            <NavLink to="/chat-with-astrologer" onClick={() => setOpen(false)} className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                    ? "text-purple-400 bg-purple-900/50"
                                    : "text-gray-300 hover:text-purple-400 hover:bg-gray-700/50"
                                }`
                            }>Chat With Astrologer</NavLink>
                        </div>
                    )}
                    {astrologer && (
                        <div>
                            <NavLink to="/chat-with-client" onClick={() => setOpen(false)} className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                    ? "text-purple-400 bg-purple-900/50"
                                    : "text-gray-300 hover:text-purple-400 hover:bg-gray-700/50"
                                }`
                            }>Chat With Client</NavLink>
                        </div>
                    )}

                    {user && (
                        <NavLink to="/profile" onClick={() => setOpen(false)} className={({ isActive }) =>
                            `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                ? "text-purple-400 bg-purple-900/50"
                                : "text-gray-300 hover:text-purple-400 hover:bg-gray-700/50"
                            }`
                        }>My Profile</NavLink>
                    )}
                    {astrologer && (
                        <NavLink to="/astrologer-profile" onClick={() => setOpen(false)} className={({ isActive }) =>
                            `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                ? "text-purple-400 bg-purple-900/50"
                                : "text-gray-300 hover:text-purple-400 hover:bg-gray-700/50"
                            }`
                        }>My Profile</NavLink>
                    )}

                    {(!user && !astrologer) ? (
                        <button
                            onClick={() => { setOpen(false); navigate("/user-login") }}
                            className="w-full mt-4 px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                            Login
                        </button>
                    ) : (
                        <button
                            onClick={() => { logout(); setOpen(false) }}
                            className="w-full mt-4 px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar