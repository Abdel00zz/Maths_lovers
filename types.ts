

export interface QuizQuestion {
    type: 'qcm' | 'vrai-faux';
    question: string;
    options?: string[];
    answerIndex?: number;
    answer?: boolean;
}

export interface Quiz {
    questions: QuizQuestion[];
}

export interface VideoTimestamp {
    label: string;
    time: number; // start time in seconds
}

export interface Video {
    youtubeId: string;
    timestamps: VideoTimestamp[];
}

export interface Exercise {
    id: string;
    title: string;
    difficulty: number;
    statement: string;
    video: Video;
    courseReminder: string;
    quiz: Quiz;
}

export interface Chapter {
    id: string;
    name: string;
    exercises: Exercise[];
}

export interface Class {
    id: string;
    name: string;
    chapters: Chapter[];
}

export interface Database {
    classes: Class[];
}

export interface User {
    name: string;
    email?: string;
    phone?: string;
}
