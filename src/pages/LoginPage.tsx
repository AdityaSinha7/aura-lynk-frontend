import React from 'react';
import { Container, Paper, Tabs, Tab, Box, Typography } from '@mui/material';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { GoogleLoginButton } from '../components/auth/GoogleLoginButton';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

export const LoginPage: React.FC = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/chat';

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 2 }}>
        <Typography component="h1" variant="h5" align="center">
          Welcome to AuraLynk
        </Typography>
        <Tabs value={tabValue} onChange={handleChange} centered>
          <Tab label="Sign In" />
          <Tab label="Sign Up" />
        </Tabs>
        <TabPanel value={tabValue} index={0}>
          <LoginForm redirectPath={from} />
          <GoogleLoginButton redirectPath={from} />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <RegisterForm redirectPath={from} />
          <GoogleLoginButton redirectPath={from} />
        </TabPanel>
      </Paper>
    </Container>
  );
}; 