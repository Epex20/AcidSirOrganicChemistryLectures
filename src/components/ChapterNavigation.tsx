import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Chapter } from '../types';

interface ChapterNavigationProps {
  chapters: Chapter[];
}

const ChapterNavigation: React.FC<ChapterNavigationProps> = ({ chapters }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="hidden sm:block sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-md py-2 sm:py-3 mb-6 sm:mb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative flex items-center">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 z-10 p-1 rounded-full bg-white dark:bg-gray-800 
                     shadow-md border border-gray-200 dark:border-gray-700
                     text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>

          <div 
            ref={scrollContainerRef}
            className="flex items-center overflow-x-auto scrollbar-hide mx-8 py-1"
            style={{ scrollBehavior: 'smooth' }}
          >
            <div className="flex space-x-2 sm:space-x-4">
              {chapters.map((chapter) => (
                <a
                  key={chapter.id}
                  href={`#${chapter.id}`}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gray-100 dark:bg-gray-800 
                           text-gray-800 dark:text-gray-200 whitespace-nowrap
                           hover:bg-indigo-100 dark:hover:bg-indigo-900/50 
                           transition-colors duration-200 text-xs sm:text-sm font-medium
                           border border-gray-200 dark:border-gray-700"
                >
                  {chapter.title}
                </a>
              ))}
            </div>
          </div>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 z-10 p-1 rounded-full bg-white dark:bg-gray-800 
                     shadow-md border border-gray-200 dark:border-gray-700
                     text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChapterNavigation;