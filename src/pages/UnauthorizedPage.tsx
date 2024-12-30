import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/routes';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          You don't have permission to access this page.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate(ROUTES.USER.CHAT)}
        >
          Go to Chat
        </Button>
      </Box>
    </Container>
  );
}; 