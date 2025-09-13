
import React from 'react';

interface CardProps {
    title: string;
    count: number;
    unit: string;
    onClick: () => void;
}

const Card: React.FC<CardProps> = ({ title, count, unit, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl border-2 border-transparent hover:border-blue-500 relative overflow-hidden"
        >
            <h3 className="text-xl font-medium text-gray-800">{title}</h3>
            <span className="absolute top-4 right-4 bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                {count} {unit}{count !== 1 ? 's' : ''}
            </span>
        </div>
    );
};

export default Card;
