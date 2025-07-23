
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25c0 5.385 4.365 9.75 9.75 9.75 2.572 0 4.92-.99 6.752-2.648z" />
  </svg>
);


const HomePage: React.FC = () => {
  const { theme, toggleTheme } = useAppContext();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg text-gray-800 dark:text-dark-text transition-colors duration-300">
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">GenDesk</h1>
        <div className="flex items-center space-x-4">
          <button onClick={toggleTheme} className="p-2 rounded-full text-gray-600 dark:text-dark-muted hover:bg-gray-200 dark:hover:bg-gray-700">
            {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
          </button>
          <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-dark-muted hover:text-primary-600 dark:hover:text-primary-400">Login</Link>
          <Link to="/register" className="text-sm font-medium px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700">Register</Link>
        </div>
      </header>

      <main>
        <section className="text-center py-20 px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Streamline Your Support with <span className="text-primary-600">AI</span></h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-dark-muted mb-8">
            GenDesk is a modern, intuitive service desk platform that leverages the power of AI to categorize tickets, suggest solutions, and help your team resolve issues faster than ever before.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register" className="px-8 py-3 rounded-md bg-primary-600 text-white font-semibold text-lg hover:bg-primary-700 transition-transform transform hover:scale-105">
              Get Started for Free
            </Link>
          </div>
        </section>

        <section className="py-20 px-4 bg-white dark:bg-dark-surface">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-12">Features at a Glance</h3>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900/50 mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                </div>
                <h4 className="text-xl font-semibold mb-2">AI-Powered Categorization</h4>
                <p className="text-gray-600 dark:text-dark-muted">Automatically categorize and prioritize tickets using Gemini, reducing manual work and ensuring tickets get to the right people.</p>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900/50 mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <h4 className="text-xl font-semibold mb-2">Role-Based Access Control</h4>
                <p className="text-gray-600 dark:text-dark-muted">Securely manage your helpdesk with distinct roles for Admins, Support Staff, and end-users, each with tailored permissions.</p>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900/50 mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                </div>
                <h4 className="text-xl font-semibold mb-2">Real-Time Updates</h4>
                <p className="text-gray-600 dark:text-dark-muted">Keep everyone in the loop with live status updates and a comprehensive comment system for seamless communication.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
