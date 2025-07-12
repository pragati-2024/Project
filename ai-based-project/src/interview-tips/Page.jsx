// src/App.jsx
import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      <header className="bg-blue-700 text-white py-6 shadow">
        <h1 className="text-3xl font-bold text-center">Interview Tips</h1>
        <p className="text-center mt-2 text-sm text-blue-200">Ace your next interview with confidence</p>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <section className="bg-white shadow-md rounded p-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">1. Research the Company</h2>
          <p>
            Understand the company’s mission, products, and recent news. Tailor your answers to align with their values.
          </p>
        </section>

        <section className="bg-white shadow-md rounded p-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">2. Master Common Questions</h2>
          <p>
            Prepare answers for typical HR and technical questions. Use the STAR (Situation, Task, Action, Result) method to structure responses.
          </p>
        </section>

        <section className="bg-white shadow-md rounded p-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">3. Dress & Communicate Professionally</h2>
          <p>
            Dress appropriately, be punctual, and communicate clearly and confidently. Non-verbal cues matter!
          </p>
        </section>

        <section className="bg-white shadow-md rounded p-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">4. Ask Insightful Questions</h2>
          <p>
            At the end, ask questions about the role, team, or company culture. It shows interest and preparation.
          </p>
        </section>

        <section className="bg-white shadow-md rounded p-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">5. Follow Up</h2>
          <p>
            Send a polite thank-you email within 24 hours. Reiterate your interest and thank them for the opportunity.
          </p>
        </section>
      </main>

      <footer className="bg-blue-700 text-white text-center p-4 mt-10">
        <p>&copy; {new Date().getFullYear()} Interview Tips. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
