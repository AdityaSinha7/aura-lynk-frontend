import axios from 'axios';
import { ChatMessage, ChatSession } from '../types/chat';

const API_URL = 'http://localhost:8080/api/chat';

const chatApi = axios.create({
  baseURL: API_URL,
});

chatApi.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    const { token } = JSON.parse(user);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const sendMessage = async (sessionId: number, message: string): Promise<ChatMessage> => {
  const response = await chatApi.post('/send', { sessionId, message });
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