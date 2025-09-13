import React, { useState, useRef, useEffect } from 'react';
import { Exercise } from '../types';
import QuizView from './QuizView';
import { MathJax } from 'better-react-mathjax';
import { StarIcon } from './Icons';

interface ExerciseViewProps {
    exercise: Exercise;
    index: number;
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => {
    const activeClasses = 'bg-slate-800 text-white shadow-sm';
    const inactiveClasses = 'text-slate-500 hover:bg-slate-200/60 hover:text-slate-700';
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 ${active ? activeClasses : inactiveClasses}`}
        >
            {children}
        </button>
    );
};

const DifficultyStars: React.FC<{ level: number }> = ({ level }) => (
    <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
            <StarIcon key={i} filled={i < level} />
        ))}
    </div>
);

const ExerciseView: React.FC<ExerciseViewProps> = ({ exercise, index }) => {
    const [activeTab, setActiveTab] = useState<'video' | 'course' | 'quiz'>('video');
    const [videoSrc, setVideoSrc] = useState('');
    const [activeTimestampIndex, setActiveTimestampIndex] = useState<number | null>(null);
    const statementRef = useRef<HTMLDivElement>(null);
    const videoColumnRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initialTime = exercise.video.timestamps[0]?.time || 0;
        const initialIndex = exercise.video.timestamps.length > 0 ? 0 : null;
        setVideoSrc(`https://www.youtube.com/embed/${exercise.video.youtubeId}?start=${initialTime}&rel=0&iv_load_policy=3&color=white`);
        setActiveTimestampIndex(initialIndex);
    }, [exercise]);

    useEffect(() => {
        const container = statementRef.current;
        if (!container) return;

        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const listItem = target.closest('li[data-timestamp-index]');
            if (listItem) {
                const tsIndex = parseInt(listItem.getAttribute('data-timestamp-index') || '', 10);
                if (!isNaN(tsIndex) && exercise.video.timestamps[tsIndex]) {
                    const time = exercise.video.timestamps[tsIndex].time;
                    setVideoSrc(`https://www.youtube.com/embed/${exercise.video.youtubeId}?start=${time}&rel=0&autoplay=1&iv_load_policy=3&color=white`);
                    setActiveTimestampIndex(tsIndex);
                    
                    setTimeout(() => {
                        videoColumnRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 100);
                }
            }
        };

        container.addEventListener('click', handleClick);
        return () => container.removeEventListener('click', handleClick);
    }, [exercise.video.youtubeId, exercise.video.timestamps]);

    useEffect(() => {
        const container = statementRef.current;
        if (!container) return;
        container.querySelectorAll('li[data-timestamp-index].active').forEach(el => el.classList.remove('active'));
        if (activeTimestampIndex !== null) {
            const activeEl = container.querySelector(`li[data-timestamp-index="${activeTimestampIndex}"]`);
            if (activeEl) activeEl.classList.add('active');
        }
    }, [activeTimestampIndex]);

    return (
        <div className="bg-white rounded-lg shadow-lg animate-fade-in-up overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
                
                {/* Right Column: Tabs (Order 1 on mobile, 2 on desktop) */}
                <div ref={videoColumnRef} className="p-6 lg:p-8 order-1 lg:order-2 lg:col-span-7">
                    <nav className="flex justify-center space-x-2 mb-4" aria-label="Tabs">
                        <TabButton active={activeTab === 'video'} onClick={() => setActiveTab('video')}>
                            Correction Vidéo
                        </TabButton>
                        <TabButton active={activeTab === 'course'} onClick={() => setActiveTab('course')}>
                            Rappel de cours
                        </TabButton>
                        <TabButton active={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')}>
                            Quiz
                        </TabButton>
                    </nav>

                    <div className="mt-6">
                        {activeTab === 'video' && (
                            <div className="aspect-ratio-16-9 rounded-lg shadow-md bg-black">
                                {exercise.video.youtubeId ? (
                                    <iframe
                                        key={videoSrc}
                                        src={videoSrc}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="rounded-lg"
                                    ></iframe>
                                ) : (
                                    <div className="flex items-center justify-center h-full bg-gray-100 absolute top-0 left-0 w-full rounded-lg">
                                        <p className="text-gray-500">Aucune vidéo disponible pour cet exercice.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'course' && (
                            <div className="bg-amber-50 border border-amber-200 p-5 rounded-lg">
                                <MathJax dynamic hideUntilTypeset="first">
                                    <div className="prose prose-lg max-w-none math-content" dangerouslySetInnerHTML={{ __html: exercise.courseReminder }} />
                                </MathJax>
                            </div>
                        )}
                        
                        {activeTab === 'quiz' && (
                            <QuizView quiz={exercise.quiz} />
                        )}
                    </div>
                </div>

                {/* Left Column: Statement (Order 2 on mobile, 1 on desktop) */}
                <div className="order-2 lg:order-1 lg:col-span-5 bg-slate-50 p-6 lg:p-8 border-t lg:border-t-0 lg:border-r border-slate-200 flex flex-col">
                    <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200/80 rounded-xl">
                        <div className="flex justify-between items-center">
                            <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Exercice {index}</h2>
                            <DifficultyStars level={exercise.difficulty} />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800 mt-1.5">{exercise.title}</h3>
                    </div>

                    <div className="flex-grow lg:overflow-y-auto lg:pr-2">
                        <MathJax dynamic hideUntilTypeset="first">
                            <div 
                                ref={statementRef}
                                className="prose prose-lg max-w-none math-content exercise-statement" 
                                dangerouslySetInnerHTML={{ __html: exercise.statement }} 
                            />
                        </MathJax>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExerciseView;