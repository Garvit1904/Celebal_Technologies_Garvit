
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { NavItem } from '../types';
import { NAVIGATION_ITEMS, APP_NAME } from '../constants';
import { useTheme } from '../hooks/useTheme';
import { MenuIcon, XMarkIcon } from './Icons'; // Assuming XMarkIcon is for closing

const Sidebar: React.FC = () => {
  const { theme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavLinks: React.FC<{ items: NavItem[]; onClick?: () => void }> = ({ items, onClick }) => (
    <nav>
      <ul>
        {items.map((item) => (
          <li key={item.name} className="mb-2">
            <NavLink
              to={item.path}
              onClick={onClick}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition-colors duration-200 ease-in-out group
                 ${
                   isActive
                     ? 'bg-primary-500 text-white shadow-lg'
                     : `hover:bg-primary-500/10 dark:hover:bg-primary-500/20 ${
                         theme === 'light' ? 'text-secondary-700 hover:text-primary-600' : 'text-secondary-300 hover:text-primary-300'
                       }`
                 }`
              }
            >
              <item.icon className={`w-6 h-6 mr-3 transition-colors duration-200 ease-in-out ${
                theme === 'light' ? 'group-hover:text-primary-600' : 'group-hover:text-primary-300'
              }`} />
              <span className="text-sm font-medium">{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary-500 text-white rounded-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-secondary-50 dark:bg-secondary-800 
          text-secondary-800 dark:text-secondary-200 
          p-6 shadow-xl lg:shadow-none
          flex flex-col transition-transform duration-300 ease-in-out
          border-r border-secondary-200 dark:border-secondary-700
        `}
      >
        <div className="flex items-center mb-8">
          <img src="https://picsum.photos/seed/logo/40/40" alt="App Logo" className="w-10 h-10 rounded-full mr-3" />
          <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">{APP_NAME}</h1>
        </div>
        <div className="flex-grow overflow-y-auto">
          <NavLinks items={NAVIGATION_ITEMS} onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)} />
        </div>
        <div className="mt-auto pt-4 border-t border-secondary-200 dark:border-secondary-700">
          <p className="text-xs text-center text-secondary-500 dark:text-secondary-400">
            © {new Date().getFullYear()} {APP_NAME}
          </p>
        </div>
      </aside>
       {/* Overlay for mobile menu */}
       {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
