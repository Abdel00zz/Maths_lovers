import React, { useState } from 'react';
import { Database, Class, Chapter, Exercise } from '../types';
import { EditIcon, PlusCircleIcon, TrashIcon, ArrowLeftIcon, ChevronDownIcon } from './Icons';
import JsonImportModal from './JsonImportModal';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface AdminModalProps {
    database: Database;
    onClose: () => void;
    onSave: (newDatabase: Database) => void;
}

type SelectedItem = 
    | { type: 'class'; path: [number] }
    | { type: 'chapter'; path: [number, number] }
    | { type: 'exercise'; path: [number, number, number] }
    | null;

const AdminModal: React.FC<AdminModalProps> = ({ database, onClose, onSave }) => {
    const [editableDb, setEditableDb] = useState<Database>(() => JSON.parse(JSON.stringify(database)));
    const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);
    const [isImportModalOpen, setImportModalOpen] = useState(false);
    const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
    
    const isMobile = useMediaQuery('(max-width: 767px)');
    const [mobileView, setMobileView] = useState<'tree' | 'editor'>('tree');
    
    const toggleNode = (id: string) => {
        setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSelect = (item: SelectedItem) => {
        setSelectedItem(item);
        if (isMobile) {
            setMobileView('editor');
        }
    };

    const handleBackToTree = () => {
        setSelectedItem(null);
        setMobileView('tree');
    };

    const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

    const handleUpdate = (path: number[], field: string, value: any) => {
        setEditableDb(currentDb => {
            const newDb = { ...currentDb };
            const newClasses = [...newDb.classes];
            
            const [classIdx, chapIdx, exIdx] = path;

            if (path.length === 1) { // Updating a class
                const newClass = { ...newClasses[classIdx], [field]: value };
                newClasses[classIdx] = newClass;
            } else if (path.length === 2) { // Updating a chapter
                const newClass = { ...newClasses[classIdx] };
                const newChapters = [...newClass.chapters];
                const newChapter = { ...newChapters[chapIdx], [field]: value };
                newChapters[chapIdx] = newChapter;
                newClass.chapters = newChapters;
                newClasses[classIdx] = newClass;
            } else if (path.length === 3) { // Updating an exercise
                const newClass = { ...newClasses[classIdx] };
                const newChapters = [...newClass.chapters];
                const newChapter = { ...newChapters[chapIdx] };
                const newExercises = [...newChapter.exercises];
                const newExercise = { ...newExercises[exIdx] };

                if (field === 'youtubeId') {
                    newExercise.video = { ...newExercise.video, youtubeId: value };
                } else {
                    (newExercise as any)[field] = value;
                }
                
                newExercises[exIdx] = newExercise;
                newChapter.exercises = newExercises;
                newChapters[chapIdx] = newChapter;
                newClass.chapters = newChapters;
                newClasses[classIdx] = newClass;
            }

            newDb.classes = newClasses;
            return newDb;
        });
    };
    
    const handleTimestampChange = (tsIndex: number, field: 'label' | 'time', value: string | number) => {
        if (!selectedItem || selectedItem.type !== 'exercise') return;
        const [classIdx, chapIdx, exIdx] = selectedItem.path;

        setEditableDb(currentDb => {
            const newDb = { ...currentDb };
            const newClasses = [...newDb.classes];
            const newClass = { ...newClasses[classIdx] };
            const newChapters = [...newClass.chapters];
            const newChapter = { ...newChapters[chapIdx] };
            const newExercises = [...newChapter.exercises];
            const newExercise = { ...newExercises[exIdx] };
            const newVideo = { ...newExercise.video };
            const newTimestamps = [...(newVideo.timestamps || [])];
            const newTimestamp = { ...newTimestamps[tsIndex], [field]: value };
            
            newTimestamps[tsIndex] = newTimestamp;
            newVideo.timestamps = newTimestamps;
            newExercise.video = newVideo;
            newExercises[exIdx] = newExercise;
            newChapter.exercises = newExercises;
            newChapters[chapIdx] = newChapter;
            newClass.chapters = newChapters;
            newClasses[classIdx] = newClass;
            newDb.classes = newClasses;
            
            return newDb;
        });
    };

    const handleAddTimestamp = () => {
        if (!selectedItem || selectedItem.type !== 'exercise') return;
        const [classIdx, chapIdx, exIdx] = selectedItem.path;
        setEditableDb(currentDb => {
            const newDb = { ...currentDb };
            const newClasses = [...newDb.classes];
            const newClass = { ...newClasses[classIdx] };
            const newChapters = [...newClass.chapters];
            const newChapter = { ...newChapters[chapIdx] };
            const newExercises = [...newChapter.exercises];
            const newExercise = { ...newExercises[exIdx] };
            const newVideo = { ...newExercise.video };
            const newTimestamps = [...(newVideo.timestamps || []), { label: 'Nouveau', time: 0 }];
            
            newVideo.timestamps = newTimestamps;
            newExercise.video = newVideo;
            newExercises[exIdx] = newExercise;
            newChapter.exercises = newExercises;
            newChapters[chapIdx] = newChapter;
            newClass.chapters = newChapters;
            newClasses[classIdx] = newClass;
            newDb.classes = newClasses;
            
            return newDb;
        });
    };

    const handleRemoveTimestamp = (tsIndex: number) => {
        if (!selectedItem || selectedItem.type !== 'exercise') return;
        const [classIdx, chapIdx, exIdx] = selectedItem.path;

        setEditableDb(currentDb => {
            const newDb = { ...currentDb };
            const newClasses = [...newDb.classes];
            const newClass = { ...newClasses[classIdx] };
            const newChapters = [...newClass.chapters];
            const newChapter = { ...newChapters[chapIdx] };
            const newExercises = [...newChapter.exercises];
            const newExercise = { ...newExercises[exIdx] };
            const newVideo = { ...newExercise.video };
            const newTimestamps = [...(newVideo.timestamps || [])];
            
            newTimestamps.splice(tsIndex, 1);

            newVideo.timestamps = newTimestamps;
            newExercise.video = newVideo;
            newExercises[exIdx] = newExercise;
            newChapter.exercises = newExercises;
            newChapters[chapIdx] = newChapter;
            newClass.chapters = newChapters;
            newClasses[classIdx] = newClass;
            newDb.classes = newClasses;
            
            return newDb;
        });
    };

    const handleAddItem = (type: 'class' | 'chapter' | 'exercise', path?: number[]) => {
        setEditableDb(currentDb => {
            const newDb = { ...currentDb };
            let newClasses = [...newDb.classes];
            
            if (type === 'class') {
                newClasses = [...newClasses, { id: generateId('cls'), name: 'Nouvelle Classe', chapters: [] }];
            } else if (type === 'chapter' && path) {
                const classIdx = path[0];
                const newClass = { ...newClasses[classIdx] };
                const newChapter = { id: generateId('chap'), name: 'Nouveau Chapitre', exercises: [] };
                newClass.chapters = [...newClass.chapters, newChapter];
                newClasses[classIdx] = newClass;
                setExpandedNodes(prev => ({ ...prev, [`cls-${newClasses[classIdx].id}`]: true }));
            } else if (type === 'exercise' && path) {
                const [classIdx, chapIdx] = path;
                const newClass = { ...newClasses[classIdx] };
                const newChapters = [...newClass.chapters];
                const newChapter = { ...newChapters[chapIdx] };
                const newExercise = { id: generateId('ex'), title: 'Nouvel Exercice', difficulty: 1, statement: '', video: { youtubeId: '', timestamps: [] }, courseReminder: '', quiz: { questions: [] } };
                newChapter.exercises = [...newChapter.exercises, newExercise];
                newChapters[chapIdx] = newChapter;
                newClass.chapters = newChapters;
                newClasses[classIdx] = newClass;
                setExpandedNodes(prev => ({ ...prev, [`chap-${newChapters[chapIdx].id}`]: true }));
            }
            
            newDb.classes = newClasses;
            return newDb;
        });
    };

    const handleDeleteItem = (type: string, path: number[]) => {
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer cet élément ?`)) return;
        setEditableDb(currentDb => {
            const newDb = { ...currentDb };
            let newClasses = [...newDb.classes];

            if (type === 'class') {
                newClasses.splice(path[0], 1);
            } else if (type === 'chapter') {
                const classIdx = path[0];
                const newClass = { ...newClasses[classIdx] };
                const newChapters = [...newClass.chapters];
                newChapters.splice(path[1], 1);
                newClass.chapters = newChapters;
                newClasses[classIdx] = newClass;
            } else if (type === 'exercise') {
                const [classIdx, chapIdx] = path;
                const newClass = { ...newClasses[classIdx] };
                const newChapters = [...newClass.chapters];
                const newChapter = { ...newChapters[chapIdx] };
                const newExercises = [...newChapter.exercises];
                newExercises.splice(path[2], 1);
                newChapter.exercises = newExercises;
                newChapters[chapIdx] = newChapter;
                newClass.chapters = newChapters;
                newClasses[classIdx] = newClass;
            }
            
            newDb.classes = newClasses;
            return newDb;
        });
        setSelectedItem(null);
        if(isMobile) setMobileView('tree');
    }
    
    const handleJsonImport = (exercises: Exercise[], path: [number, number], strategy: 'replace' | 'append') => {
        setEditableDb(currentDb => {
            const newDb = { ...currentDb };
            const [classIdx, chapIdx] = path;
            const newClasses = [...newDb.classes];
            const newClass = { ...newClasses[classIdx] };
            const newChapters = [...newClass.chapters];
            const chapter = { ...newChapters[chapIdx] };
            
            const newExercises = exercises.map(ex => ({...ex, id: generateId('ex')}));
            if (strategy === 'replace') {
                chapter.exercises = newExercises;
            } else {
                chapter.exercises = [...chapter.exercises, ...newExercises];
            }

            newChapters[chapIdx] = chapter;
            newClass.chapters = newChapters;
            newClasses[classIdx] = newClass;
            newDb.classes = newClasses;

            return newDb;
        });
        setImportModalOpen(false);
    };

     const handleDownloadJson = () => {
        const jsonString = JSON.stringify(editableDb, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = 'database.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    };

    const renderEditorForm = () => {
        if (!selectedItem) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                    <EditIcon />
                    <p className="mt-4 text-lg">Sélectionnez un élément à éditer.</p>
                </div>
            );
        }
        
        let item: Class | Chapter | Exercise | null = null;
        if (selectedItem.type === 'class') item = editableDb.classes[selectedItem.path[0]];
        else if (selectedItem.type === 'chapter') item = editableDb.classes[selectedItem.path[0]].chapters[selectedItem.path[1]];
        else if (selectedItem.type === 'exercise') item = editableDb.classes[selectedItem.path[0]].chapters[selectedItem.path[1]].exercises[selectedItem.path[2]];
        
        if (!item) return null;

        const FormInput: React.FC<{label: string, id: string, value: string | number, type?: string}> = ({label, id, value, type='text'}) => (
            <div>
                <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
                <input type={type} id={id} value={value} min={type === 'number' ? 1 : undefined} max={id === 'difficulty' ? 5 : undefined} onChange={e => handleUpdate(selectedItem.path, id, type === 'number' ? Number(e.target.value) : e.target.value)} className="w-full p-2 bg-slate-100 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition"/>
            </div>
        );
        const FormTextarea: React.FC<{label: string, id: string, value: string}> = ({label, id, value}) => (
            <div>
                <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
                <textarea id={id} value={value} onChange={e => handleUpdate(selectedItem.path, id, e.target.value)} rows={5} className="w-full p-2 bg-slate-100 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 font-mono text-sm transition"></textarea>
            </div>
        );

        return (
             <div className="h-full flex flex-col">
                {isMobile && (
                    <button onClick={handleBackToTree} className="mb-4 px-3 py-2 bg-slate-100 text-slate-700 font-semibold rounded-md hover:bg-slate-200 transition self-start flex items-center gap-2">
                        <ArrowLeftIcon /> Structure
                    </button>
                )}
                <form className="space-y-4 flex-grow overflow-y-auto pr-2" onSubmit={e => e.preventDefault()}>
                    {selectedItem.type === 'class' && <>
                        <div className="text-xl font-semibold text-slate-800">Édition de la Classe</div>
                        <FormInput label="Nom" id="name" value={(item as Class).name} />
                    </>}
                    {selectedItem.type === 'chapter' && <>
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-slate-800">Édition du Chapitre</h3>
                            <button type="button" onClick={() => setImportModalOpen(true)} className="px-3 py-1.5 bg-yellow-400 text-yellow-900 text-sm font-semibold rounded-md hover:bg-yellow-500 transition">Importer JSON</button>
                        </div>
                        <FormInput label="Nom" id="name" value={(item as Chapter).name} />
                    </>}
                    {selectedItem.type === 'exercise' && <>
                        <div className="text-xl font-semibold text-slate-800">Édition de l'Exercice</div>
                        <FormInput label="Titre" id="title" value={(item as Exercise).title} />
                        <FormInput label="Difficulté (1-5)" id="difficulty" value={(item as Exercise).difficulty} type="number" />
                        <FormTextarea label="Énoncé (HTML/MathJax)" id="statement" value={(item as Exercise).statement} />
                        <FormInput label="ID Vidéo YouTube" id="youtubeId" value={(item as Exercise).video.youtubeId} />
                        <div>
                            <h4 className="text-md font-medium text-slate-700 mb-2 mt-3">Marqueurs Temporels (Timestamps)</h4>
                            <div className="space-y-2">
                                {((item as Exercise).video.timestamps || []).map((ts, index) => (
                                    <div key={index} className="flex items-center space-x-2 p-2 bg-slate-100/70 rounded-md border border-slate-200">
                                        <input 
                                            type="text" 
                                            placeholder="Label" 
                                            value={ts.label} 
                                            onChange={(e) => handleTimestampChange(index, 'label', e.target.value)}
                                            className="w-full p-1.5 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm"
                                        />
                                        <input 
                                            type="number" 
                                            placeholder="Temps (s)" 
                                            value={ts.time}
                                            min={0}
                                            onChange={(e) => handleTimestampChange(index, 'time', Number(e.target.value))}
                                            className="w-28 p-1.5 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => handleRemoveTimestamp(index)}
                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-full transition"
                                        >
                                            <TrashIcon className="w-5 h-5"/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button 
                                type="button"
                                onClick={handleAddTimestamp} 
                                className="mt-2 text-sm text-indigo-600 font-semibold hover:text-indigo-800 transition flex items-center gap-1"
                            >
                                <PlusCircleIcon className="w-5 h-5" />
                                Ajouter un marqueur
                            </button>
                        </div>
                        <FormTextarea label="Rappel de cours (HTML)" id="courseReminder" value={(item as Exercise).courseReminder} />
                    </>}
                </form>
            </div>
        );
    };

    const isPathSelected = (type: string, path: number[]) => {
        if (!selectedItem) return false;
        if(selectedItem.type !== type) return false;
        return selectedItem.path.length === path.length && selectedItem.path.every((p, i) => p === path[i]);
    };
    
    const navClasses = isMobile && mobileView !== 'tree' ? 'hidden' : 'w-full md:w-[400px] border-r border-slate-200 p-2 md:p-3 overflow-y-auto bg-slate-50/70 flex-shrink-0';
    const mainClasses = isMobile && mobileView !== 'editor' ? 'hidden md:block' : 'block w-full p-4 md:p-6 overflow-y-auto';

    return (
        <>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity animate-fade-in-fast" onClick={onClose}></div>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
            <div className="bg-white w-full max-w-7xl h-full md:h-[90vh] md:max-h-[850px] rounded-lg shadow-2xl flex flex-col transform transition-all animate-fade-in-up-fast">
                <header className="p-4 border-b border-slate-200 flex-shrink-0">
                    <h2 className="text-xl font-semibold text-slate-800">Éditeur de Contenu</h2>
                </header>
                <div className="flex-grow flex flex-col md:flex-row min-h-0">
                    <nav className={navClasses}>
                        <div className="flex justify-between items-center mb-3 p-1">
                            <h3 className="text-lg font-semibold text-slate-700">Structure</h3>
                            <button onClick={() => handleAddItem('class')} className="text-slate-500 hover:text-indigo-600" title="Ajouter une classe">
                                <PlusCircleIcon className="w-6 h-6"/>
                            </button>
                        </div>
                        <div className="space-y-1">
                            {editableDb.classes.map((cls, classIdx) => (
                                <div key={cls.id || classIdx}>
                                    <div className={`group flex items-center p-2 rounded-md transition-colors ${isPathSelected('class', [classIdx]) ? 'bg-indigo-100 text-indigo-900' : 'hover:bg-slate-200'}`}>
                                        <button onClick={() => toggleNode(`cls-${cls.id}`)} className="mr-1 p-1 text-slate-500 hover:text-slate-800">
                                            <ChevronDownIcon className={`w-4 h-4 transition-transform ${expandedNodes[`cls-${cls.id}`] ? 'rotate-180' : ''}`} />
                                        </button>
                                        <span className={`font-semibold cursor-pointer flex-grow ${isPathSelected('class', [classIdx]) ? 'text-indigo-900' : 'text-slate-800'}`} onClick={() => handleSelect({ type: 'class', path: [classIdx] })}>{cls.name}</span>
                                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleAddItem('chapter', [classIdx])} className="text-slate-500 hover:text-indigo-600" title="Ajouter un chapitre"><PlusCircleIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleDeleteItem('class', [classIdx])} className="text-slate-500 hover:text-red-600" title="Supprimer la classe"><TrashIcon className="w-5 h-5"/></button>
                                        </div>
                                    </div>
                                    <div className={`pl-5 ml-4 border-l-2 border-slate-200 space-y-1 overflow-hidden transition-all duration-300 ease-in-out`} style={{ maxHeight: expandedNodes[`cls-${cls.id}`] ? '1000px' : '0' }}>
                                        {cls.chapters.map((chap, chapIdx) => (
                                            <div key={chap.id || chapIdx} className="mt-1">
                                                <div className={`group flex items-center p-2 rounded-md transition-colors ${isPathSelected('chapter', [classIdx, chapIdx]) ? 'bg-indigo-100 text-indigo-900' : 'hover:bg-slate-200'}`}>
                                                    <button onClick={() => toggleNode(`chap-${chap.id}`)} className="mr-1 p-1 text-slate-500 hover:text-slate-800">
                                                        <ChevronDownIcon className={`w-4 h-4 transition-transform ${expandedNodes[`chap-${chap.id}`] ? 'rotate-180' : ''}`} />
                                                    </button>
                                                    <span className={`cursor-pointer flex-grow ${isPathSelected('chapter', [classIdx, chapIdx]) ? 'font-semibold text-indigo-900' : 'text-slate-700'}`} onClick={() => handleSelect({ type: 'chapter', path: [classIdx, chapIdx] })}>{chap.name}</span>
                                                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleAddItem('exercise', [classIdx, chapIdx])} className="text-slate-500 hover:text-indigo-600" title="Ajouter un exercice"><PlusCircleIcon className="w-5 h-5"/></button>
                                                        <button onClick={() => handleDeleteItem('chapter', [classIdx, chapIdx])} className="text-slate-500 hover:text-red-600" title="Supprimer le chapitre"><TrashIcon className="w-5 h-5"/></button>
                                                    </div>
                                                </div>
                                                <div className={`pl-5 ml-4 border-l-2 border-slate-200 space-y-1 overflow-hidden transition-all duration-300 ease-in-out`} style={{ maxHeight: expandedNodes[`chap-${chap.id}`] ? '1000px' : '0' }}>
                                                    {chap.exercises.map((ex, exIdx) => (
                                                        <div key={ex.id || exIdx} className={`group flex justify-between items-center p-2 rounded-md transition-colors mt-1 ${isPathSelected('exercise', [classIdx, chapIdx, exIdx]) ? 'bg-indigo-100 text-indigo-900' : 'hover:bg-slate-200'}`}>
                                                            <span className="cursor-pointer flex-grow truncate text-sm" onClick={() => handleSelect({ type: 'exercise', path: [classIdx, chapIdx, exIdx] })}>{ex.title}</span>
                                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button onClick={() => handleDeleteItem('exercise', [classIdx, chapIdx, exIdx])} className="ml-2 text-slate-500 hover:text-red-600" title="Supprimer l'exercice"><TrashIcon className="w-5 h-5"/></button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </nav>
                    <main className={mainClasses}>
                        {renderEditorForm()}
                    </main>
                </div>
                <footer className="p-4 border-t border-slate-200 bg-slate-50 flex-shrink-0 flex justify-between items-center">
                    <div className="text-xs text-slate-500 max-w-xs">
                        <strong>Pour persister :</strong> Téléchargez le fichier et remplacez <code>public/database.json</code> dans votre projet.
                    </div>
                    <div className="space-x-2">
                        <button onClick={onClose} className="px-5 py-2 bg-slate-200 text-slate-800 font-semibold rounded-md hover:bg-slate-300 transition">Fermer</button>
                        <button onClick={handleDownloadJson} className="px-5 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition">Télécharger JSON</button>
                        <button onClick={() => onSave(editableDb)} className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition">Appliquer (session)</button>
                    </div>
                </footer>
            </div>
        </div>
        {isImportModalOpen && selectedItem?.type === 'chapter' && (
            <JsonImportModal 
                chapterName={editableDb.classes[selectedItem.path[0]].chapters[selectedItem.path[1]].name}
                onClose={() => setImportModalOpen(false)}
                onImport={(exercises, strategy) => handleJsonImport(exercises, selectedItem.path as [number, number], strategy)}
            />
        )}
        </>
    );
};

export default AdminModal;
