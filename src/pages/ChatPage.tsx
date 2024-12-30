import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, Typography, CircularProgress, AppBar, Toolbar, Button } from '@mui/material';
import { MessageList } from '../components/chat/MessageList';
import { MessageInput } from '../components/chat/MessageInput';
import { ChatMessage, ChatSession, MessageStatus } from '../types/chat';
import { useAuth } from '../contexts/AuthContext';
import * as chatApi from '../api/chat';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { SessionList } from '../components/chat/SessionList';
import * as chatService from '../services/ChatService';
import { AxiosError } from 'axios';
import { ChatNameDialog } from '../components/chat/ChatNameDialog';

export const ChatPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [sessionToRename, setSessionToRename] = useState<ChatSession | null>(null);

  const loadMessages = async (sessionId: number, page: number) => {
    try {
      const response = await chatApi.getMessages(sessionId, page);
      if (page === 0) {
        setMessages(response.content);
      } else {
        setMessages(prev => [...response.content, ...prev]);
      }
      setTotalPages(response.totalPages);
    } catch (err) {
      setError('Failed to load messages');
      console.error('Message loading error:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        const sessionsResponse = await chatApi.getSessions();
        setSessions(sessionsResponse.content);

        if (sessionsResponse.content.length > 0) {
          const firstSession = sessionsResponse.content[0];
          setSession(firstSession);
          const messagesResponse = await chatService.getMessages(firstSession.id);
          setMessages(messagesResponse.content);
          setTotalPages(messagesResponse.totalPages);
        } else {
          const newSession = await chatApi.createSession('New Chat');
          setSession(newSession);
          setSessions([newSession]);
        }
        setError(null);
      } catch (err) {
        console.error('Chat initialization error:', err);
        setError('Failed to load chat. Please try refreshing the page.');
        if (err instanceof AxiosError && err.response?.status === 403) {
          logout();
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, [navigate, logout]);

  const handleSendMessage = async (content: string) => {
    if (!session) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await chatService.sendMessage(session.id, content);
      const updatedMessages = await chatService.getMessages(session.id);
      setMessages(updatedMessages.content);
    } catch (err: unknown) {
      setError('Failed to send message');
      console.error('Message send error:', err);
      if (err instanceof AxiosError && err.response?.status === 403) {
        logout();
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!session || isLoadingMore || currentPage >= totalPages - 1) return;

    setIsLoadingMore(true);
    try {
      await loadMessages(session.id, currentPage + 1);
      setCurrentPage(prev => prev + 1);
    } catch (err) {
      setError('Failed to load more messages');
      console.error('Load more error:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleRetryMessage = async (messageId: string) => {
    const messageToRetry = messages.find(msg => msg.id === messageId);
    if (!messageToRetry || !session) return;

    // Update status to sending
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, status: 'sending' as MessageStatus }
          : msg
      )
    );

    try {
      await chatApi.sendMessage(session.id, messageToRetry.content);
      // Update status to sent
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, status: 'sent' as MessageStatus }
            : msg
        )
      );
    } catch (err: unknown) {
      setError('Failed to resend message');
      console.error('Message retry error:', err);
      if (err instanceof AxiosError && err.response?.status === 403) {
        logout();
        navigate('/login');
      }
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, status: 'error' as MessageStatus }
            : msg
        )
      );
    }
  };

  const handleSessionSelect = async (selectedSession: ChatSession) => {
    setSession(selectedSession);
    setMessages([]);
    setCurrentPage(0);
    setTotalPages(0);
    await loadMessages(selectedSession.id, 0);
  };

  const handleNewChat = async () => {
    try {
      setIsNameDialogOpen(true);
    } catch (err) {
      setError('Failed to prepare new chat');
      console.error('New chat error:', err);
    }
  };

  const handleCreateChat = async (name: string) => {
    try {
      const newSession = await chatApi.createSession(name);
      setSession(newSession);
      setMessages([]);
      setCurrentPage(0);
      setTotalPages(0);
      setSessions(prev => [newSession, ...prev]);
    } catch (err) {
      setError('Failed to create new chat');
      console.error('New chat error:', err);
    }
  };

  const handleRenameSession = async (sessionId: number) => {
    const sessionToRename = sessions.find(s => s.id === sessionId);
    if (sessionToRename) {
      setSessionToRename(sessionToRename);
      setIsNameDialogOpen(true);
    }
  };

  const handleSaveName = async (name: string) => {
    try {
      if (sessionToRename) {
        const updatedSession = await chatApi.updateSession(sessionToRename.id, name);
        setSessions(prev => prev.map(s => 
          s.id === updatedSession.id ? updatedSession : s
        ));
        if (session?.id === updatedSession.id) {
          setSession(updatedSession);
        }
      } else {
        await handleCreateChat(name);
      }
    } catch (err) {
      setError('Failed to update chat name');
      console.error('Rename error:', err);
    } finally {
      setSessionToRename(null);
    }
  };

  const handleSessionDelete = async (sessionId: number) => {
    try {
      await chatApi.deleteSession(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      
      // If the deleted session was the current one, switch to another session or create new
      if (session?.id === sessionId) {
        const remainingSessions = sessions.filter(s => s.id !== sessionId);
        if (remainingSessions.length > 0) {
          await handleSessionSelect(remainingSessions[0]);
        } else {
          await handleNewChat();
        }
      }
    } catch (err) {
      setError('Failed to delete session');
      console.error('Session deletion error:', err);
    }
  };

  // Poll for new messages every 5 seconds
  useEffect(() => {
    if (!session) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await chatService.getMessages(session.id, 0, 50);
        // Only update if we have different messages
        if (response.content.length !== messages.length) {
          setMessages(response.content);
        }
      } catch (err) {
        console.error('Failed to poll messages:', err);
      }
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [session, messages.length]);

  if (!session) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ height: '100vh', py: 2 }}>
      <AppBar position="static" sx={{ mb: 2, borderRadius: 1 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AuraLynk Chat
          </Typography>
          <Button 
            color="inherit" 
            onClick={handleNewChat}
            startIcon={<AddIcon />}
            sx={{ mr: 2 }}
          >
            New Chat
          </Button>
          <Button 
            color="inherit" 
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', gap: 2, height: 'calc(100% - 80px)' }}>
        <SessionList
          sessions={sessions}
          currentSessionId={session?.id || 0}
          onSessionSelect={handleSessionSelect}
          onSessionDelete={handleSessionDelete}
          onSessionRename={handleRenameSession}
        />
        <Paper 
          elevation={3} 
          sx={{ 
            flexGrow: 1,
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column' 
          }}
        >
          {error && (
            <Typography color="error" sx={{ p: 2 }}>
              {error}
            </Typography>
          )}
          <MessageList 
            messages={messages}
            hasMore={currentPage < totalPages - 1}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
            onRetryMessage={handleRetryMessage}
          />
          <MessageInput 
            onSendMessage={handleSendMessage} 
            disabled={isLoading}
          />
        </Paper>
      </Box>
      <ChatNameDialog
        open={isNameDialogOpen}
        defaultName={sessionToRename?.sessionName || ''}
        onClose={() => {
          setIsNameDialogOpen(false);
          setSessionToRename(null);
        }}
        onSave={handleSaveName}
      />
    </Container>
  );
}; 