import React, { useState, FormEvent } from 'react';

interface AdminCodeModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

const AdminCodeModal: React.FC<AdminCodeModalProps> = ({ onClose, onSuccess }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (code === '0000') {
            onSuccess();
        } else {
            setError('Code incorrect.');
            setCode('');
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white w-full max-w-sm rounded-lg shadow-xl transform transition-all"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Accès Administrateur</h3>
                    <p className="text-gray-600 mb-4">Veuillez entrer le code d'accès pour continuer.</p>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="password"
                            value={code}
                            onChange={(e) => {
                                setCode(e.target.value);
                                if(error) setError('');
                            }}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Code secret"
                            autoFocus
                        />
                        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                        <div className="mt-6 text-right space-x-2">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition">
                                Annuler
                            </button>
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
                                Valider
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminCodeModal;