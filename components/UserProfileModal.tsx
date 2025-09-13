import React, { useState, FormEvent } from 'react';

interface UserProfileModalProps {
    onSave: (user: { name: string; email: string; phone: string }) => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ onSave }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Veuillez entrer votre nom pour commencer.');
            return;
        }
        onSave({ name: name.trim(), email: email.trim(), phone: phone.trim() });
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-xl shadow-2xl transform transition-all animate-fade-in-up-fast p-8" onClick={e => e.stopPropagation()}>
                <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Bienvenue sur Sigma !</h2>
                <p className="text-gray-600 mb-6 text-center">Commençons par faire connaissance.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                           Nom ou pseudo <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (error) setError('');
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="Ex: Alex Durand"
                            autoFocus
                            required
                        />
                         {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                           Adresse e-mail (facultatif)
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="alex.durand@email.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                           Téléphone (facultatif)
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="06 12 34 56 78"
                        />
                    </div>
                    <div className="pt-4">
                        <button type="submit" className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                           Commencer l'aventure
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserProfileModal;
