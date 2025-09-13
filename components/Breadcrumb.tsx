import React from 'react';
import { Class, Chapter } from '../types';
import { ChevronRightIcon } from './Icons';

interface BreadcrumbProps {
    classData: Class | null;
    chapter: Chapter | null;
    onNavigate: (level: 'home' | 'class' | 'chapter') => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ classData, chapter, onNavigate }) => {
    return (
        <nav className="mb-8 text-gray-600 flex items-center gap-2 text-base md:text-lg flex-wrap">
            <span
                className="cursor-pointer hover:text-blue-600 hover:underline transition-colors"
                onClick={() => onNavigate('home')}
            >
                Accueil
            </span>
            {classData && (
                <>
                    <ChevronRightIcon />
                    <span
                        className="cursor-pointer hover:text-blue-600 hover:underline transition-colors"
                        onClick={() => onNavigate('class')}
                    >
                        {classData.name}
                    </span>
                </>
            )}
            {chapter && (
                <>
                    <ChevronRightIcon />
                    <span
                         className="cursor-pointer hover:text-blue-600 hover:underline transition-colors"
                         onClick={() => onNavigate('chapter')}
                    >
                        {chapter.name}
                    </span>
                </>
            )}
        </nav>
    );
};

export default Breadcrumb;