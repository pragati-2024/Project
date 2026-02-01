import React from "react";
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Profile from './Profile.jsx';

const Header = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get user data from localStorage
    const sync = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (err) {
          console.error('Error parsing user data:', err);
        }
      } else {
        setUser(null);
      }
    };

    sync();
    window.addEventListener('storage', sync);
    window.addEventListener('user-updated', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('user-updated', sync);
    };
  }, []);

  useEffect(() => {
    const closeOnRoute = () => setMenuOpen(false);
    window.addEventListener('popstate', closeOnRoute);
    return () => window.removeEventListener('popstate', closeOnRoute);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const isMobile = () => window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
    if (!menuOpen || !isMobile()) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  return (
    <>
      <div className="bg-glow"></div>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[998] md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className={`header ${menuOpen ? 'menu-open' : ''}`}>
        <div className="logo">
          <h1>Mockneto</h1>
        </div>

        <div className="nav-right">
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-lg px-3 py-2 border border-slate-200/20 dark:border-white/10 bg-white/10 text-slate-900 dark:text-white"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className="text-sm font-semibold">Menu</span>
          </button>

          <div className="links">
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Practice Interview</Link>
            <Link to="/interviewtips" onClick={() => setMenuOpen(false)}>Interview Tips</Link>
            <Link to="/contactus" onClick={() => setMenuOpen(false)}>Contact Us</Link>
            <Link to="/aboutus" onClick={() => setMenuOpen(false)}>About Us</Link>
          </div>
          {user ? (
              <Profile />
        ) : (
          <div className="ftrial">
            <Link to="/login">Login</Link>
          </div>
        )}
        </div>
      </div>

      {menuOpen && (
        <div className="fixed left-0 right-0 top-[var(--header-height)] z-[1000] md:hidden px-4 pb-4">
          <div className="rounded-2xl border border-slate-200/20 dark:border-white/10 bg-white/90 dark:bg-[#0b0718]/90 backdrop-blur p-3 shadow-2xl max-h-[calc(100vh-var(--header-height)-16px)] overflow-auto">
            <nav className="flex flex-col gap-2">
              <Link className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-900 dark:text-white" to="/" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-900 dark:text-white" to="/dashboard" onClick={() => setMenuOpen(false)}>Practice Interview</Link>
              <Link className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-900 dark:text-white" to="/interviewtips" onClick={() => setMenuOpen(false)}>Interview Tips</Link>
              <Link className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-900 dark:text-white" to="/contactus" onClick={() => setMenuOpen(false)}>Contact Us</Link>
              <Link className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-900 dark:text-white" to="/aboutus" onClick={() => setMenuOpen(false)}>About Us</Link>
            </nav>

            <div className="mt-3 pt-3 border-t border-slate-200/30 dark:border-white/10">
              {user ? (
                <Profile />
              ) : (
                <Link
                  className="block text-center px-4 py-3 rounded-xl bg-gradient-to-r from-[#6648de] to-[#6a7ae7] text-white font-semibold"
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
