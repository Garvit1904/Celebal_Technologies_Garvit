
import React, { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  bodyClassName?: string;
  actions?: ReactNode; // Optional actions for the card header
}

const Card: React.FC<CardProps> = ({ title, children, className = '', titleClassName = '', bodyClassName = '', actions }) => {
  return (
    <div className={`bg-white dark:bg-secondary-800 shadow-lg rounded-xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl ${className}`}>
      {title && (
        <div className={`p-4 sm:p-5 border-b border-secondary-200 dark:border-secondary-700 flex justify-between items-center ${titleClassName}`}>
          <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200">{title}</h3>
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
      )}
      <div className={`p-4 sm:p-5 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;
