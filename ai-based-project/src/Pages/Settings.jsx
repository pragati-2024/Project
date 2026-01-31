import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import API from '../api.jsx';

const SETTINGS_KEY = 'appSettings';

const defaultSettings = {
  emailNotifications: true,
  defaultDifficulty: 'Medium',
  preferredLanguage: 'English',
  autoPlayVoice: true,
};

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw);
    return { ...defaultSettings, ...(parsed || {}) };
  } catch {
    return defaultSettings;
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

const Settings = () => {
   const [sidebarOpen, setSidebarOpen] = useState(true);
   const { theme, setTheme, resolvedTheme } = useTheme();
   const [settings, setSettings] = useState(() => loadSettings());
   const [message, setMessage] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

   useEffect(() => {
     saveSettings(settings);
     window.dispatchEvent(new Event('settings-updated'));
   }, [settings]);

   // Load settings from backend (if logged in), then merge into local defaults
   useEffect(() => {
     const token = localStorage.getItem('token');
     if (!token) return;

     (async () => {
       try {
         setIsSyncing(true);
         const res = await API.get('/me');
         const backend = res?.data?.user?.settings;
         if (backend && typeof backend === 'object') {
           setSettings((s) => ({ ...s, ...backend }));
           if (backend.theme && ['light', 'dark', 'system'].includes(backend.theme)) {
             setTheme(backend.theme);
           }
         }
       } catch {
         // ignore (offline or backend not available)
       } finally {
         setIsSyncing(false);
       }
     })();
   }, [setTheme]);

   // Persist settings to backend (debounced) when logged in
   useEffect(() => {
     const token = localStorage.getItem('token');
     if (!token) return;

     const toSave = {
       ...settings,
       theme,
     };

     const t = setTimeout(async () => {
       try {
         setIsSyncing(true);
         const res = await API.put('/me', { settings: toSave });
         const updated = res?.data?.user;
         if (updated) {
           localStorage.setItem('user', JSON.stringify(updated));
           window.dispatchEvent(new Event('user-updated'));
         }
       } catch {
         // ignore (still saved in localStorage)
       } finally {
         setIsSyncing(false);
       }
     }, 500);

     return () => clearTimeout(t);
   }, [settings, theme]);

   const themeLabel = useMemo(() => {
     if (theme === 'system') return `System (${resolvedTheme})`;
     return theme;
   }, [theme, resolvedTheme]);

   const clearInterviewHistory = async () => {
     try {
       const token = localStorage.getItem('token');
       if (token) {
         try {
           await fetch('/api/interview/history', {
             method: 'DELETE',
             headers: {
               Authorization: `Bearer ${token}`,
             },
           });
         } catch {
           // ignore
         }
       }

       localStorage.removeItem('interviewFeedback');
       setMessage('Interview history cleared.');
       setTimeout(() => setMessage(''), 2000);
     } catch {
       setMessage('Unable to clear history.');
       setTimeout(() => setMessage(''), 2000);
     }
   };

   const resetSettings = () => {
     setSettings(defaultSettings);
     setMessage('Settings reset to defaults.');
     setTimeout(() => setMessage(''), 2000);
   };

  return (
    <div className="flex min-h-screen bg-transparent text-slate-900 dark:bg-gray-900 dark:text-white">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className={`flex-1 p-4 sm:p-6 md:p-8 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
      <div className="p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-sm text-slate-600 dark:text-gray-300 mb-6">
          Customize appearance and interview preferences.
        </p>

        {message && (
          <div className="mb-4 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200 px-4 py-3 text-sm">
            {message}
          </div>
        )}

        <div className="rounded-lg p-6 shadow-lg max-w-3xl bg-white/70 dark:bg-gray-800 border border-slate-200/70 dark:border-gray-700 backdrop-blur">
          <div className="space-y-6">
            <Section title="Appearance">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-medium">Theme</div>
                  <div className="text-sm text-slate-600 dark:text-gray-300">Current: {themeLabel}</div>
                  {isSyncing && <div className="text-xs text-slate-500 dark:text-gray-400 mt-1">Syncing…</div>}
                </div>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="bg-slate-50 dark:bg-gray-700 border border-slate-300 dark:border-gray-600 text-slate-900 dark:text-white rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5"
                >
                  <option value="system">System</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </Section>

            <Section title="Account">
              <ToggleSetting
                label="Email notifications"
                checked={!!settings.emailNotifications}
                onChange={(v) => setSettings((s) => ({ ...s, emailNotifications: v }))}
              />
            </Section>

            <Section title="Interview Preferences">
              <SelectSetting
                label="Default difficulty"
                options={['Easy', 'Medium', 'Hard']}
                value={settings.defaultDifficulty}
                onChange={(v) => setSettings((s) => ({ ...s, defaultDifficulty: v }))}
              />
              <SelectSetting
                label="Preferred language"
                options={['English', 'Spanish', 'French', 'German']}
                value={settings.preferredLanguage}
                onChange={(v) => setSettings((s) => ({ ...s, preferredLanguage: v }))}
              />
              <ToggleSetting
                label="Auto-play interviewer voice (Voice Interview)"
                checked={!!settings.autoPlayVoice}
                onChange={(v) => setSettings((s) => ({ ...s, autoPlayVoice: v }))}
              />
            </Section>

            <Section title="Data">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={clearInterviewHistory}
                  className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-purple-600 dark:hover:bg-purple-700 font-medium py-2 px-4 rounded transition-colors"
                >
                  Clear interview history
                </button>
                <button
                  type="button"
                  onClick={resetSettings}
                  className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:border-gray-600 font-medium py-2 px-4 rounded transition-colors"
                >
                  Reset settings
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-2">
                These settings are stored in your browser (localStorage).
              </p>
            </Section>

            <div className="pt-4 border-t border-slate-200 dark:border-gray-700">
              <button
                type="button"
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors"
                onClick={() => setMessage('Delete account is not enabled yet.')}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
      </div>
  )
}

const Section = ({ title, children }) => {
  return (
    <div className="pb-6 border-b border-slate-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

const ToggleSetting = ({ label, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-700 dark:text-gray-300">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <div className="w-11 h-6 bg-slate-300 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
      </label>
    </div>
  )
}

const SelectSetting = ({ label, options, value, onChange }) => {
  return (
    <div>
      <label className="block text-slate-700 dark:text-gray-300 mb-2">{label}</label>
      <select 
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="bg-slate-50 dark:bg-gray-700 border border-slate-300 dark:border-gray-600 text-slate-900 dark:text-white rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
      >
        {options.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>
    </div>
  )
}

export default Settings