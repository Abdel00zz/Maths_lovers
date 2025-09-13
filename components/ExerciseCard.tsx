
import React from 'react';
import { StarIcon } from './Icons';

interface ExerciseCardProps {
    title: string;
    difficulty: number;
    index: number;
    onClick: () => void;
}

const DifficultyStars: React.FC<{ level: number }> = ({ level }) => (
    <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
            <StarIcon key={i} filled={i < level} />
        ))}
    </div>
);


const ExerciseCard: React.FC<ExerciseCardProps> = ({ title, difficulty, index, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl border-2 border-transparent hover:border-blue-500"
        >
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Exercice {index}</h3>
                <DifficultyStars level={difficulty} />
            </div>
            <p className="text-lg font-medium text-gray-800">{title}</p>
        </div>
    );
};

export default ExerciseCard;
