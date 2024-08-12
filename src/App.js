import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { CssBaseline, Container } from '@mui/material';
import { responsiveFontSizes, createTheme, ThemeProvider } from '@mui/material/styles';
import { Paper, Logo } from './styles';

import {
  NotificationProvider,
  PrinterProvider,
  EventProvider
} from './providers';
import logo from './assets/logo.png';

import Form from './form';

const theme = responsiveFontSizes(
  createTheme({
    palette: {
      // Jefferson Blue
      primary: { main: '#002F6C' },
      // Rotunda Orange
      secondary: { main: '#E57200' },
    },
  })
);

export default function App() {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      loginWithRedirect().catch(err => {
        console.error('Failed to login:', err);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <PrinterProvider>
          <EventProvider>
            <Container maxWidth="lg">
              <Paper>
                <Logo src={logo} alt="UVA Career Center Logo" />
                <Form />
              </Paper>
            </Container>
          </EventProvider>
        </PrinterProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
