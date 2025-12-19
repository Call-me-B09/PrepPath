export interface Task {
    id: string;
    title: string;
    completed: boolean;
    durationMinutes: number;
}

export interface SyllabusSection {
    id: string;
    title: string;
    completed: number; // 0-100
    totalTopics: number;
}

export interface UserData {
    hasRoadmap: boolean;
    examName: string;
    examDate: string; // ISO string
    examTimeLeftDays: number;
    tasks: Task[];
    syllabus: SyllabusSection[];
    userProfile: {
        name: string;
        email: string;
    };
}

export const MOCK_DATA: UserData = {
    hasRoadmap: true, // Toggle this to test Empty State
    examName: "JEE Advanced 2026",
    examDate: "2026-05-26",
    examTimeLeftDays: 45,
    tasks: [
        { id: '1', title: 'Revise Electrostatics Formulas', completed: false, durationMinutes: 45 },
        { id: '2', title: 'Solve 15 PYQs of Rotational Motion', completed: true, durationMinutes: 60 },
        { id: '3', title: 'Read NCERT - Organic Chemistry Ch 2', completed: false, durationMinutes: 30 },
    ],
    syllabus: [
        { id: '1', title: 'Physics', completed: 65, totalTopics: 20 },
        { id: '2', title: 'Chemistry', completed: 40, totalTopics: 22 },
        { id: '3', title: 'Mathematics', completed: 80, totalTopics: 18 },
    ],
    userProfile: {
        name: "Adhiraj Pal",
        email: "adhiraj@example.com",
    }
};

export const MOCK_EMPTY_DATA: UserData = {
    ...MOCK_DATA,
    hasRoadmap: false,
    tasks: [],
    syllabus: [],
    examName: "",
    examTimeLeftDays: 0,
};
