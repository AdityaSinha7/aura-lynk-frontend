export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'error';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  status?: MessageStatus;
}

export interface ChatSession {
  id: number;
  sessionName: string;
  lastMessageAt: string;
  aiModel: string;
} 