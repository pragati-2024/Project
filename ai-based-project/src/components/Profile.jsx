import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false);
    const [avatarError, setAvatarError] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            navigate('/login');
            return;
        }

        try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setAvatarError(false);
        } catch (err) {
            console.error('Error parsing user data:', err);
        }
    }, [navigate]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    const initials = String(user?.UserName || '')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p.charAt(0).toUpperCase())
        .join('') || 'U';

    const avatarSrc = !avatarError ? (user.profileImage || user.avatar || '') : '';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.dispatchEvent(new Event('user-updated'));
        navigate('/login');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="flex items-center space-x-2 focus:outline-none"
                onClick={() => setOpen((prev) => !prev)}
            >
                {avatarSrc ? (
                    <img
                        src={avatarSrc}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                        onError={() => setAvatarError(true)}
                    />
                ) : (
                    <div
                        className="w-10 h-10 rounded-full bg-slate-600/80 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold text-white select-none"
                        aria-label="User avatar"
                    >
                        {initials}
                    </div>
                )}
                <span className="text-slate-900 dark:text-white">{user.UserName}</span>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white/90 dark:bg-gray-800 text-slate-900 dark:text-white rounded shadow-lg z-10 border border-slate-200/70 dark:border-gray-700 backdrop-blur">
                    <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-slate-100/70 dark:hover:bg-gray-700"
                        onClick={() => setOpen(false)}
                    >
                        Profile
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-slate-100/70 dark:hover:bg-gray-700"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default Profile;
