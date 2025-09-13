import React, { useState, useEffect } from 'react';
import { Quiz, QuizQuestion } from '../types';
import { CheckCircleIcon, XCircleIcon } from './Icons';
import { MathJax } from 'better-react-mathjax';

interface QuizViewProps {
    quiz: Quiz;
}

const QuizView: React.FC<QuizViewProps> = ({ quiz }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<(number | boolean | null)[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        setCurrentQuestionIndex(0);
        setAnswers(new Array(quiz.questions.length).fill(null));
        setIsSubmitted(false);
    }, [quiz]);

    if (!quiz.questions || quiz.questions.length === 0) {
        return (
            <div className="text-gray-600 text-center py-8">
                <h4 className="text-xl font-medium">Pas de quiz disponible</h4>
                <p className="mt-2">Il n'y a pas encore de questions pour cet exercice.</p>
            </div>
        );
    }

    const handleAnswerChange = (answer: number | boolean) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = answer;
        setAnswers(newAnswers);
    };

    const goToNext = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const goToPrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
    };

    const handleReset = () => {
        setCurrentQuestionIndex(0);
        setAnswers(new Array(quiz.questions.length).fill(null));
        setIsSubmitted(false);
    };

    const renderReport = () => {
        let score = 0;
        quiz.questions.forEach((q, index) => {
            const userAnswer = answers[index];
            if ((q.type === 'qcm' && userAnswer === q.answerIndex) || (q.type === 'vrai-faux' && userAnswer === q.answer)) {
                score++;
            }
        });

        const scorePercentage = quiz.questions.length > 0 ? (score / quiz.questions.length) * 100 : 0;
        let scoreColor = 'text-green-600';
        if (scorePercentage < 75) scoreColor = 'text-yellow-600';
        if (scorePercentage < 40) scoreColor = 'text-red-600';

        return (
             <div className="animate-fade-in">
                <h3 className="text-2xl font-bold text-gray-800 text-center">Résultats du Quiz</h3>
                <div className="text-center my-4">
                    <p className="text-lg text-gray-600">Votre score final est de</p>
                    <p className={`text-5xl font-bold my-2 ${scoreColor}`}>{score} / {quiz.questions.length}</p>
                </div>
                <div className="space-y-4 mt-8">
                    <h4 className="text-xl font-semibold text-gray-700">Détail des réponses :</h4>
                    {quiz.questions.map((q, index) => {
                        const userAnswer = answers[index];
                        let isCorrect = (q.type === 'qcm' && userAnswer === q.answerIndex) || (q.type === 'vrai-faux' && userAnswer === q.answer);
                        let userAnswerText = '<i class="text-gray-500">Non répondu</i>';
                        let correctAnswerText = '';

                        if (q.type === 'qcm') {
                            if (userAnswer !== null && q.options) userAnswerText = q.options[userAnswer as number];
                            if(q.options) correctAnswerText = q.options[q.answerIndex as number];
                        } else {
                            if (userAnswer !== null) userAnswerText = userAnswer ? 'Vrai' : 'Faux';
                            correctAnswerText = q.answer ? 'Vrai' : 'Faux';
                        }

                        return (
                            <div key={index} className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                <div className="flex items-start">
                                    {isCorrect ? <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" /> : <XCircleIcon className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-1" />}
                                    <div className="prose prose-sm max-w-none">
                                        <MathJax dynamic hideUntilTypeset="first">
                                            <p className="font-semibold" dangerouslySetInnerHTML={{ __html: `<strong>Question ${index + 1}:</strong> ${q.question}` }} />
                                        </MathJax>
                                        <MathJax dynamic hideUntilTypeset="first">
                                            <p className="text-sm mt-2">Votre réponse : <span className="font-medium" dangerouslySetInnerHTML={{ __html: userAnswerText }} /></p>
                                        </MathJax>
                                        {!isCorrect && (
                                            <MathJax dynamic hideUntilTypeset="first">
                                                <p className="text-sm text-green-700">Réponse correcte : <span className="font-medium" dangerouslySetInnerHTML={{ __html: correctAnswerText }} /></p>
                                            </MathJax>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-8 flex justify-center">
                    <button onClick={handleReset} className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">
                        Recommencer le Quiz
                    </button>
                </div>
            </div>
        );
    };

    if (isSubmitted) {
        return <MathJax dynamic hideUntilTypeset="first">{renderReport()}</MathJax>;
    }
    
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

    return (
        <div>
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-semibold text-blue-600">Question {currentQuestionIndex + 1} sur {quiz.questions.length}</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <MathJax dynamic hideUntilTypeset="first">
                    <div 
                        className="prose prose-lg max-w-none mb-4" 
                        dangerouslySetInnerHTML={{ __html: `<strong>Question ${currentQuestionIndex + 1}:</strong> ${currentQuestion.question}` }} 
                    />
                </MathJax>
                <div className="space-y-3">
                    {currentQuestion.type === 'qcm' && currentQuestion.options?.map((option, optionIndex) => (
                        <label key={optionIndex} className="flex items-center space-x-3 p-3 border-2 rounded-md transition-all cursor-pointer border-gray-300 hover:bg-blue-50 hover:border-blue-300 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400">
                            <input type="radio" name={`question-${currentQuestionIndex}`} checked={answers[currentQuestionIndex] === optionIndex} onChange={() => handleAnswerChange(optionIndex)} className="form-radio h-5 w-5 text-blue-600"/>
                            <MathJax dynamic hideUntilTypeset="first">
                                <div className="prose prose-base max-w-none" dangerouslySetInnerHTML={{ __html: option }} />
                            </MathJax>
                        </label>
                    ))}
                    {currentQuestion.type === 'vrai-faux' && [true, false].map((option, optionIndex) => (
                        <label key={optionIndex} className="flex items-center space-x-3 p-3 border-2 rounded-md transition-all cursor-pointer border-gray-300 hover:bg-blue-50 hover:border-blue-300 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400">
                            <input type="radio" name={`question-${currentQuestionIndex}`} checked={answers[currentQuestionIndex] === option} onChange={() => handleAnswerChange(option)} className="form-radio h-5 w-5 text-blue-600" />
                            <span className="text-base font-medium">{option ? 'Vrai' : 'Faux'}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
                <button onClick={goToPrev} disabled={currentQuestionIndex === 0} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed">
                    Précédent
                </button>
                {currentQuestionIndex < quiz.questions.length - 1 ? (
                    <button onClick={goToNext} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
                        Suivant
                    </button>
                ) : (
                    <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition">
                        Terminer le quiz
                    </button>
                )}
            </div>
        </div>
    );
};

export default QuizView;