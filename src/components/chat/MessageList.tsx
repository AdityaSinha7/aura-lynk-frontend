import React, { useRef, useEffect, useState } from 'react';
import { Box, CircularProgress, Button } from '@mui/material';
import { TypingIndicator } from './TypingIndicator';
import { ChatMessage } from '../../types/chat';
import { ChatBubble } from './ChatBubble';

interface MessageListProps {
  messages: ChatMessage[];
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  onRetryMessage?: (messageId: string) => void;
  isTyping?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  hasMore, 
  isLoadingMore, 
  onLoadMore,
  onRetryMessage,
  isTyping
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle scroll events to determine if we should auto-scroll
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollHeight, scrollTop, clientHeight } = containerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShouldAutoScroll(isNearBottom);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (shouldAutoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isTyping, shouldAutoScroll]);

  return (
    <Box 
      ref={containerRef}
      onScroll={handleScroll}
      sx={{ 
        flexGrow: 1, 
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        overflowX: 'hidden',
        p: 2,
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '4px',
          '&:hover': {
            background: '#555',
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
        <Box sx={{ flexGrow: 1 }} />
        {hasMore && (
          <Box sx={{ textAlign: 'center', my: 2 }}>
            <Button onClick={onLoadMore} disabled={isLoadingMore}>
              {isLoadingMore ? 'Loading...' : 'Load More'}
            </Button>
          </Box>
        )}
        {messages.map((message) => (
          <ChatBubble 
            key={message.id} 
            message={message} 
            onRetry={onRetryMessage ? () => onRetryMessage(message.id) : undefined}
          />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </Box>
    </Box>
  );
}; 