import React, { useState, KeyboardEvent } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  disabled = false 
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ 
      p: 2, 
      display: 'flex', 
      gap: 1,
      position: 'relative',
      backgroundColor: 'background.paper'
    }}>
      <TextField
        fullWidth
        multiline
        maxRows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        disabled={disabled}
        sx={{ 
          backgroundColor: 'white',
          '& .MuiInputBase-root': {
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }
        }}
      />
      <IconButton 
        color="primary" 
        onClick={handleSend} 
        disabled={disabled || !message.trim()}
        sx={{ 
          alignSelf: 'flex-end',
          padding: { xs: 1, sm: 2 }
        }}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
}; 