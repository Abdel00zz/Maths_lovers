
import React from 'react';
import { Class } from '../types';
import Card from './Card';

interface ChapterSelectionProps {
    classData: Class;
    onSelectChapter: (chapterId: string) => void;
}

const ChapterSelection: React.FC<ChapterSelectionProps> = ({ classData, onSelectChapter }) => {
    return (
        <section>
            <h2 className="text-3xl font-light mb-6 text-gray-700">Chapitres - <span className="font-medium">{classData.name}</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classData.chapters.map(chap => (
                    <Card
                        key={chap.id}
                        title={chap.name}
                        count={chap.exercises.length}
                        unit="exercice"
                        onClick={() => onSelectChapter(chap.id)}
                    />
                ))}
            </div>
        </section>
    );
};

export default ChapterSelection;
