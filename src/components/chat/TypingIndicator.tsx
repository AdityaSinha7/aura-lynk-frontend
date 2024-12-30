import React from 'react';
import { Box, CircularProgress } from '@mui/material';

export const TypingIndicator: React.FC = () => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: 1,
    p: 1,
    color: 'text.secondary'
  }}>
    <CircularProgress size={16} />
    AuraLynk is typing...
  </Box>
); 