import axios from 'axios';
import { UserData } from '../constants/MockData';

// Access the API URL from environment variables
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

console.log(`[API] Configuring with Base URL: ${API_URL}`);

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor for logging
api.interceptors.request.use(request => {
    console.log('[API] Request:', request.method?.toUpperCase(), request.url);
    if (request.data instanceof FormData) {
        console.log('[API] Request Body: FormData');
    } else {
        // console.log('[API] Request Body:', JSON.stringify(request.data, null, 2));
    }
    return request;
});

// Add a response interceptor for logging errors
api.interceptors.response.use(
    response => {
        console.log('[API] Response:', response.status, response.config.url);
        return response;
    },
    error => {
        console.error('[API] Error:', error.message);
        if (error.response) {
            console.error('[API] Server Error Response:', error.response.status, error.response.data);
        }
        return Promise.reject(error);
    }
);

export const getDashboardOverview = async (uid: string = 'test-uid-123') => {
    try {
        const response = await api.get('/dashboard/overview', {
            headers: { 'x-auth-uid': uid }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch dashboard overview", error);
        throw error;
    }
};

export interface CreateRoadmapParams {
    examName: string;
    days: string;
    hours: string;
    minutes: string;
    level: string;
    commitment: string;
    syllabusFile: any; // DocumentPickerAsset
    pyqFile: any;      // DocumentPickerAsset
}

export const createRoadmap = async (params: CreateRoadmapParams, uid: string = 'test-uid-123') => {
    const formData = new FormData();

    formData.append('examName', params.examName);
    formData.append('days', params.days);
    formData.append('hours', params.hours);
    formData.append('minutes', params.minutes);
    formData.append('level', params.level);
    formData.append('commitment', params.commitment);

    if (params.syllabusFile) {
        formData.append('syllabusFile', {
            uri: params.syllabusFile.uri,
            name: params.syllabusFile.name || 'syllabus.pdf',
            type: params.syllabusFile.mimeType || 'application/pdf',
        } as any);
    }

    if (params.pyqFile) {
        formData.append('pyqFile', {
            uri: params.pyqFile.uri,
            name: params.pyqFile.name || 'pyq.pdf',
            type: params.pyqFile.mimeType || 'application/pdf',
        } as any);
    }

    try {
        const response = await api.post('/roadmap/create', formData, {
            headers: {
                'x-auth-uid': uid,
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to create roadmap", error);
        throw error;
    }
};

export const toggleStep = async (stepId: string, uid: string = 'test-uid-123') => {
    try {
        const response = await api.patch(`/roadmap/step/${stepId}`, {}, {
            headers: { 'x-auth-uid': uid }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to toggle step", error);
        throw error;
    }
}

export const resetRoadmapData = async (uid: string = 'test-uid-123') => {
    // Assuming backend might have a reset endpoint or we just clear via re-fetches
    // For now implement if backend supports, otherwise just a placeholder
    // The current backend doesn't seem to have a specific reset route separate from creating new
    return true;
}

export default api;
