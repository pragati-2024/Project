import { NavLink } from 'react-router-dom'
import { FaHome, FaChartBar, FaUser, FaCog,FaQuestionCircle } from 'react-icons/fa'
import { FiMenu, FiX } from 'react-icons/fi'
import React from 'react';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navItems = [
    { icon: <FaHome />, text: "Dashboard", path: "/dashboard" },
    { icon: <FaUser />, text: "Profile", path: "/profile" },
    { icon: <FaUser />, text: "Question Bank", path: "/question" },
    { icon: <FaChartBar />, text: "Reports", path: "/reports" },
    { icon: <FaQuestionCircle />, text: "FAQ", path: "/faq" },
    { icon: <FaCog />, text: "Settings", path: "/settings" },
  ]

  return (
    <>
    {/* Mobile overlay */}
    {sidebarOpen && (
      <div
        className="fixed inset-0 bg-black/50 z-30 md:hidden"
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
    )}

    <div
      className={`bg-white/80 backdrop-blur dark:bg-gray-800 h-full fixed z-40 transition-all duration-300 border-r border-slate-200 dark:border-gray-700
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        w-64 md:translate-x-0 ${sidebarOpen ? 'md:w-64' : 'md:w-20'}
      `}
      style={{
        top: 'var(--header-height)',
        height: 'calc(100vh - var(--header-height))',
      }}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-gray-700">
        {sidebarOpen && <h1 className="text-xl font-bold text-purple-600 dark:text-purple-400">InterviewReady</h1>}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>
      
      <nav className="mt-6">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center p-4 mx-2 rounded-lg transition-colors ${sidebarOpen ? 'justify-start' : 'justify-center'} ${
                isActive
                  ? 'bg-purple-700 text-white'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`
            }
          >
            <span className={`${sidebarOpen ? 'mr-3' : ''}`}>{item.icon}</span>
            {sidebarOpen && <span>{item.text}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
    </>
  )
}

export default Sidebar