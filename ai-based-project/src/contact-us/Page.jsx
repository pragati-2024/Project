// src/pages/Contact.jsx
import React from 'react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Contact Us</h1>

      <form className="max-w-xl mx-auto bg-white p-6 rounded shadow space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Name</label>
          <input type="text" className="w-full border p-2 rounded" placeholder="Your Name" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input type="email" className="w-full border p-2 rounded" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Message</label>
          <textarea className="w-full border p-2 rounded" rows="4" placeholder="Your message..."></textarea>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;
