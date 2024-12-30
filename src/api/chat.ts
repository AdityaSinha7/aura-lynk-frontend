import axios from 'axios';
import { ChatMessage, ChatSession } from '../types/chat';

const API_URL = 'http://localhost:8080/api/chat';

// Configure axios with auth token
const chatApi = axios.create({
  baseURL: API_URL,
});

chatApi.interceptors.request.use((config) => {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    throw new Error('No authentication token found');
  }
  
  const user = JSON.parse(userStr);
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

chatApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const createSession = async (sessionName: string): Promise<ChatSession> => {
  const response = await chatApi.post('/sessions', { sessionName });
  return response.data;
};

export const getSessions = async (page = 0, size = 20): Promise<{
  content: ChatSession[];
  totalPages: number;
  totalElements: number;
}> => {
  const response = await chatApi.get(`/sessions?page=${page}&size=${size}`);
  return response.data;
};

export const sendMessage = async (sessionId: number, message: string): Promise<ChatMessage> => {
  const response = await chatApi.post('/send', {
    sessionId,
    message,
  });
  return response.data;
};

export const getMessages = async (
  sessionId: number,
  page = 0,
  size = 50
): Promise<{
  content: ChatMessage[];
  totalPages: number;
  totalElements: number;
}> => {
  const response = await chatApi.get(
    `/sessions/${sessionId}/messages?page=${page}&size=${size}`
  );
  return response.data;
};

export const deleteSession = async (sessionId: number): Promise<void> => {
  await chatApi.delete(`/sessions/${sessionId}`);
};

export const updateSession = async (sessionId: number, sessionName: string): Promise<ChatSession> => {
  const response = await chatApi.put(`/sessions/${sessionId}`, { sessionName });
  return response.data;
}; 