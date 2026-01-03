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

/*
 *
 * BACKEND ROUTE GUIDANCE
 * ----------------------
 * The following routes are recommended to serve the data modeled in this file.
 *
 * 1. Authentication
 *    - POST /api/auth/login
 *      - Body: { email, password }
 *      - Response: { token, user: { name, email, ... } }
 *      - Purpose: Authenticate user and return a session token.
 *
 * 2. User Profile (Corresponds to `userProfile` in `UserData`)
 *    - GET /api/user/profile
 *      - Headers: { Authorization: "Bearer <token>" }
 *      - Response: { name: string, email: string }
 *      - Purpose: Fetch current user's profile details.
 *    - PUT /api/user/profile
 *      - Body: { name?: string, email?: string }
 *      - Response: Updated user profile object.
 *      - Purpose: Update user profile information.
 *
 * 3. Dashboard / Home Data (Corresponds to `UserData` root properties)
 *    - GET /api/dashboard/overview
 *      - Response: {
 *          hasRoadmap: boolean,
 *          examName: string,
 *          examDate: string,
 *          examTimeLeftDays: number,
 *          tasks: Task[],        // Can also be fetched separately
 *          syllabus: SyllabusSection[] // Can also be fetched separately
 *        }
 *      - Purpose: Load the main dashboard state.
 *
 * 4. Tasks (Corresponds to `tasks` array)
 *    - GET /api/tasks
 *      - Response: Task[]
 *      - Purpose: Get all tasks for the user.
 *    - POST /api/tasks
 *      - Body: { title: string, durationMinutes: number }
 *      - Response: Created Task object (with generated id)
 *      - Purpose: Create a new task.
 *    - PATCH /api/tasks/:taskId
 *      - Body: { completed?: boolean, title?: string, ... }
 *      - Response: Updated Task object
 *      - Purpose: Mark a task as complete or update details.
 *    - DELETE /api/tasks/:taskId
 *      - Response: { success: true }
 *      - Purpose: Remove a task.
 *
 * 5. Syllabus (Corresponds to `syllabus` array)
 *    - GET /api/syllabus
 *      - Response: SyllabusSection[]
 *      - Purpose: Get syllabus progress data.
 *    - POST /api/syllabus/update-progress
 *      - Body: { sectionId: string, completedTopics: number }
 *      - Response: Updated SyllabusSection
 *      - Purpose: Update progress for a specific subject/section.
 *
 */
