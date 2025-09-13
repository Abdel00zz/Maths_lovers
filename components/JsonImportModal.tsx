
import React, { useState } from 'react';
import { Exercise } from '../types';

interface JsonImportModalProps {
    chapterName: string;
    onClose: () => void;
    onImport: (exercises: Exercise[], strategy: 'replace' | 'append') => void;
}

const JsonImportModal: React.FC<JsonImportModalProps> = ({ chapterName, onClose, onImport }) => {
    const [jsonInput, setJsonInput] = useState('');
    const [strategy, setStrategy] = useState<'replace' | 'append'>('replace');
    const [error, setError] = useState<string | null>(null);
    
    const handleImport = () => {
        setError(null);
        let exercises;
        try {
            exercises = JSON.parse(jsonInput);
        } catch (e) {
            setError('Erreur : Syntaxe JSON invalide.');
            return;
        }

        if (!Array.isArray(exercises)) {
            setError('Erreur : Le JSON doit être un tableau `[ ... ]`.');
            return;
        }

        for (let i = 0; i < exercises.length; i++) {
            const ex = exercises[i];
            const exNum = `Exercice n°${i + 1}`;
            const requiredFields = ['title', 'difficulty', 'statement', 'video', 'courseReminder', 'quiz'];
            for (const field of requiredFields) {
                if (ex[field] === undefined) {
                    setError(`Erreur : Champ manquant '${field}' dans ${exNum}.`);
                    return;
                }
            }
            if (typeof ex.video !== 'object' || typeof ex.video.youtubeId !== 'string' || !Array.isArray(ex.video.timestamps)) {
                setError(`Erreur : 'video.youtubeId' (string) ou 'video.timestamps' (tableau) manquant ou invalide dans ${exNum}.`);
                return;
            }
             if (typeof ex.quiz !== 'object' || !Array.isArray(ex.quiz.questions)) { 
                setError(`Erreur : 'quiz.questions' (tableau) manquant dans ${exNum}.`);
                return;
             }
        }
        
        onImport(exercises as Exercise[], strategy);
        alert(`Importation réussie ! ${exercises.length} exercice(s) ont été traités.`);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl transform transition-all" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800">Importer pour : {chapterName}</h3>
                </header>
                <div className="p-6 space-y-4">
                    <p className="text-gray-600">Collez un tableau JSON d'exercices ci-dessous.</p>
                    <textarea
                        value={jsonInput}
                        onChange={e => setJsonInput(e.target.value)}
                        placeholder="[ { ... }, { ... } ]"
                        className="w-full h-48 p-2 border border-gray-300 rounded-md font-mono text-sm focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                    <div className="space-y-2">
                        <p className="font-medium text-gray-700">Stratégie d'importation :</p>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="radio" name="import-strategy" value="replace" checked={strategy === 'replace'} onChange={() => setStrategy('replace')} className="form-radio text-blue-600"/>
                            <span>Remplacer les exercices existants</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="radio" name="import-strategy" value="append" checked={strategy === 'append'} onChange={() => setStrategy('append')} className="form-radio text-blue-600"/>
                            <span>Ajouter à la liste existante</span>
                        </label>
                    </div>
                    {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}
                </div>
                <footer className="p-4 border-t border-gray-200 text-right space-x-2 bg-gray-50">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition">Annuler</button>
                    <button onClick={handleImport} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">Importer</button>
                </footer>
            </div>
        </div>
    );
};

export default JsonImportModal;