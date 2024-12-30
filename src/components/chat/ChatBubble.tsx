import React from 'react';
import { Box, Paper, Typography, IconButton, Tooltip } from '@mui/material';
import { ChatMessage } from '../../types/chat';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ReplayIcon from '@mui/icons-material/Replay';

interface ChatBubbleProps {
  message: ChatMessage;
  onRetry?: (messageId: string) => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onRetry }) => {
  const isUser = message.role === 'user';

  const renderStatus = () => {
    if (!isUser || !message.status) return null;

    const statusIcons = {
      sending: <ScheduleIcon fontSize="small" sx={{ opacity: 0.7 }} />,
      sent: <DoneIcon fontSize="small" sx={{ opacity: 0.7 }} />,
      delivered: <DoneAllIcon fontSize="small" sx={{ opacity: 0.7 }} />,
      error: (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ErrorOutlineIcon fontSize="small" color="error" />
          {onRetry && (
            <Tooltip title="Retry sending">
              <IconButton
                size="small"
                onClick={() => onRetry(message.id)}
                sx={{ ml: 0.5, color: 'inherit' }}
              >
                <ReplayIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    };

    return statusIcons[message.status];
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      <Paper
        elevation={1}
        sx={{
          p: 2,
          maxWidth: '70%',
          backgroundColor: isUser ? 'primary.light' : 'grey.100',
          color: isUser ? 'white' : 'text.primary',
          borderRadius: 2,
        }}
      >
        <Typography variant="body1">{message.content}</Typography>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.5,
          opacity: 0.7 
        }}>
          <Typography variant="caption">
            {new Date(message.timestamp).toLocaleTimeString()}
          </Typography>
          {renderStatus()}
        </Box>
      </Paper>
    </Box>
  );
}; 