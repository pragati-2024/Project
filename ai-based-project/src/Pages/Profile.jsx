// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { CameraIcon, EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import API from '../api.jsx';

const Profile = () => {
  const [user, setUser] = useState({
    UserName: '',
    Email: '',
    profileImage: ''
  });
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(min-width: 768px)').matches;
  });
  const [avatarError, setAvatarError] = useState(false);
  const [password, setPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(prev => ({
          ...prev,
          UserName: parsedUser.UserName || '',
          Email: parsedUser.Email || '',
          profileImage: parsedUser.profileImage || ''
        }));
      }
    } catch (err) {
      console.error('Error parsing user data:', err);
    }

    // Also refresh from backend so profile stays consistent across devices
    (async () => {
      try {
        const res = await API.get('/me');
        if (res?.data?.user) {
          const backendUser = res.data.user;
          setUser((prev) => ({
            ...prev,
            UserName: backendUser.UserName || prev.UserName,
            Email: backendUser.Email || prev.Email,
            profileImage: backendUser.profileImage || prev.profileImage,
          }));
          localStorage.setItem('user', JSON.stringify(backendUser));
          window.dispatchEvent(new Event('user-updated'));
        }
      } catch {
        // ignore: app should still work offline
      }
    })();
  }, [navigate]);

  const handleSave = async () => {
    setSaveError('');
    setIsSaving(true);
    try {
      const payload = {
        UserName: user.UserName,
        Email: user.Email,
        profileImage: user.profileImage,
      };
      if (password && password.trim()) payload.Password = password;

      const res = await API.put('/me', payload);
      const updated = res?.data?.user;
      if (!updated) throw new Error('Profile update failed');

      setUser((prev) => ({
        ...prev,
        UserName: updated.UserName || prev.UserName,
        Email: updated.Email || prev.Email,
        profileImage: updated.profileImage || prev.profileImage,
      }));

      localStorage.setItem('user', JSON.stringify(updated));
      window.dispatchEvent(new Event('user-updated'));

      setPassword('');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      setSaveError(err?.response?.data?.message || err?.message || 'Unable to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setSaveError('Please select an image under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setUser(prev => ({ ...prev, profileImage: event.target.result }));
        setAvatarError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  if (!user) return null; // or loading spinner

  const initials = String(user?.UserName || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('') || 'U';

  return (
    <div className="flex min-h-screen bg-transparent text-slate-900 dark:bg-gray-900 dark:text-white radial-background">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className={`flex-1 p-4 sm:p-6 md:p-8 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'} `}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-md mx-auto bg-gray-800 rounded-3xl shadow-2xl overflow-hidden md:max-w-2xl border border-gray-700">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="p-8"
            >
              <div className="flex flex-col items-center justify-center mb-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  {!avatarError && user.profileImage ? (
                    <img
                      className="h-32 w-32 rounded-full object-cover border-4 border-gray-700 shadow-lg"
                      src={user.profileImage}
                      alt="Profile"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <div className="h-32 w-32 rounded-full border-4 border-gray-700 shadow-lg bg-gray-700 flex items-center justify-center text-3xl font-bold text-gray-200 select-none">
                      {initials}
                    </div>
                  )}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center cursor-pointer"
                  >
                    <label htmlFor="profile-upload" className="cursor-pointer">
                      <CameraIcon className="h-8 w-8 text-gray-300" />
                      <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  </motion.div>
                </motion.div>
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 text-2xl font-bold text-gray-100"
                >
                  {user.UserName || 'Your Name'}
                </motion.h2>
              </div>

              <div className="space-y-6">
                {saveError && (
                  <div className="rounded border border-red-500/40 bg-red-500/10 text-red-200 px-4 py-3 text-sm">
                    {saveError}
                  </div>
                )}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="relative"
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="UserName"
                    value={user.UserName}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Full Name"
                  />
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="relative"
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    name="Email"
                    value={user.Email}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Email Address"
                  />
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="relative"
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="New Password"
                  />
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="pt-4"
                >
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white ${isSaving ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.01]`}
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : saveSuccess ? (
                      <span className="flex items-center">
                        <svg className="h-5 w-5 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Saved Successfully!
                      </span>
                    ) : (
                      'Save Profile'
                    )}
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;