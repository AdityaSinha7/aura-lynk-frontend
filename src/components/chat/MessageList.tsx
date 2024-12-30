import React, { useRef, useEffect } from 'react';
import { Box, CircularProgress, Button } from '@mui/material';
import { ChatMessage } from '../../types/chat';
import { ChatBubble } from './ChatBubble';

interface MessageListProps {
  messages: ChatMessage[];
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  onRetryMessage?: (messageId: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  hasMore, 
  isLoadingMore, 
  onLoadMore,
  onRetryMessage 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
        p: 2,
        backgroundColor: 'grey.50',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {hasMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            variant="outlined"
            size="small"
          >
            {isLoadingMore ? (
              <CircularProgress size={20} />
            ) : (
              'Load More Messages'
            )}
          </Button>
        </Box>
      )}
      {messages.map((message) => (
        <ChatBubble 
          key={message.id} 
          message={message} 
          onRetry={onRetryMessage}
        />
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
}; 