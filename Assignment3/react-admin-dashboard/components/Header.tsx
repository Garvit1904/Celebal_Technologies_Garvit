
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MOCK_USER, NAVIGATION_ITEMS } from '../constants';
import ThemeSwitcher from './ThemeSwitcher';
import { ChevronDownIcon, SearchIcon } from './Icons';

const Header: React.FC = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const currentPage = NAVIGATION_ITEMS.find(item => item.path === location.pathname);
  const pageTitle = currentPage ? currentPage.name : "Dashboard";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white dark:bg-secondary-800 shadow-md p-4 flex items-center justify-between sticky top-0 z-30 h-16 border-b border-secondary-200 dark:border-secondary-700">
      {/* Page Title / Search Bar for larger screens */}
      <div className="flex items-center">
        <h2 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200 hidden sm:block">{pageTitle}</h2>
        <div className="relative ml-4 hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-secondary-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block w-full pl-10 pr-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md leading-5 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 dark:placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Spacer for mobile, so title can be centered if needed or actions on left */}
      <div className="sm:hidden flex-1"></div>


      <div className="flex items-center space-x-4">
        <ThemeSwitcher />
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center space-x-2 p-1 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary-100 dark:focus:ring-offset-secondary-800 focus:ring-primary-500"
          >
            <img
              className="h-9 w-9 rounded-full object-cover"
              src={MOCK_USER.avatarUrl}
              alt={MOCK_USER.name}
            />
            <span className="hidden md:inline text-sm font-medium text-secondary-700 dark:text-secondary-300">{MOCK_USER.name}</span>
            <ChevronDownIcon className="h-4 w-4 text-secondary-500 dark:text-secondary-400 hidden md:inline" />
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-secondary-700 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-40">
              <a
                href="#profile"
                className="block px-4 py-2 text-sm text-secondary-700 dark:text-secondary-200 hover:bg-secondary-100 dark:hover:bg-secondary-600"
              >
                Your Profile
              </a>
              <a
                href="#settings"
                className="block px-4 py-2 text-sm text-secondary-700 dark:text-secondary-200 hover:bg-secondary-100 dark:hover:bg-secondary-600"
              >
                Settings
              </a>
              <hr className="my-1 border-secondary-200 dark:border-secondary-600" />
              <a
                href="#logout"
                className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20"
              >
                Sign out
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
