import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { INITIAL_DATABASE, MOTIVATIONAL_MESSAGES } from './constants';
import { Database, User } from './types';
import ClassSelection from './components/ClassSelection';
import ChapterSelection from './components/ChapterSelection';
import ExerciseList from './components/ExerciseList';
import ExerciseView from './components/ExerciseView';
import Breadcrumb from './components/Breadcrumb';
import AdminModal from './components/AdminModal';
import AdminCodeModal from './components/AdminCodeModal';
import { SettingsIcon, ArabicLogo, HelpIcon, LogoIcon } from './components/Icons';
import { MathJaxContext } from 'better-react-mathjax';
import UserProfileModal from './components/UserProfileModal';
import HelpModal from './components/HelpModal';

const App: React.FC = () => {
    const [database, setDatabase] = useState<Database>({ classes: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [selection, setSelection] = useState<{ classId: string | null; chapterId: string | null; exerciseId: string | null; }>({
        classId: null,
        chapterId: null,
        exerciseId: null,
    });
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [motivationalMessage, setMotivationalMessage] = useState('');
    const [typedName, setTypedName] = useState('');
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        fetch('/database.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setDatabase(data);
            })
            .catch(error => {
                console.error("Échec du chargement de database.json, retour aux données initiales.", error);
                setDatabase(INITIAL_DATABASE);
            })
            .finally(() => {
                setIsLoading(false);
            });

        setMotivationalMessage(MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]);

        try {
            const savedUser = localStorage.getItem('sigma-user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            } else {
                setIsUserModalOpen(true);
            }
        } catch (error) {
            console.error("Failed to parse user data from localStorage", error);
            setIsUserModalOpen(true);
        }
    }, []);
    
    useEffect(() => {
        if (!user?.name) return;

        setTypedName('');
        setIsTyping(true);

        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < user.name.length) {
                setTypedName(prev => prev + (user.name.charAt(i) || ''));
                i++;
            } else {
                clearInterval(typingInterval);
                setIsTyping(false);
            }
        }, 100);

        return () => clearInterval(typingInterval);
    }, [user]);


    const mathJaxConfig = {
        tex: {
            inlineMath: [['$', '$'], ['\\(', '\\)']],
            displayMath: [['$$', '$$'], ['\\[', '\\]']],
            processEscapes: true,
            processEnvironments: true,
            tags: 'none'
        },
        svg: {
            fontCache: 'global',
            displayAlign: 'center',
            displayIndent: '0em'
        },
        options: {
            skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
            ignoreHtmlClass: 'tex2jax_ignore',
            processHtmlClass: 'tex2jax_process'
        }
    };

    const handleSelectClass = useCallback((classId: string) => {
        setSelection({ classId, chapterId: null, exerciseId: null });
    }, []);

    const handleSelectChapter = useCallback((chapterId: string) => {
        setSelection(prev => ({ ...prev, chapterId, exerciseId: null }));
    }, []);

    const handleSelectExercise = useCallback((exerciseId: string) => {
        setSelection(prev => ({ ...prev, exerciseId }));
    }, []);

    const resetSelection = useCallback((level: 'home' | 'class' | 'chapter') => {
        if (level === 'home') {
            setSelection({ classId: null, chapterId: null, exerciseId: null });
        } else if (level === 'class') {
            setSelection(prev => ({ ...prev, chapterId: null, exerciseId: null }));
        } else if (level === 'chapter') {
            setSelection(prev => ({ ...prev, exerciseId: null }));
        }
    }, []);

    const handleAdminOpen = () => {
        setIsCodeModalOpen(true);
    };

    const handleAdminSuccess = () => {
        setIsCodeModalOpen(false);
        setIsAdminModalOpen(true);
    };

    const handleAdminSave = (newDatabase: Database) => {
        setDatabase(newDatabase);
        // We don't close the modal on save anymore, to allow downloading.
        // setIsAdminModalOpen(false); 
    };
    
    const handleUserSave = (newUser: User) => {
        setUser(newUser);
        localStorage.setItem('sigma-user', JSON.stringify(newUser));
        setIsUserModalOpen(false);
    };

    const selectedClass = useMemo(() => 
        database.classes.find(c => c.id === selection.classId) || null, 
        [database.classes, selection.classId]
    );

    const selectedChapter = useMemo(() => 
        selectedClass?.chapters.find(ch => ch.id === selection.chapterId) || null,
        [selectedClass, selection.chapterId]
    );

    const selectedExercise = useMemo(() => 
        selectedChapter?.exercises.find(ex => ex.id === selection.exerciseId) || null,
        [selectedChapter, selection.exerciseId]
    );
    
    const selectedExerciseIndex = useMemo(() => {
        if (!selectedChapter || !selectedExercise) return -1;
        return selectedChapter.exercises.findIndex(ex => ex.id === selectedExercise.id) + 1;
    }, [selectedChapter, selectedExercise]);


    const renderContent = () => {
        if (selection.exerciseId && selectedExercise) {
            return <ExerciseView exercise={selectedExercise} index={selectedExerciseIndex} />;
        }
        if (selection.chapterId && selectedChapter) {
            return <ExerciseList chapter={selectedChapter} onSelectExercise={handleSelectExercise} />;
        }
        if (selection.classId && selectedClass) {
            return <ChapterSelection classData={selectedClass} onSelectChapter={handleSelectChapter} />;
        }
        return <ClassSelection classes={database.classes} onSelectClass={handleSelectClass} />;
    };
    
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 text-slate-600">
                <LogoIcon className="w-16 h-16 animate-pulse text-indigo-500" />
                <p className="mt-4 text-xl font-semibold">Chargement de la plateforme...</p>
            </div>
        );
    }

    return (
        <MathJaxContext config={mathJaxConfig} version={3}>
            <div className="bg-slate-100 min-h-screen text-slate-800 flex flex-col">
                <div className="fixed top-6 right-6 z-30">
                    <ArabicLogo />
                </div>

                <button
                    onClick={() => setIsHelpModalOpen(true)}
                    className="fixed top-6 left-6 z-30 p-3 rounded-full bg-slate-900/40 text-white backdrop-blur-sm hover:bg-slate-900/60 transition-all duration-300"
                    aria-label="Aide et guide"
                >
                    <HelpIcon className="w-6 h-6" />
                </button>
                <button
                    onClick={handleAdminOpen}
                    className="fixed bottom-4 right-4 z-30 p-3 rounded-full bg-slate-900/40 text-white backdrop-blur-sm hover:bg-slate-900/60 transition-all duration-300"
                    aria-label="Admin settings"
                >
                    <SettingsIcon className="w-6 h-6" />
                </button>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex-1">
                    <section className="py-12 md:py-16 text-center">
                        {user && (
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight leading-tight min-h-[60px] md:min-h-[75px]">
                                Bonjour, <span className="text-indigo-600">{typedName}</span>
                                {isTyping && <span className="inline-block w-1 h-10 md:h-12 bg-indigo-600 animate-pulse ml-1 align-bottom"></span>}
                                !
                            </h2>
                        )}
                        <p className="mt-2 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
                           {motivationalMessage}
                        </p>
                    </section>
                    
                    <main className="pb-8">
                        <Breadcrumb 
                            classData={selectedClass} 
                            chapter={selectedChapter} 
                            onNavigate={resetSelection} 
                        />
                        {renderContent()}
                    </main>
                </div>
                
                <footer className="py-6 text-center text-slate-500 text-sm border-t border-slate-200 mt-auto">
                    <p>&copy; 2025 Sigma Learning Platform. Tous droits réservés.</p>
                </footer>

                {isCodeModalOpen && (
                    <AdminCodeModal 
                        onClose={() => setIsCodeModalOpen(false)}
                        onSuccess={handleAdminSuccess}
                    />
                )}
                {isAdminModalOpen && (
                    <AdminModal 
                        database={database}
                        onClose={() => setIsAdminModalOpen(false)}
                        onSave={handleAdminSave}
                    />
                )}
                 {isUserModalOpen && (
                    <UserProfileModal onSave={handleUserSave} />
                )}
                {isHelpModalOpen && (
                    <HelpModal onClose={() => setIsHelpModalOpen(false)} />
                )}
            </div>
        </MathJaxContext>
    );
};

export default App;
