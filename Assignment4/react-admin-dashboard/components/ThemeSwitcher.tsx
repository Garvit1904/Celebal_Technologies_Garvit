
import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { Theme } from '../types';
import { SunIcon, MoonIcon } from './Icons';

const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-secondary-600 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary-100 dark:focus:ring-offset-secondary-800 focus:ring-primary-500 transition-colors duration-200"
      aria-label={theme === Theme.Light ? 'Switch to dark theme' : 'Switch to light theme'}
    >
      {theme === Theme.Light ? (
        <MoonIcon className="w-6 h-6" />
      ) : (
        <SunIcon className="w-6 h-6" />
      )}
    </button>
  );
};

export default ThemeSwitcher;
