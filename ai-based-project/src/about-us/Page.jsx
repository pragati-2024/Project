// src/pages/About.jsx
import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">About Us</h1>
      <p className="max-w-2xl mx-auto text-lg leading-7">
        We are a team of professionals dedicated to helping you crack your interviews with ease.
        From HR to technical interviews, we provide you with curated tips, common questions,
        and proven strategies to make a lasting impression.
      </p>

      <div className="mt-8 max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-xl font-semibold">Our Vision</h2>
          <p>To empower job seekers with the confidence and skills needed to succeed in interviews.</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-xl font-semibold">Our Mission</h2>
          <p>To provide the most reliable, up-to-date, and practical interview resources available.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
