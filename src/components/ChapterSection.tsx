import React from 'react';
import { Chapter } from '../types';
import LinkTile from './LinkTile';

interface ChapterSectionProps {
  chapter: Chapter;
}

const ChapterSection: React.FC<ChapterSectionProps> = ({ chapter }) => {
  return (
    <section id={chapter.id} className="mb-8 sm:mb-10 scroll-mt-20 sm:scroll-mt-24">
      <div className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 
                     rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 border-l-4 border-indigo-500">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-indigo-900 dark:text-indigo-300">
          {chapter.title}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {chapter.links.map((link, index) => (
          <LinkTile key={`${chapter.id}-link-${index}`} link={link} />
        ))}
      </div>
    </section>
  );
};

export default ChapterSection;