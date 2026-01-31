import React from "react";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Profile from './Profile.jsx';

const Header = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

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

  return (
    <>
      <div className="bg-glow"></div>

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
    </>
  );
};

export default Header;
