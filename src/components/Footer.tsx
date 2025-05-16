import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-100 dark:bg-gray-800 py-4 sm:py-6 mt-8 sm:mt-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <p className="text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-300">
             Copyright © {new Date().getFullYear()} by Ayush (EPEX)
            </p>
          </div>
          
          <div className="flex space-x-3 sm:space-x-4">
            <a
              href="https://telegram.dog/Imayuu03"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-white dark:bg-gray-700 
                       rounded-lg shadow-sm transition-transform hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-500"
              >
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
              <span className="text-sm sm:text-base text-gray-800 dark:text-gray-200">Telegram</span>
            </a>
            
            <a
              href="https://www.neetexamcountdown.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-white dark:bg-gray-700 
                       rounded-lg shadow-sm transition-transform hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-500"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="text-sm sm:text-base text-gray-800 dark:text-gray-200">NEET Countdown</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;