import axios from 'axios';
import { ChatMessage, ChatSession } from '../types/chat';
import { CHAT_API_URL } from '../config/api';

const chatApi = axios.create({
  baseURL: CHAT_API_URL,
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
  const response = await chatApi.get(`/sessions/${sessionId}/messages?page=${page}&size=${size}`);
  return response.data;
}; 