// src/pages/Login.jsx
import React from 'react';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <form className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Username</label>
            <input type="text" className="w-full border p-2 rounded" placeholder="Enter your username" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Password</label>
            <input type="password" className="w-full border p-2 rounded" placeholder="Enter your password" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
