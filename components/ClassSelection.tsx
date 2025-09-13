
import React from 'react';
import { Class } from '../types';
import Card from './Card';

interface ClassSelectionProps {
    classes: Class[];
    onSelectClass: (classId: string) => void;
}

const ClassSelection: React.FC<ClassSelectionProps> = ({ classes, onSelectClass }) => {
    return (
        <section>
            <h2 className="text-3xl font-light mb-6 text-gray-700">Choisissez votre classe</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map(cls => (
                    <Card
                        key={cls.id}
                        title={cls.name}
                        count={cls.chapters.length}
                        unit="chapitre"
                        onClick={() => onSelectClass(cls.id)}
                    />
                ))}
            </div>
        </section>
    );
};

export default ClassSelection;
