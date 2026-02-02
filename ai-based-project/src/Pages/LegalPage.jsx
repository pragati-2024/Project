import React from "react";

const LegalPage = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-transparent text-slate-900 dark:bg-gray-900 dark:text-gray-100 p-6 radial-background">
      <div className="max-w-4xl mx-auto bg-white/70 dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-slate-200/70 dark:border-gray-700 backdrop-blur">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">{title}</h1>
        <div className="text-slate-700 dark:text-gray-300 space-y-3 text-sm md:text-base">{children}</div>
      </div>
    </div>
  );
};

export const Privacy = () => (
  <LegalPage title="Privacy Policy">
    <p>
      This is a placeholder privacy policy for the Mockneto project. Replace this content before
      publishing publicly.
    </p>
    <p>
      We store authentication tokens locally in your browser for login and use them to access
      protected endpoints.
    </p>
  </LegalPage>
);

export const Terms = () => (
  <LegalPage title="Terms of Service">
    <p>
      This is a placeholder Terms of Service page. Replace with your actual terms before going
      live.
    </p>
  </LegalPage>
);

export const Cookies = () => (
  <LegalPage title="Cookie Policy">
    <p>
      This is a placeholder cookie policy. The app may store small pieces of data in localStorage
      to keep you signed in and save interview feedback.
    </p>
  </LegalPage>
);

export const GDPR = () => (
  <LegalPage title="GDPR">
    <p>
      This is a placeholder GDPR notice. If you process EU personal data, ensure you provide lawful
      basis, data retention, and user rights details.
    </p>
  </LegalPage>
);

export default LegalPage;
