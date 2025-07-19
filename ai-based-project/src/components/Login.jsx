import React, { useState } from 'react';
import SideImage from '../assets/6073424 copy.jpg';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="min-h-screen flex flex-col lg:flex-row text-white font-[Poppins] bg-gradient-to-br from-[#1a1a2e] to-[#2e1a47]">
      {/* Side Image - Hidden on mobile, visible on large screens */}
      <div className="w-full lg:w-1/2 hidden lg:flex items-center justify-center bg-black">
        <img
          src={SideImage} 
          alt="Brand"
          className="w-full h-screen object-cover filter brightness-[0.95] contrast-[1.1] saturate-[1.2]"
        />
      </div>

      {/* Form Section - Full width on mobile, half width on large screens */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-2">Mockneto</h1>
            <p className="text-gray-400 text-sm sm:text-base">Welcome back! Please sign in to your account.</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-between mb-6 sm:mb-8">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 sm:py-3 border-b-2 transition-colors duration-200 text-sm sm:text-base font-medium ${
                activeTab === 'login'
                  ? 'border-[#3f51b5] text-white'
                  : 'text-gray-400 border-transparent hover:text-gray-300'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-2 sm:py-3 border-b-2 transition-colors duration-200 text-sm sm:text-base font-medium ${
                activeTab === 'signup'
                  ? 'border-[#3f51b5] text-white'
                  : 'text-gray-400 border-transparent hover:text-gray-300'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Login Form */}
          {activeTab === 'login' ? (
            <form className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm sm:text-base font-medium mb-2">Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-[#2c2c2c] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3f51b5] focus:border-transparent text-sm sm:text-base transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium mb-2">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-[#2c2c2c] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3f51b5] focus:border-transparent text-sm sm:text-base transition-all duration-200"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <label className="flex items-center text-xs sm:text-sm text-gray-400 cursor-pointer">
                  <input type="checkbox" className="mr-2 w-4 h-4" />
                  Remember me
                </label>
                <a href="#" className="text-[#8ab4f8] text-xs sm:text-sm hover:underline">Forgot password?</a>
              </div>

              <button className="w-full py-2 sm:py-3 bg-[#3f51b5] rounded-lg hover:bg-[#5a6fff] transition-all duration-200 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#3f51b5] focus:ring-offset-2 focus:ring-offset-[#1a1a2e]">
                Sign In
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-xs sm:text-sm">
                  <span className="px-2 bg-gradient-to-br from-[#1a1a2e] to-[#2e1a47] text-gray-500">or</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full py-2 sm:py-3 flex justify-center items-center gap-2 border border-gray-600 bg-[#2c2c2c] rounded-lg hover:bg-[#3a3a3a] transition-all duration-200 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-[#1a1a2e]"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                  alt="Google"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
                Log in with Google
              </button>
            </form>
          ) : (
            /* Sign Up Form */
            <form className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm sm:text-base font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-[#2c2c2c] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3f51b5] focus:border-transparent text-sm sm:text-base transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium mb-2">Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-[#2c2c2c] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3f51b5] focus:border-transparent text-sm sm:text-base transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Create a password"
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-[#2c2c2c] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3f51b5] focus:border-transparent text-sm sm:text-base transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium mb-2">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-[#2c2c2c] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3f51b5] focus:border-transparent text-sm sm:text-base transition-all duration-200"
                />
              </div>

              <button className="w-full py-2 sm:py-3 bg-[#3f51b5] rounded-lg hover:bg-[#5a6fff] transition-all duration-200 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#3f51b5] focus:ring-offset-2 focus:ring-offset-[#1a1a2e]">
                Create Account
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
