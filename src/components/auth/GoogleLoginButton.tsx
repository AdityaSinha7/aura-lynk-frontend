import React from 'react';
import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { googleLogin } from '../../api/auth';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface GoogleLoginButtonProps {
  redirectPath: string;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ redirectPath }) => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleCredentialResponse = async (response: any) => {
      try {
        const authResponse = await googleLogin(response.credential);
        setUser(authResponse);
        navigate('/chat');
      } catch (error) {
        console.error('Google login failed:', error);
      }
    };

    window.google.accounts.id.initialize({
      client_id: '46396372633-vornp9nl1biq6u093corqmce14rq35v9.apps.googleusercontent.com',
      callback: handleCredentialResponse
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleLoginButton")!,
      { theme: "outline", size: "large", width: '100%' }
    );
  }, [setUser, navigate]);

  return (
    <div id="googleLoginButton" style={{ width: '100%', marginTop: '16px' }}>
      <Button
        fullWidth
        variant="outlined"
        startIcon={<GoogleIcon />}
        sx={{ mt: 2, mb: 2 }}
      >
        Sign in with Google
      </Button>
    </div>
  );
}; 