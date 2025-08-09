import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Link as LinkType } from '../types';

interface LinkTileProps {
  link: LinkType;
  onVideoPlay?: (url: string, title: string) => void;
}

const LinkTile: React.FC<LinkTileProps> = ({ link, onVideoPlay }) => {
  const isVideoLink = link.url.includes('.webm') || link.url.includes('uamedia.uacdn.net');
  const isUnavailable = link.url === 'Lecture not available';

  const handleClick = (e: React.MouseEvent) => {
    if (isVideoLink && onVideoPlay) {
      e.preventDefault();
      onVideoPlay(link.url, link.text);
    } else if (isUnavailable) {
      e.preventDefault();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-md 
                 transition-all duration-300 border border-gray-200 dark:border-gray-700
                 flex items-center justify-between
                 ${isUnavailable 
                   ? 'opacity-50 cursor-not-allowed' 
                   : 'hover:shadow-lg hover:-translate-y-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750'
                 }`}
    >
      <span className={`text-sm sm:text-base font-medium flex-1 pr-3 leading-relaxed
                       ${isUnavailable 
                        ? 'text-gray-400 dark:text-gray-500' 
                        : 'text-gray-900 dark:text-gray-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-300'
                       }`}>
        {link.text}
      </span>
      
      <div className={`flex items-center justify-center p-1.5 sm:p-2 rounded-full transition-all duration-300
                      ${isUnavailable
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                        : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800 group-hover:scale-110'
                      }`}>
        <ExternalLink size={14} className="sm:w-4 sm:h-4" />
      </div>
      
      {!isVideoLink && !isUnavailable && (
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0"
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
  );
};

export default LinkTile;