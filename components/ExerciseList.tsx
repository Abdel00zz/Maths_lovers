
import React from 'react';
import { Chapter } from '../types';
import ExerciseCard from './ExerciseCard';

interface ExerciseListProps {
    chapter: Chapter;
    onSelectExercise: (exerciseId: string) => void;
}

const ExerciseList: React.FC<ExerciseListProps> = ({ chapter, onSelectExercise }) => {
    return (
        <section>
            <h2 className="text-3xl font-light mb-6 text-gray-700">Exercices - <span className="font-medium">{chapter.name}</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chapter.exercises.map((ex, index) => (
                    <ExerciseCard
                        key={ex.id}
                        title={ex.title}
                        difficulty={ex.difficulty}
                        index={index + 1}
                        onClick={() => onSelectExercise(ex.id)}
                    />
                ))}
            </div>
        </section>
    );
};

export default ExerciseList;
